<?php
/**
 * Plugin Name: SSM Company Page
 * Description: Manages the Supreme Supply Management Company page and exposes it to the Next.js frontend.
 * Version: 1.0.0
 * Author: Supreme Supply Management
 */

if (!defined('ABSPATH')) exit;

function ssm_company_defaults() {
    return [
        'hero_title' => 'Logistics built on relationships.',
        'hero_intro' => 'Personal service, practical solutions and global connections designed around the needs of your business.',
        'about_title' => 'About Us',
        'about_body' => "Founded in 2018 from humble beginnings, Supreme Supply Management was built on a simple belief: logistics is about more than moving cargo — it is about building relationships, earning trust, and connecting businesses to opportunities around the world.\n\nWith a hands-on, customer-focused approach, we provide personalised logistics solutions designed around the unique needs of every client. We understand that behind every shipment is a business, a commitment, and a customer depending on things being done right.\n\nWith industry experience and a dedicated team, we provide tailored solutions across international freight forwarding, customs clearing, and supply chain management. From local movements to international shipments, we navigate the complexities of logistics with a focus on reliability, transparency, and cost-effective solutions.\n\nOur journey has been shaped by strong relationships, integrity, and a commitment to excellence. While our network connects us globally, our approach remains personal — because we believe that exceptional service starts with understanding people.\n\nAt Supreme, we don't just move goods. We move businesses forward.",
        'mission' => 'To simplify global logistics through reliable, tailored solutions and personal service that keeps businesses moving forward.',
        'vision' => 'To be a trusted global logistics partner, connecting businesses and opportunities through lasting relationships and seamless supply chains.',
        'values_title' => 'Our Values',
        'values_intro' => 'The principles behind every shipment, every decision and every relationship.',
        'values' => [
            ['title' => 'People Before Shipments', 'body' => 'We believe logistics is ultimately about people. We take the time to understand our clients, their challenges and what matters to their business. Every relationship deserves personal attention, not just another transaction.'],
            ['title' => 'Trust Through Integrity', 'body' => "We do what we say we will do. We believe in honest communication, transparency and taking responsibility, especially when things don't go according to plan. Trust is earned through actions, not promises."],
            ['title' => 'Ownership & Accountability', 'body' => "When a shipment is entrusted to us, we treat it as our responsibility from beginning to end. We don't pass problems around or wait to be asked. We take initiative, find solutions and see things through."],
            ['title' => 'Global Thinking, Personal Service', 'body' => 'Our network may span continents, but our approach remains personal. We combine international connections and local understanding to deliver solutions that make sense for each client.'],
            ['title' => 'Always Moving Forward', 'body' => "We never settle for simply doing things the way they've always been done. Through continuous improvement, technology and fresh thinking, we look for smarter, more efficient and cost-effective ways to serve our clients."],
            ['title' => 'We Grow Together', 'body' => 'Our success is connected to the success of our clients, partners and people. We value long-term relationships over short-term wins and believe that when our clients grow, we grow with them.'],
        ],
    ];
}

function ssm_company_sanitize($input) {
    $defaults = ssm_company_defaults();
    $values = [];
    $values['hero_title'] = sanitize_text_field($input['hero_title'] ?? $defaults['hero_title']);
    $values['hero_intro'] = sanitize_textarea_field($input['hero_intro'] ?? $defaults['hero_intro']);
    $values['about_title'] = sanitize_text_field($input['about_title'] ?? $defaults['about_title']);
    $values['about_body'] = sanitize_textarea_field($input['about_body'] ?? $defaults['about_body']);
    $values['mission'] = sanitize_textarea_field($input['mission'] ?? $defaults['mission']);
    $values['vision'] = sanitize_textarea_field($input['vision'] ?? $defaults['vision']);
    $values['values_title'] = sanitize_text_field($input['values_title'] ?? $defaults['values_title']);
    $values['values_intro'] = sanitize_textarea_field($input['values_intro'] ?? $defaults['values_intro']);
    $values['values'] = [];

    for ($i = 0; $i < 6; $i++) {
        $fallback = $defaults['values'][$i];
        $item = $input['values'][$i] ?? [];
        $values['values'][] = [
            'title' => sanitize_text_field($item['title'] ?? $fallback['title']),
            'body' => sanitize_textarea_field($item['body'] ?? $fallback['body']),
        ];
    }

    return $values;
}

add_action('admin_init', function() {
    register_setting('ssm_company_group', 'ssm_company_page', [
        'type' => 'array',
        'sanitize_callback' => 'ssm_company_sanitize',
        'default' => ssm_company_defaults(),
    ]);
});

add_action('admin_menu', function() {
    add_menu_page(
        'SSM Company Page',
        'Company Page',
        'manage_options',
        'ssm-company-page',
        'ssm_company_render_page',
        'dashicons-building',
        24
    );
});

