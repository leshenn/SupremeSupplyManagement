<?php
/**
 * Plugin Name: SSM Blog API
 * Description: Exposes normal WordPress blog posts in a clean REST format for the Supreme Supply Management Next.js frontend.
 * Version: 1.1.0
 * Author: Supreme Supply Management
 */

if (!defined('ABSPATH')) exit;

add_action('after_setup_theme', function() {
    add_theme_support('post-thumbnails');
});

add_action('init', function() {
    add_post_type_support('post', 'excerpt');
    add_post_type_support('post', 'thumbnail');
});

function ssm_blog_api_image($post_id) {
    $image_id = get_post_thumbnail_id($post_id);
    if (!$image_id) return [null, null];
    $url = wp_get_attachment_image_url($image_id, 'large');
    $alt = get_post_meta($image_id, '_wp_attachment_image_alt', true);
    return [$url ?: null, $alt ?: ''];
}

function ssm_blog_api_format_post($post) {
    list($image, $image_alt) = ssm_blog_api_image($post->ID);
    return [
        'id' => $post->ID,
        'slug' => $post->post_name,
        'title' => get_the_title($post),
        'date' => get_the_date(DATE_ATOM, $post),
        'excerpt' => wp_strip_all_tags(get_the_excerpt($post)),
        'contentHtml' => wp_kses_post(apply_filters('the_content', $post->post_content)),
        'image' => $image,
        'imageAlt' => $image_alt,
    ];
}

function ssm_blog_api_posts($request) {
    $limit = max(1, min(100, intval($request->get_param('limit') ?: 12)));
    $posts = get_posts([
        'post_type' => 'post',
        'post_status' => 'publish',
        'posts_per_page' => $limit,
        'orderby' => 'date',
        'order' => 'DESC',
    ]);
    return array_map('ssm_blog_api_format_post', $posts);
}

function ssm_blog_api_single($request) {
    $slug = sanitize_title($request['slug']);
    $posts = get_posts([
        'post_type' => 'post',
        'post_status' => 'publish',
        'name' => $slug,
        'posts_per_page' => 1,
    ]);
    if (!$posts) return new WP_Error('ssm_post_not_found', 'Post not found.', ['status' => 404]);
    return ssm_blog_api_format_post($posts[0]);
}

add_action('rest_api_init', function() {
    register_rest_route('ssm/v1', '/posts', [
        'methods' => 'GET',
        'callback' => 'ssm_blog_api_posts',
        'permission_callback' => '__return_true',
        'args' => [
            'limit' => [
                'default' => 12,
                'sanitize_callback' => 'absint',
            ],
        ],
    ]);
    register_rest_route('ssm/v1', '/posts/(?P<slug>[a-zA-Z0-9-]+)', [
        'methods' => 'GET',
        'callback' => 'ssm_blog_api_single',
        'permission_callback' => '__return_true',
    ]);
});

// CSV import support.
require_once __DIR__ . '/includes/ssm-csv-importer.php';

add_action('admin_menu', function() {
    add_submenu_page(
        'edit.php',
        'Import Blog Posts CSV',
        'CSV Import',
        'edit_posts',
        'ssm-blog-csv-import',
        'ssm_blog_render_csv_import_page'
    );
});

function ssm_blog_render_csv_import_page() {
    if (!current_user_can('edit_posts')) return;
    SSM_CSV_Importer::render_import_page([
        'title' => 'Blog Posts — CSV Import',
        'description' => 'Create or update normal WordPress posts. Featured image URLs are optional. If an image cannot be downloaded, the post is still imported and the row is reported as a warning.',
        'columns' => ['title', 'slug', 'excerpt', 'content_html', 'date', 'status', 'featured_image_url', 'featured_image_alt'],
        'prepare_action' => 'ssm_blog_prepare_csv',
        'process_action' => 'ssm_blog_process_csv_row',
        'nonce_action' => 'ssm_blog_csv_import',
        'template_action' => 'ssm_blog_csv_template',
    ]);
}

add_action('admin_post_ssm_blog_csv_template', function() {
    if (!current_user_can('edit_posts')) wp_die('You are not allowed to download this template.');
    check_admin_referer('ssm_blog_csv_template');
    $headers = ['title', 'slug', 'excerpt', 'content_html', 'date', 'status', 'featured_image_url', 'featured_image_alt'];
    SSM_CSV_Importer::output_template('ssm-blog-import-template.csv', $headers, [
        'title' => 'Example Blog Post',
        'slug' => 'example-blog-post',
        'excerpt' => 'A short summary of the article.',
        'content_html' => '<p>This is the main blog article content.</p>',
        'date' => current_time('Y-m-d H:i:s'),
        'status' => 'publish',
        'featured_image_url' => 'https://example.com/image.jpg',
        'featured_image_alt' => 'Example logistics image',
    ]);
});

