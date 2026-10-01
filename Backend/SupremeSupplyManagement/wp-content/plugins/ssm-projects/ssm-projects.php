<?php
/**
 * Plugin Name: SSM Projects
 * Description: Manages Supreme Supply Management project case studies and exposes them to the Next.js frontend.
 * Version: 1.1.0
 * Author: Supreme Supply Management
 */

if (!defined('ABSPATH')) exit;

function ssm_projects_register_post_type() {
    register_post_type('ssm_project', [
        'labels' => [
            'name' => 'Projects',
            'singular_name' => 'Project',
            'add_new_item' => 'Add Project',
            'edit_item' => 'Edit Project',
        ],
        'public' => false,
        'show_ui' => true,
        'show_in_menu' => true,
        'menu_icon' => 'dashicons-portfolio',
        'supports' => ['title', 'editor', 'excerpt', 'page-attributes'],
    ]);
}
add_action('init', 'ssm_projects_register_post_type');

function ssm_projects_add_meta_box() {
    add_meta_box('ssm_project_details', 'Project Details', 'ssm_projects_render_meta_box', 'ssm_project', 'normal', 'high');
}
add_action('add_meta_boxes', 'ssm_projects_add_meta_box');

function ssm_projects_render_meta_box($post) {
    wp_nonce_field('ssm_project_meta', 'ssm_project_meta_nonce');
    $type = get_post_meta($post->ID, '_ssm_project_type', true);
    ?>
    <p><label for="ssm_project_type"><strong>Project type</strong></label></p>
    <input type="text" id="ssm_project_type" name="ssm_project_type" value="<?php echo esc_attr($type); ?>" class="widefat" placeholder="e.g. Industrial relocation" />
    <p><small>Use the title for the client/project name, the Excerpt box for the short summary and the main editor for the expanded project description. Use Order to control display order.</small></p>
    <?php
}

function ssm_projects_save_meta($post_id) {
    if (!isset($_POST['ssm_project_meta_nonce']) || !wp_verify_nonce($_POST['ssm_project_meta_nonce'], 'ssm_project_meta')) return;
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $post_id)) return;
    if (isset($_POST['ssm_project_type'])) {
        update_post_meta($post_id, '_ssm_project_type', sanitize_text_field(wp_unslash($_POST['ssm_project_type'])));
    }
}
add_action('save_post_ssm_project', 'ssm_projects_save_meta');

function ssm_projects_rest_items() {
    $posts = get_posts([
        'post_type' => 'ssm_project',
        'post_status' => 'publish',
        'posts_per_page' => -1,
        'orderby' => ['menu_order' => 'ASC', 'title' => 'ASC'],
    ]);

    return array_map(function($post) {
        return [
            'id' => $post->ID,
            'slug' => $post->post_name,
            'client' => get_the_title($post),
            'type' => (string) get_post_meta($post->ID, '_ssm_project_type', true),
            'summary' => wp_strip_all_tags(get_the_excerpt($post)),
            'detailHtml' => wp_kses_post(apply_filters('the_content', $post->post_content)),
        ];
    }, $posts);
}

add_action('rest_api_init', function() {
    register_rest_route('ssm/v1', '/projects', [
        'methods' => 'GET',
        'callback' => 'ssm_projects_rest_items',
        'permission_callback' => '__return_true',
    ]);
});

function ssm_projects_activate() {
    ssm_projects_register_post_type();
    $existing = get_posts(['post_type' => 'ssm_project', 'post_status' => 'any', 'posts_per_page' => 1]);
    if ($existing) return;

    $items = [
        ['title' => 'DStv', 'slug' => 'dstv-distribution', 'type' => 'Distribution', 'summary' => 'Serialized product distribution into African markets, with a focus on controlled movement and clear shipment visibility.', 'detail' => 'The project centred on coordinating serialized products as they moved into African markets. The logistics approach brings freight planning, documentation, shipment visibility and delivery coordination into one managed flow, helping keep hand-offs clear from dispatch through to destination.'],
        ['title' => '30-country campaign', 'slug' => '30-country-campaign', 'type' => 'Campaign logistics', 'summary' => 'International logistics support for an annual advertising campaign spanning 30 countries.', 'detail' => 'A multi-country campaign creates a different kind of logistics challenge: many destinations, shared deadlines and materials that need to arrive in the right place at the right time. The project showcases how international freight movements can be coordinated around a single campaign schedule while maintaining consistent communication across markets.'],
        ['title' => 'De Beers', 'slug' => 'de-beers', 'type' => 'Special project', 'summary' => 'Export and re-import coordination for a specialised international logistics requirement.', 'detail' => 'This specialised movement required an export and subsequent re-import to be treated as one connected logistics process. The project highlights the value of careful planning, documentation and milestone visibility when goods need to move internationally and return through the supply chain.'],
        ['title' => 'Halifax → Johannesburg', 'slug' => 'halifax-johannesburg', 'type' => 'Industrial relocation', 'summary' => 'End-to-end logistics for relocating a decommissioned chip manufacturing plant from Canada to Johannesburg.', 'detail' => 'The relocation involved moving industrial equipment from Halifax, Canada to Johannesburg after the plant was decommissioned. The project is a strong example of coordinating a complex international movement where route planning, freight handling and clear progress updates all need to work together.'],
        ['title' => 'Local manufacturer', 'slug' => 'local-manufacturer', 'type' => 'Supply chain', 'summary' => 'Ongoing import and export support integrated into a local manufacturer’s wider supply chain.', 'detail' => 'Rather than treating imports and exports as isolated shipments, this project reflects a more integrated supply-chain relationship. The focus is on coordinating recurring freight requirements with the manufacturer’s operational needs, giving the client a clearer and more consistent flow between inbound and outbound movements.'],
    ];

    foreach ($items as $index => $item) {
        wp_insert_post([
            'post_type' => 'ssm_project',
            'post_status' => 'publish',
            'post_title' => $item['title'],
            'post_name' => $item['slug'],
            'post_excerpt' => $item['summary'],
            'post_content' => '<p>' . esc_html($item['detail']) . '</p>',
            'menu_order' => $index + 1,
            'meta_input' => ['_ssm_project_type' => $item['type']],
        ]);
    }
}
register_activation_hook(__FILE__, 'ssm_projects_activate');

