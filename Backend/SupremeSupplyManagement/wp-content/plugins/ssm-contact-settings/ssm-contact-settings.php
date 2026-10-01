<?php
/**
 * Plugin Name: SSM Contact Settings
 * Description: Controls Supreme Supply Management contact details used by the Next.js contact page and footer.
 * Version: 1.1.0
 * Author: Supreme Supply Management
 */

if (!defined('ABSPATH')) exit;

function ssm_contact_defaults() {
    return [
        'phone' => '+27 010 824 0157',
        'email' => 'info@supremesupply.co.za',
        'quote_email' => 'info@supremesupply.co.za',
        'address' => '16 Vuurslag Avenue, Spartan, Kempton Park, 1619',
        'linkedin' => 'https://www.linkedin.com/company/supreme-supply-management/',
        'map_query' => '16 Vuurslag Avenue, Spartan, Kempton Park, 1619',
    ];
}

function ssm_contact_sanitize($input) {
    $defaults = ssm_contact_defaults();
    return [
        'phone' => sanitize_text_field($input['phone'] ?? $defaults['phone']),
        'email' => sanitize_email($input['email'] ?? $defaults['email']),
        'quote_email' => sanitize_email($input['quote_email'] ?? $defaults['quote_email']),
        'address' => sanitize_textarea_field($input['address'] ?? $defaults['address']),
        'linkedin' => esc_url_raw($input['linkedin'] ?? $defaults['linkedin']),
        'map_query' => sanitize_text_field($input['map_query'] ?? $defaults['map_query']),
    ];
}

add_action('admin_init', function() {
    register_setting('ssm_contact_group', 'ssm_contact_details', [
        'type' => 'array',
        'sanitize_callback' => 'ssm_contact_sanitize',
        'default' => ssm_contact_defaults(),
    ]);
});

add_action('admin_menu', function() {
    add_options_page(
        'SSM Contact Details',
        'SSM Contact',
        'manage_options',
        'ssm-contact-settings',
        'ssm_contact_render_page'
    );
});

function ssm_contact_render_page() {
    if (!current_user_can('manage_options')) return;
    $values = wp_parse_args(get_option('ssm_contact_details', []), ssm_contact_defaults());
    ?>
    <div class="wrap">
      <h1>Supreme Supply Management — Contact Details</h1>
      <p>These details are read by the Next.js contact page and footer.</p>
      <form method="post" action="options.php">
        <?php settings_fields('ssm_contact_group'); ?>
        <table class="form-table" role="presentation">
          <tr><th><label for="ssm_phone">Phone</label></th><td><input class="regular-text" id="ssm_phone" name="ssm_contact_details[phone]" value="<?php echo esc_attr($values['phone']); ?>" /></td></tr>
          <tr><th><label for="ssm_email">Public email</label></th><td><input class="regular-text" type="email" id="ssm_email" name="ssm_contact_details[email]" value="<?php echo esc_attr($values['email']); ?>" /></td></tr>
          <tr><th><label for="ssm_quote_email">Quote email</label></th><td><input class="regular-text" type="email" id="ssm_quote_email" name="ssm_contact_details[quote_email]" value="<?php echo esc_attr($values['quote_email']); ?>" /><p class="description">Quote form emails are prepared for this address.</p></td></tr>
          <tr><th><label for="ssm_address">Office address</label></th><td><textarea class="large-text" rows="3" id="ssm_address" name="ssm_contact_details[address]"><?php echo esc_textarea($values['address']); ?></textarea></td></tr>
          <tr><th><label for="ssm_linkedin">LinkedIn URL</label></th><td><input class="large-text" type="url" id="ssm_linkedin" name="ssm_contact_details[linkedin]" value="<?php echo esc_attr($values['linkedin']); ?>" /></td></tr>
          <tr><th><label for="ssm_map_query">Google Maps location</label></th><td><input class="large-text" id="ssm_map_query" name="ssm_contact_details[map_query]" value="<?php echo esc_attr($values['map_query']); ?>" /><p class="description">Usually the same office address. This controls the embedded map.</p></td></tr>
        </table>
        <?php submit_button(); ?>
      </form>
    </div>
    <?php
}

function ssm_contact_rest_item() {
    $values = wp_parse_args(get_option('ssm_contact_details', []), ssm_contact_defaults());
    return [
        'phone' => $values['phone'],
        'email' => $values['email'],
        'quoteEmail' => $values['quote_email'],
        'address' => $values['address'],
        'linkedin' => $values['linkedin'],
        'mapQuery' => $values['map_query'],
    ];
}

add_action('rest_api_init', function() {
    register_rest_route('ssm/v1', '/contact', [
        'methods' => 'GET',
        'callback' => 'ssm_contact_rest_item',
        'permission_callback' => '__return_true',
    ]);
});

