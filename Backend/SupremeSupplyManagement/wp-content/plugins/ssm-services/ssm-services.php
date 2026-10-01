<?php
/**
 * Plugin Name: SSM Services
 * Description: Manages Supreme Supply Management services and exposes them to the Next.js frontend.
 * Version: 1.1.0
 * Author: Supreme Supply Management
 */

if (!defined('ABSPATH')) exit;

function ssm_services_register_post_type() {
    register_post_type('ssm_service', [
        'labels' => [
            'name' => 'Services',
            'singular_name' => 'Service',
            'add_new_item' => 'Add Service',
            'edit_item' => 'Edit Service',
        ],
        'public' => false,
        'show_ui' => true,
        'show_in_menu' => true,
        'menu_icon' => 'dashicons-admin-site-alt3',
        'supports' => ['title', 'editor', 'excerpt', 'page-attributes'],
    ]);
}
add_action('init', 'ssm_services_register_post_type');

function ssm_services_add_meta_box() {
    add_meta_box('ssm_service_details', 'Service Details', 'ssm_services_render_meta_box', 'ssm_service', 'normal', 'high');
}
add_action('add_meta_boxes', 'ssm_services_add_meta_box');

function ssm_services_render_meta_box($post) {
    wp_nonce_field('ssm_service_meta', 'ssm_service_meta_nonce');
    $kicker = get_post_meta($post->ID, '_ssm_service_kicker', true);
    $capabilities = get_post_meta($post->ID, '_ssm_service_capabilities', true);
    ?>
    <p><label for="ssm_service_kicker"><strong>Short heading / kicker</strong></label></p>
    <input type="text" id="ssm_service_kicker" name="ssm_service_kicker" value="<?php echo esc_attr($kicker); ?>" class="widefat" placeholder="e.g. When time matters." />
    <p><label for="ssm_service_capabilities"><strong>Capabilities</strong></label><br><small>Enter one capability per line.</small></p>
    <textarea id="ssm_service_capabilities" name="ssm_service_capabilities" rows="8" class="widefat"><?php echo esc_textarea($capabilities); ?></textarea>
    <p><small>Use the Excerpt box for the short summary and the main editor for the expanded service description. Use Order to control display order.</small></p>
    <?php
}

function ssm_services_save_meta($post_id) {
    if (!isset($_POST['ssm_service_meta_nonce']) || !wp_verify_nonce($_POST['ssm_service_meta_nonce'], 'ssm_service_meta')) return;
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $post_id)) return;

    if (isset($_POST['ssm_service_kicker'])) {
        update_post_meta($post_id, '_ssm_service_kicker', sanitize_text_field(wp_unslash($_POST['ssm_service_kicker'])));
    }
    if (isset($_POST['ssm_service_capabilities'])) {
        update_post_meta($post_id, '_ssm_service_capabilities', sanitize_textarea_field(wp_unslash($_POST['ssm_service_capabilities'])));
    }
}
add_action('save_post_ssm_service', 'ssm_services_save_meta');

function ssm_services_rest_items() {
    $posts = get_posts([
        'post_type' => 'ssm_service',
        'post_status' => 'publish',
        'posts_per_page' => -1,
        'orderby' => ['menu_order' => 'ASC', 'title' => 'ASC'],
    ]);

    return array_map(function($post) {
        $capabilities_raw = (string) get_post_meta($post->ID, '_ssm_service_capabilities', true);
        $capabilities = array_values(array_filter(array_map('trim', preg_split('/\r\n|\r|\n/', $capabilities_raw))));
        return [
            'id' => $post->ID,
            'slug' => $post->post_name,
            'title' => get_the_title($post),
            'kicker' => (string) get_post_meta($post->ID, '_ssm_service_kicker', true),
            'summary' => wp_strip_all_tags(get_the_excerpt($post)),
            'detailHtml' => wp_kses_post(apply_filters('the_content', $post->post_content)),
            'capabilities' => $capabilities,
        ];
    }, $posts);
}

add_action('rest_api_init', function() {
    register_rest_route('ssm/v1', '/services', [
        'methods' => 'GET',
        'callback' => 'ssm_services_rest_items',
        'permission_callback' => '__return_true',
    ]);
});