// CSV import support.
require_once __DIR__ . '/includes/ssm-csv-importer.php';

add_action('admin_menu', function() {
    add_submenu_page(
        'edit.php?post_type=ssm_project',
        'Import Projects CSV',
        'CSV Import',
        'edit_posts',
        'ssm-projects-csv-import',
        'ssm_projects_render_csv_import_page'
    );
});

function ssm_projects_render_csv_import_page() {
    if (!current_user_can('edit_posts')) return;
    SSM_CSV_Importer::render_import_page([
        'title' => 'Projects — CSV Import',
        'description' => 'Create or update projects in bulk. Existing projects are matched by slug first, then project/client title.',
        'columns' => ['client', 'slug', 'type', 'summary', 'detail_html', 'order', 'status'],
        'prepare_action' => 'ssm_projects_prepare_csv',
        'process_action' => 'ssm_projects_process_csv_row',
        'nonce_action' => 'ssm_projects_csv_import',
        'template_action' => 'ssm_projects_csv_template',
    ]);
}

add_action('admin_post_ssm_projects_csv_template', function() {
    if (!current_user_can('edit_posts')) wp_die('You are not allowed to download this template.');
    check_admin_referer('ssm_projects_csv_template');
    $headers = ['client', 'slug', 'type', 'summary', 'detail_html', 'order', 'status'];
    SSM_CSV_Importer::output_template('ssm-projects-import-template.csv', $headers, [
        'client' => 'Example Project',
        'slug' => 'example-project',
        'type' => 'Project type',
        'summary' => 'A short project summary shown in the collapsed row.',
        'detail_html' => '<p>Expanded project details go here.</p>',
        'order' => '1',
        'status' => 'publish',
    ]);
});

add_action('wp_ajax_ssm_projects_prepare_csv', function() {
    if (!current_user_can('edit_posts')) wp_send_json_error(['message' => 'You are not allowed to import projects.'], 403);
    check_ajax_referer('ssm_projects_csv_import');
    $parsed = SSM_CSV_Importer::parse_uploaded_csv($_FILES['csv_file'] ?? null);
    if (is_wp_error($parsed)) wp_send_json_error(['message' => $parsed->get_error_message()]);
    if (!in_array('client', $parsed['headers'], true) && !in_array('title', $parsed['headers'], true)) {
        wp_send_json_error(['message' => 'The Projects CSV must contain a client column (or title).']);
    }
    $import_id = SSM_CSV_Importer::store_import('projects', $parsed['rows']);
    wp_send_json_success(['import_id' => $import_id, 'total' => count($parsed['rows']), 'headers' => $parsed['headers']]);
});

add_action('wp_ajax_ssm_projects_process_csv_row', function() {
    if (!current_user_can('edit_posts')) wp_send_json_error(['message' => 'You are not allowed to import projects.'], 403);
    check_ajax_referer('ssm_projects_csv_import');
    $import_id = sanitize_text_field(wp_unslash($_POST['import_id'] ?? ''));
    $index = intval($_POST['index'] ?? -1);
    $row = SSM_CSV_Importer::get_row('projects', $import_id, $index);
    if (is_wp_error($row)) wp_send_json_error(['row' => $index + 2, 'message' => $row->get_error_message()]);
    $csv_row = intval($row['_csv_row'] ?? ($index + 2));
    $title = sanitize_text_field($row['client'] ?? ($row['title'] ?? ''));
    if ($title === '') wp_send_json_error(['row' => $csv_row, 'message' => 'Missing required client/project title.']);

    $slug = sanitize_title($row['slug'] ?? '');
    $existing = SSM_CSV_Importer::find_post('ssm_project', $slug, $title);
    $postarr = [
        'post_type' => 'ssm_project',
        'post_status' => SSM_CSV_Importer::csv_status($row['status'] ?? 'publish'),
        'post_title' => $title,
        'post_excerpt' => sanitize_textarea_field($row['summary'] ?? ''),
        'post_content' => wp_kses_post($row['detail_html'] ?? ''),
        'menu_order' => intval($row['order'] ?? 0),
    ];
    if ($slug !== '') $postarr['post_name'] = $slug;
    if ($existing) $postarr['ID'] = $existing->ID;
    $post_id = $existing ? wp_update_post($postarr, true) : wp_insert_post($postarr, true);
    if (is_wp_error($post_id)) wp_send_json_error(['row' => $csv_row, 'message' => $post_id->get_error_message()]);
    update_post_meta($post_id, '_ssm_project_type', sanitize_text_field($row['type'] ?? ''));

    $data = SSM_CSV_Importer::get_import('projects', $import_id);
    if (!is_wp_error($data) && $index >= count($data['rows']) - 1) SSM_CSV_Importer::delete_import('projects', $import_id);
    wp_send_json_success(['row' => $csv_row, 'status' => 'success', 'message' => ($existing ? 'Updated' : 'Created') . ' project: ' . $title . '.']);
});
