<?php
/**
 * Plugin Name: SSM Testimonials
 * Description: Manages client testimonials for the Supreme Supply Management Next.js frontend.
 * Version: 1.1.0
 * Author: Supreme Supply Management
 */

if (!defined('ABSPATH')) exit;

function ssm_testimonials_register_post_type() {
    register_post_type('ssm_testimonial', [
        'labels' => [
            'name' => 'Testimonials',
            'singular_name' => 'Testimonial',
            'add_new_item' => 'Add Testimonial',
            'edit_item' => 'Edit Testimonial',
        ],
        'public' => false,
        'show_ui' => true,
        'show_in_menu' => true,
        'menu_icon' => 'dashicons-format-quote',
        'supports' => ['title', 'editor', 'page-attributes'],
    ]);
}
add_action('init', 'ssm_testimonials_register_post_type');

function ssm_testimonials_add_meta_box() {
    add_meta_box('ssm_testimonial_details', 'Client Details', 'ssm_testimonials_render_meta_box', 'ssm_testimonial', 'normal', 'high');
}
add_action('add_meta_boxes', 'ssm_testimonials_add_meta_box');

function ssm_testimonials_render_meta_box($post) {
    wp_nonce_field('ssm_testimonial_meta', 'ssm_testimonial_meta_nonce');
    $role = get_post_meta($post->ID, '_ssm_testimonial_role', true);
    $company = get_post_meta($post->ID, '_ssm_testimonial_company', true);
    ?>
    <p><label for="ssm_testimonial_role"><strong>Position / role</strong></label></p>
    <input type="text" id="ssm_testimonial_role" name="ssm_testimonial_role" value="<?php echo esc_attr($role); ?>" class="widefat" placeholder="e.g. CEO" />
    <p><label for="ssm_testimonial_company"><strong>Company</strong></label></p>
    <input type="text" id="ssm_testimonial_company" name="ssm_testimonial_company" value="<?php echo esc_attr($company); ?>" class="widefat" placeholder="e.g. Pamodzi Unique Engineering" />
    <p><small>Use the title for the person’s name and the main editor for the testimonial quote. Use Order to control which testimonial appears first.</small></p>
    <?php
}

function ssm_testimonials_save_meta($post_id) {
    if (!isset($_POST['ssm_testimonial_meta_nonce']) || !wp_verify_nonce($_POST['ssm_testimonial_meta_nonce'], 'ssm_testimonial_meta')) return;
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $post_id)) return;

    if (isset($_POST['ssm_testimonial_role'])) update_post_meta($post_id, '_ssm_testimonial_role', sanitize_text_field(wp_unslash($_POST['ssm_testimonial_role'])));
    if (isset($_POST['ssm_testimonial_company'])) update_post_meta($post_id, '_ssm_testimonial_company', sanitize_text_field(wp_unslash($_POST['ssm_testimonial_company'])));
}
add_action('save_post_ssm_testimonial', 'ssm_testimonials_save_meta');

function ssm_testimonials_rest_items() {
    $posts = get_posts([
        'post_type' => 'ssm_testimonial',
        'post_status' => 'publish',
        'posts_per_page' => -1,
        'orderby' => ['menu_order' => 'ASC', 'date' => 'DESC'],
    ]);

    return array_map(function($post) {
        return [
            'id' => $post->ID,
            'quote' => wp_strip_all_tags(apply_filters('the_content', $post->post_content)),
            'person' => get_the_title($post),
            'role' => (string) get_post_meta($post->ID, '_ssm_testimonial_role', true),
            'company' => (string) get_post_meta($post->ID, '_ssm_testimonial_company', true),
        ];
    }, $posts);
}

add_action('rest_api_init', function() {
    register_rest_route('ssm/v1', '/testimonials', [
        'methods' => 'GET',
        'callback' => 'ssm_testimonials_rest_items',
        'permission_callback' => '__return_true',
    ]);
});

function ssm_testimonials_activate() {
    ssm_testimonials_register_post_type();
    $existing = get_posts(['post_type' => 'ssm_testimonial', 'post_status' => 'any', 'posts_per_page' => 1]);
    if ($existing) return;

    wp_insert_post([
        'post_type' => 'ssm_testimonial',
        'post_status' => 'publish',
        'post_title' => 'Sindi Dlamini',
        'post_content' => 'Your support made a significant difference and contributed to the success of our Women\'s Day High Tea. The attendees truly appreciated the high-quality lunch bags, and they added a special touch to the overall experience. We deeply value your partnership and look forward to future opportunities to collaborate.',
        'menu_order' => 1,
        'meta_input' => [
            '_ssm_testimonial_role' => 'CEO',
            '_ssm_testimonial_company' => 'Pamodzi Unique Engineering',
        ],
    ]);
}
register_activation_hook(__FILE__, 'ssm_testimonials_activate');

// CSV import support.
require_once __DIR__ . '/includes/ssm-csv-importer.php';

add_action('admin_menu', function() {
    add_submenu_page(
        'edit.php?post_type=ssm_testimonial',
        'Import Testimonials CSV',
        'CSV Import',
        'edit_posts',
        'ssm-testimonials-csv-import',
        'ssm_testimonials_render_csv_import_page'
    );
});