function ssm_services_activate() {
    ssm_services_register_post_type();
    $existing = get_posts(['post_type' => 'ssm_service', 'post_status' => 'any', 'posts_per_page' => 1]);
    if ($existing) return;

    $items = [
        [
            'title' => 'Sea Freight',
            'slug' => 'sea-freight',
            'kicker' => 'Global movement, considered carefully.',
            'summary' => 'Practical sea-freight support for imports and exports, from full container loads to shared cargo.',
            'content' => '<p>Our team helps clients navigate the procedures and cost considerations involved in moving cargo by sea. We work closely with shipping lines and agencies to find an appropriate route for each shipment.</p><p>Support spans import and export movements, customs processes and shipment visibility from origin through to destination.</p>',
            'capabilities' => "Customs clearance\nNVOCC\nDegroupage\nContainer tracking\nImport procedure consulting\nFCL exports\nLCL exports\nGroupage and bulk exports",
        ],
        [
            'title' => 'Air Freight',
            'slug' => 'air-freight',
            'kicker' => 'When time matters.',
            'summary' => 'Reliable air-freight solutions for importers and exporters who need speed without losing visibility.',
            'content' => '<p>Our team works efficiently and decisively to help reduce unnecessary ground time and keep time-sensitive freight moving.</p><p>We support both inbound and outbound air cargo with customs, tracking, costing and door-to-door coordination.</p>',
            'capabilities' => "Customs clearance\nTracking\nCostings\nIndent control\nImport procedure consulting\nDoor-to-door service\nConsolidated shipments\nDangerous goods exports",
        ],
        [
            'title' => 'Road Freight',
            'slug' => 'road-freight',
            'kicker' => 'Across South Africa. Across borders.',
            'summary' => 'Local and cross-border road freight with customs support into Southern and Sub-Saharan Africa.',
            'content' => '<p>Supreme Supply works with transporters and border agents to coordinate road-freight movements across South Africa and into neighbouring markets.</p><p>The service is suited to local deliveries as well as cross-border movements where transport and customs coordination need to work together.</p>',
            'capabilities' => "Local deliveries\nCross-border haulage\nNamibia\nBotswana\nLesotho\nEswatini\nMozambique\nZimbabwe\nMalawi\nZambia\nAngola\nDR Congo",
        ],
        [
            'title' => 'Warehousing',
            'slug' => 'warehousing',
            'kicker' => 'Space where the network needs it.',
            'summary' => 'Warehousing and distribution access in Johannesburg, Durban and Cape Town.',
            'content' => '<p>Supreme Supply has warehousing facilities at its Johannesburg office and outsourced warehousing facilities in Durban and Cape Town.</p><p>The facilities are positioned around key logistics gateways. The Johannesburg warehouse is located less than ten minutes from OR Tambo International Airport.</p>',
            'capabilities' => "Bonded warehousing\nDistribution warehousing\nJohannesburg\nDurban\nCape Town",
        ],
        [
            'title' => 'Supply Chain Management',
            'slug' => 'supply-chain-management',
            'kicker' => 'A clearer view from source to delivery.',
            'summary' => 'A tailored approach to planning, procurement, movement and distribution across the supply chain.',
            'content' => '<p>Effective supply chain management helps businesses reduce risk, improve coordination and connect sourcing decisions to the final customer experience.</p><p>Our approach is adapted to each client and can span planning, analysis, procurement, logistics and distribution rather than treating each stage in isolation.</p>',
            'capabilities' => "Planning\nAnalysis\nManagement\nProduct flow\nProcurement\nLogistics\nDistribution",
        ],
    ];

    foreach ($items as $index => $item) {
        $id = wp_insert_post([
            'post_type' => 'ssm_service',
            'post_status' => 'publish',
            'post_title' => $item['title'],
            'post_name' => $item['slug'],
            'post_excerpt' => $item['summary'],
            'post_content' => $item['content'],
            'menu_order' => $index + 1,
        ]);
        if (!is_wp_error($id)) {
            update_post_meta($id, '_ssm_service_kicker', $item['kicker']);
            update_post_meta($id, '_ssm_service_capabilities', $item['capabilities']);
        }
    }
}
register_activation_hook(__FILE__, 'ssm_services_activate');

// CSV import support.
require_once __DIR__ . '/includes/ssm-csv-importer.php';