add_action('wp_ajax_ssm_blog_prepare_csv', function() {
    if (!current_user_can('edit_posts')) wp_send_json_error(['message' => 'You are not allowed to import blog posts.'], 403);
    check_ajax_referer('ssm_blog_csv_import');
    $parsed = SSM_CSV_Importer::parse_uploaded_csv($_FILES['csv_file'] ?? null);
    if (is_wp_error($parsed)) wp_send_json_error(['message' => $parsed->get_error_message()]);
    if (!in_array('title', $parsed['headers'], true)) wp_send_json_error(['message' => 'The Blog CSV must contain a title column.']);
    $import_id = SSM_CSV_Importer::store_import('blog', $parsed['rows']);
    wp_send_json_success(['import_id' => $import_id, 'total' => count($parsed['rows']), 'headers' => $parsed['headers']]);
});

add_action('wp_ajax_ssm_blog_process_csv_row', function() {
    if (!current_user_can('edit_posts')) wp_send_json_error(['message' => 'You are not allowed to import blog posts.'], 403);
    check_ajax_referer('ssm_blog_csv_import');
    $import_id = sanitize_text_field(wp_unslash($_POST['import_id'] ?? ''));
    $index = intval($_POST['index'] ?? -1);
    $row = SSM_CSV_Importer::get_row('blog', $import_id, $index);
    if (is_wp_error($row)) wp_send_json_error(['row' => $index + 2, 'message' => $row->get_error_message()]);
    $csv_row = intval($row['_csv_row'] ?? ($index + 2));
    $title = sanitize_text_field($row['title'] ?? '');
    if ($title === '') wp_send_json_error(['row' => $csv_row, 'message' => 'Missing required title.']);

    $slug = sanitize_title($row['slug'] ?? '');
    $existing = SSM_CSV_Importer::find_post('post', $slug, $title);
    $postarr = [
        'post_type' => 'post',
        'post_status' => SSM_CSV_Importer::csv_status($row['status'] ?? 'publish'),
        'post_title' => $title,
        'post_excerpt' => sanitize_textarea_field($row['excerpt'] ?? ''),
        'post_content' => wp_kses_post($row['content_html'] ?? ''),
    ];
    if ($slug !== '') $postarr['post_name'] = $slug;
    if (!empty($row['date'])) {
        $timestamp = strtotime((string) $row['date']);
        if ($timestamp === false) wp_send_json_error(['row' => $csv_row, 'message' => 'Invalid date. Use a value such as 2026-10-01 14:30:00.']);
        $postarr['post_date'] = wp_date('Y-m-d H:i:s', $timestamp, wp_timezone());
    }
    if ($existing) $postarr['ID'] = $existing->ID;
    $post_id = $existing ? wp_update_post($postarr, true) : wp_insert_post($postarr, true);
    if (is_wp_error($post_id)) wp_send_json_error(['row' => $csv_row, 'message' => $post_id->get_error_message()]);

    $warning = '';
    $image_url = esc_url_raw(trim((string) ($row['featured_image_url'] ?? '')));
    if ($image_url !== '') {
        if (!wp_http_validate_url($image_url)) {
            $warning = 'Post imported, but the featured_image_url is not a valid web URL.';
        } else {
            require_once ABSPATH . 'wp-admin/includes/media.php';
            require_once ABSPATH . 'wp-admin/includes/file.php';
            require_once ABSPATH . 'wp-admin/includes/image.php';
            $image_id = media_sideload_image($image_url, $post_id, sanitize_text_field($row['featured_image_alt'] ?? ''), 'id');
            if (is_wp_error($image_id)) {
                $warning = 'Post imported, but the featured image failed: ' . $image_id->get_error_message();
            } else {
                set_post_thumbnail($post_id, $image_id);
                $alt = sanitize_text_field($row['featured_image_alt'] ?? '');
                if ($alt !== '') update_post_meta($image_id, '_wp_attachment_image_alt', $alt);
            }
        }
    }

    $data = SSM_CSV_Importer::get_import('blog', $import_id);
    if (!is_wp_error($data) && $index >= count($data['rows']) - 1) SSM_CSV_Importer::delete_import('blog', $import_id);
    $verb = $existing ? 'Updated' : 'Created';
    wp_send_json_success([
        'row' => $csv_row,
        'status' => $warning ? 'warning' : 'success',
        'message' => $warning ? ($verb . ' post: ' . $title . '. ' . $warning) : ($verb . ' post: ' . $title . '.'),
    ]);
});