register_activation_hook(__FILE__, function() {
    if (get_option('ssm_contact_details', null) === null) {
        add_option('ssm_contact_details', ssm_contact_defaults());
    }
});

// CSV import support.
require_once __DIR__ . '/includes/ssm-csv-importer.php';

add_action('admin_menu', function() {
    add_options_page(
        'Import SSM Contact CSV',
        'SSM Contact CSV',
        'manage_options',
        'ssm-contact-csv-import',
        'ssm_contact_render_csv_import_page'
    );
});

function ssm_contact_render_csv_import_page() {
    if (!current_user_can('manage_options')) return;
    SSM_CSV_Importer::render_import_page([
        'title' => 'Contact Details — CSV Import',
        'description' => 'Import one row of contact settings. Blank cells keep the existing value, so you can update only the fields you need.',
        'columns' => ['phone', 'email', 'quote_email', 'address', 'linkedin', 'map_query'],
        'prepare_action' => 'ssm_contact_prepare_csv',
        'process_action' => 'ssm_contact_process_csv_row',
        'nonce_action' => 'ssm_contact_csv_import',
        'template_action' => 'ssm_contact_csv_template',
    ]);
}

add_action('admin_post_ssm_contact_csv_template', function() {
    if (!current_user_can('manage_options')) wp_die('You are not allowed to download this template.');
    check_admin_referer('ssm_contact_csv_template');
    $headers = ['phone', 'email', 'quote_email', 'address', 'linkedin', 'map_query'];
    $defaults = ssm_contact_defaults();
    SSM_CSV_Importer::output_template('ssm-contact-import-template.csv', $headers, $defaults);
});

add_action('wp_ajax_ssm_contact_prepare_csv', function() {
    if (!current_user_can('manage_options')) wp_send_json_error(['message' => 'You are not allowed to import contact settings.'], 403);
    check_ajax_referer('ssm_contact_csv_import');
    $parsed = SSM_CSV_Importer::parse_uploaded_csv($_FILES['csv_file'] ?? null, 10);
    if (is_wp_error($parsed)) wp_send_json_error(['message' => $parsed->get_error_message()]);
    $known = ['phone', 'email', 'quote_email', 'address', 'linkedin', 'map_query'];
    if (!array_intersect($known, $parsed['headers'])) wp_send_json_error(['message' => 'The Contact CSV does not contain any recognised contact columns.']);
    if (count($parsed['rows']) !== 1) wp_send_json_error(['message' => 'The Contact CSV must contain exactly one data row.']);
    $import_id = SSM_CSV_Importer::store_import('contact', $parsed['rows']);
    wp_send_json_success(['import_id' => $import_id, 'total' => 1, 'headers' => $parsed['headers']]);
});

add_action('wp_ajax_ssm_contact_process_csv_row', function() {
    if (!current_user_can('manage_options')) wp_send_json_error(['message' => 'You are not allowed to import contact settings.'], 403);
    check_ajax_referer('ssm_contact_csv_import');
    $import_id = sanitize_text_field(wp_unslash($_POST['import_id'] ?? ''));
    $index = intval($_POST['index'] ?? -1);
    $row = SSM_CSV_Importer::get_row('contact', $import_id, $index);
    if (is_wp_error($row)) wp_send_json_error(['row' => $index + 2, 'message' => $row->get_error_message()]);
    $csv_row = intval($row['_csv_row'] ?? ($index + 2));

    $values = wp_parse_args(get_option('ssm_contact_details', []), ssm_contact_defaults());
    $fields = ['phone', 'email', 'quote_email', 'address', 'linkedin', 'map_query'];
    foreach ($fields as $field) {
        if (isset($row[$field]) && trim((string) $row[$field]) !== '') $values[$field] = $row[$field];
    }
    if (!empty($values['email']) && !is_email($values['email'])) wp_send_json_error(['row' => $csv_row, 'message' => 'The public email address is invalid.']);
    if (!empty($values['quote_email']) && !is_email($values['quote_email'])) wp_send_json_error(['row' => $csv_row, 'message' => 'The quote email address is invalid.']);
    if (!empty($values['linkedin']) && !wp_http_validate_url($values['linkedin'])) wp_send_json_error(['row' => $csv_row, 'message' => 'The LinkedIn URL is invalid.']);

    update_option('ssm_contact_details', ssm_contact_sanitize($values));
    SSM_CSV_Importer::delete_import('contact', $import_id);
    wp_send_json_success(['row' => $csv_row, 'status' => 'success', 'message' => 'Updated Supreme Supply contact settings.']);
});