add_action('admin_menu', function() {
    add_submenu_page(
        'edit.php?post_type=ssm_service',
        'Import Services CSV',
        'CSV Import',
        'edit_posts',
        'ssm-services-csv-import',
        'ssm_services_render_csv_import_page'
    );
});

function ssm_services_render_csv_import_page() {
    if (!current_user_can('edit_posts')) return;
    SSM_CSV_Importer::render_import_page([
        'title' => 'Services — CSV Import',
        'description' => 'Create or update services in bulk. Existing services are matched by slug first, then title. Capabilities can be separated with a vertical bar (|) or line breaks.',
        'columns' => ['title', 'slug', 'kicker', 'summary', 'detail_html', 'capabilities', 'order', 'status'],
        'prepare_action' => 'ssm_services_prepare_csv',
        'process_action' => 'ssm_services_process_csv_row',
        'nonce_action' => 'ssm_services_csv_import',
        'template_action' => 'ssm_services_csv_template',
    ]);
}

add_action('admin_post_ssm_services_csv_template', function() {
    if (!current_user_can('edit_posts')) wp_die('You are not allowed to download this template.');
    check_admin_referer('ssm_services_csv_template');
    $headers = ['title', 'slug', 'kicker', 'summary', 'detail_html', 'capabilities', 'order', 'status'];
    SSM_CSV_Importer::output_template('ssm-services-import-template.csv', $headers, [
        'title' => 'Example Service',
        'slug' => 'example-service',
        'kicker' => 'A short supporting line.',
        'summary' => 'A concise summary displayed before the expanded information.',
        'detail_html' => '<p>Longer service information can go here.</p>',
        'capabilities' => 'Capability one|Capability two|Capability three',
        'order' => '1',
        'status' => 'publish',
    ]);
});

add_action('wp_ajax_ssm_services_prepare_csv', function() {
    if (!current_user_can('edit_posts')) wp_send_json_error(['message' => 'You are not allowed to import services.'], 403);
    check_ajax_referer('ssm_services_csv_import');
    $parsed = SSM_CSV_Importer::parse_uploaded_csv($_FILES['csv_file'] ?? null);
    if (is_wp_error($parsed)) wp_send_json_error(['message' => $parsed->get_error_message()]);
    if (!in_array('title', $parsed['headers'], true)) wp_send_json_error(['message' => 'The Services CSV must contain a title column.']);
    $import_id = SSM_CSV_Importer::store_import('services', $parsed['rows']);
    wp_send_json_success(['import_id' => $import_id, 'total' => count($parsed['rows']), 'headers' => $parsed['headers']]);
});

add_action('wp_ajax_ssm_services_process_csv_row', function() {
    if (!current_user_can('edit_posts')) wp_send_json_error(['message' => 'You are not allowed to import services.'], 403);
    check_ajax_referer('ssm_services_csv_import');
    $import_id = sanitize_text_field(wp_unslash($_POST['import_id'] ?? ''));
    $index = intval($_POST['index'] ?? -1);
    $row = SSM_CSV_Importer::get_row('services', $import_id, $index);
    if (is_wp_error($row)) wp_send_json_error(['row' => $index + 2, 'message' => $row->get_error_message()]);
    $csv_row = intval($row['_csv_row'] ?? ($index + 2));
    $title = sanitize_text_field($row['title'] ?? '');
    if ($title === '') wp_send_json_error(['row' => $csv_row, 'message' => 'Missing required title.']);

    $slug = sanitize_title($row['slug'] ?? '');
    $existing = SSM_CSV_Importer::find_post('ssm_service', $slug, $title);
    $postarr = [
        'post_type' => 'ssm_service',
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

    update_post_meta($post_id, '_ssm_service_kicker', sanitize_text_field($row['kicker'] ?? ''));
    $caps = str_replace('|', "\n", (string) ($row['capabilities'] ?? ''));
    update_post_meta($post_id, '_ssm_service_capabilities', sanitize_textarea_field($caps));

    $data = SSM_CSV_Importer::get_import('services', $import_id);
    if (!is_wp_error($data) && $index >= count($data['rows']) - 1) SSM_CSV_Importer::delete_import('services', $import_id);
    wp_send_json_success(['row' => $csv_row, 'status' => 'success', 'message' => ($existing ? 'Updated' : 'Created') . ' service: ' . $title . '.']);
});