function ssm_testimonials_render_csv_import_page() {
    if (!current_user_can('edit_posts')) return;
    SSM_CSV_Importer::render_import_page([
        'title' => 'Testimonials — CSV Import',
        'description' => 'Create or update testimonials in bulk. Existing testimonials are matched by slug first, then the person name.',
        'columns' => ['person', 'slug', 'role', 'company', 'quote', 'order', 'status'],
        'prepare_action' => 'ssm_testimonials_prepare_csv',
        'process_action' => 'ssm_testimonials_process_csv_row',
        'nonce_action' => 'ssm_testimonials_csv_import',
        'template_action' => 'ssm_testimonials_csv_template',
    ]);
}

add_action('admin_post_ssm_testimonials_csv_template', function() {
    if (!current_user_can('edit_posts')) wp_die('You are not allowed to download this template.');
    check_admin_referer('ssm_testimonials_csv_template');
    $headers = ['person', 'slug', 'role', 'company', 'quote', 'order', 'status'];
    SSM_CSV_Importer::output_template('ssm-testimonials-import-template.csv', $headers, [
        'person' => 'Jane Example',
        'slug' => 'jane-example',
        'role' => 'CEO',
        'company' => 'Example Company',
        'quote' => 'Supreme Supply provided clear communication throughout our shipment.',
        'order' => '1',
        'status' => 'publish',
    ]);
});

add_action('wp_ajax_ssm_testimonials_prepare_csv', function() {
    if (!current_user_can('edit_posts')) wp_send_json_error(['message' => 'You are not allowed to import testimonials.'], 403);
    check_ajax_referer('ssm_testimonials_csv_import');
    $parsed = SSM_CSV_Importer::parse_uploaded_csv($_FILES['csv_file'] ?? null);
    if (is_wp_error($parsed)) wp_send_json_error(['message' => $parsed->get_error_message()]);
    if (!in_array('person', $parsed['headers'], true) && !in_array('name', $parsed['headers'], true)) wp_send_json_error(['message' => 'The Testimonials CSV must contain a person column (or name).']);
    if (!in_array('quote', $parsed['headers'], true)) wp_send_json_error(['message' => 'The Testimonials CSV must contain a quote column.']);
    $import_id = SSM_CSV_Importer::store_import('testimonials', $parsed['rows']);
    wp_send_json_success(['import_id' => $import_id, 'total' => count($parsed['rows']), 'headers' => $parsed['headers']]);
});

add_action('wp_ajax_ssm_testimonials_process_csv_row', function() {
    if (!current_user_can('edit_posts')) wp_send_json_error(['message' => 'You are not allowed to import testimonials.'], 403);
    check_ajax_referer('ssm_testimonials_csv_import');
    $import_id = sanitize_text_field(wp_unslash($_POST['import_id'] ?? ''));
    $index = intval($_POST['index'] ?? -1);
    $row = SSM_CSV_Importer::get_row('testimonials', $import_id, $index);
    if (is_wp_error($row)) wp_send_json_error(['row' => $index + 2, 'message' => $row->get_error_message()]);
    $csv_row = intval($row['_csv_row'] ?? ($index + 2));
    $person = sanitize_text_field($row['person'] ?? ($row['name'] ?? ''));
    $quote = sanitize_textarea_field($row['quote'] ?? '');
    if ($person === '') wp_send_json_error(['row' => $csv_row, 'message' => 'Missing required person name.']);
    if ($quote === '') wp_send_json_error(['row' => $csv_row, 'message' => 'Missing required testimonial quote.']);

    $slug = sanitize_title($row['slug'] ?? '');
    $existing = SSM_CSV_Importer::find_post('ssm_testimonial', $slug, $person);
    $postarr = [
        'post_type' => 'ssm_testimonial',
        'post_status' => SSM_CSV_Importer::csv_status($row['status'] ?? 'publish'),
        'post_title' => $person,
        'post_content' => $quote,
        'menu_order' => intval($row['order'] ?? 0),
    ];
    if ($slug !== '') $postarr['post_name'] = $slug;
    if ($existing) $postarr['ID'] = $existing->ID;
    $post_id = $existing ? wp_update_post($postarr, true) : wp_insert_post($postarr, true);
    if (is_wp_error($post_id)) wp_send_json_error(['row' => $csv_row, 'message' => $post_id->get_error_message()]);
    update_post_meta($post_id, '_ssm_testimonial_role', sanitize_text_field($row['role'] ?? ''));
    update_post_meta($post_id, '_ssm_testimonial_company', sanitize_text_field($row['company'] ?? ''));

    $data = SSM_CSV_Importer::get_import('testimonials', $import_id);
    if (!is_wp_error($data) && $index >= count($data['rows']) - 1) SSM_CSV_Importer::delete_import('testimonials', $import_id);
    wp_send_json_success(['row' => $csv_row, 'status' => 'success', 'message' => ($existing ? 'Updated' : 'Created') . ' testimonial for ' . $person . '.']);
});