function ssm_company_render_page() {
    if (!current_user_can('manage_options')) return;
    $values = wp_parse_args(get_option('ssm_company_page', []), ssm_company_defaults());
    ?>
    <div class="wrap">
      <h1>Supreme Supply Management — Company Page</h1>
      <p>Edit the content shown on the Next.js <strong>Company</strong> page. Paragraphs in the About section should be separated with a blank line.</p>
      <form method="post" action="options.php">
        <?php settings_fields('ssm_company_group'); ?>
        <h2>Page introduction</h2>
        <table class="form-table" role="presentation">
          <tr><th><label for="ssm_company_hero_title">Hero title</label></th><td><input class="large-text" id="ssm_company_hero_title" name="ssm_company_page[hero_title]" value="<?php echo esc_attr($values['hero_title']); ?>" /></td></tr>
          <tr><th><label for="ssm_company_hero_intro">Hero introduction</label></th><td><textarea class="large-text" rows="3" id="ssm_company_hero_intro" name="ssm_company_page[hero_intro]"><?php echo esc_textarea($values['hero_intro']); ?></textarea></td></tr>
        </table>

        <h2>About Us</h2>
        <table class="form-table" role="presentation">
          <tr><th><label for="ssm_company_about_title">Section title</label></th><td><input class="regular-text" id="ssm_company_about_title" name="ssm_company_page[about_title]" value="<?php echo esc_attr($values['about_title']); ?>" /></td></tr>
          <tr><th><label for="ssm_company_about_body">About copy</label></th><td><textarea class="large-text" rows="16" id="ssm_company_about_body" name="ssm_company_page[about_body]"><?php echo esc_textarea($values['about_body']); ?></textarea></td></tr>
        </table>

        <h2>Mission & Vision</h2>
        <table class="form-table" role="presentation">
          <tr><th><label for="ssm_company_mission">Mission</label></th><td><textarea class="large-text" rows="4" id="ssm_company_mission" name="ssm_company_page[mission]"><?php echo esc_textarea($values['mission']); ?></textarea></td></tr>
          <tr><th><label for="ssm_company_vision">Vision</label></th><td><textarea class="large-text" rows="4" id="ssm_company_vision" name="ssm_company_page[vision]"><?php echo esc_textarea($values['vision']); ?></textarea></td></tr>
        </table>

        <h2>Values</h2>
        <table class="form-table" role="presentation">
          <tr><th><label for="ssm_company_values_title">Section label</label></th><td><input class="regular-text" id="ssm_company_values_title" name="ssm_company_page[values_title]" value="<?php echo esc_attr($values['values_title']); ?>" /></td></tr>
          <tr><th><label for="ssm_company_values_intro">Section heading</label></th><td><textarea class="large-text" rows="2" id="ssm_company_values_intro" name="ssm_company_page[values_intro]"><?php echo esc_textarea($values['values_intro']); ?></textarea></td></tr>
        </table>

        <?php foreach ($values['values'] as $index => $value): ?>
          <h3><?php echo esc_html(sprintf('%02d', $index + 1)); ?>. <?php echo esc_html($value['title']); ?></h3>
          <table class="form-table" role="presentation">
            <tr><th><label>Value title</label></th><td><input class="large-text" name="ssm_company_page[values][<?php echo esc_attr($index); ?>][title]" value="<?php echo esc_attr($value['title']); ?>" /></td></tr>
            <tr><th><label>Description</label></th><td><textarea class="large-text" rows="4" name="ssm_company_page[values][<?php echo esc_attr($index); ?>][body]"><?php echo esc_textarea($value['body']); ?></textarea></td></tr>
          </table>
        <?php endforeach; ?>

        <?php submit_button(); ?>
      </form>
    </div>
    <?php
}

function ssm_company_paragraphs($text) {
    $parts = preg_split('/\R\s*\R/', trim((string) $text));
    if (!$parts) return [];
    return array_values(array_filter(array_map('trim', $parts)));
}

function ssm_company_rest_item() {
    $values = wp_parse_args(get_option('ssm_company_page', []), ssm_company_defaults());
    $rest_values = [];
    foreach ($values['values'] as $index => $value) {
        $rest_values[] = [
            'number' => sprintf('%02d', $index + 1),
            'title' => $value['title'],
            'body' => $value['body'],
        ];
    }

    return [
        'heroTitle' => $values['hero_title'],
        'heroIntro' => $values['hero_intro'],
        'aboutTitle' => $values['about_title'],
        'aboutParagraphs' => ssm_company_paragraphs($values['about_body']),
        'mission' => $values['mission'],
        'vision' => $values['vision'],
        'valuesTitle' => $values['values_title'],
        'valuesIntro' => $values['values_intro'],
        'values' => $rest_values,
    ];
}

add_action('rest_api_init', function() {
    register_rest_route('ssm/v1', '/company', [
        'methods' => 'GET',
        'callback' => 'ssm_company_rest_item',
        'permission_callback' => '__return_true',
    ]);
});

register_activation_hook(__FILE__, function() {
    if (get_option('ssm_company_page', null) === null) {
        add_option('ssm_company_page', ssm_company_defaults());
    }
});
