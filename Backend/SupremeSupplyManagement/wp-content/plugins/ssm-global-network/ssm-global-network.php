<?php
/**
 * Plugin Name: SSM Global Network
 * Description: Manages the Supreme Supply Management Global Network page and exposes it to the Next.js frontend.
 * Version: 1.0.0
 * Author: Supreme Supply Management
 */

if (!defined('ABSPATH')) exit;

function ssm_network_defaults() {
    return [
        'hero_title' => 'Big enough to connect you to the world. Personal enough to know your name.',
        'hero_intro' => 'International reach backed by personal coordination, trusted relationships and one dedicated Supreme team.',
        'sections' => [
            [
                'title' => 'More Than a Network. A Partnership.',
                'body' => "We understand that international logistics can be complex. Different time zones, customs requirements, documentation and transportation providers all need to work together.\n\nThat's where Supreme makes the difference.\n\nWe bring the moving parts together, maintain communication and remain personally invested in the outcome of every shipment.\n\nOur role is not simply to arrange transportation. It is to make your logistics experience easier, more dependable and more connected.",
                'bullets' => '',
                'closing' => '',
            ],
            [
                'title' => 'A World of Connections. One Point of Contact.',
                'body' => "Behind every successful shipment is a network of people, expertise and connections working together.\n\nAt Supreme, our global network extends beyond borders, connecting businesses to international markets through established logistics relationships and trusted industry partners.\n\nFrom the point of origin to final destination, we coordinate the movement of your cargo across continents, combining international reach with the personal attention of a dedicated logistics partner.\n\nWhether your business is importing, exporting or expanding into new markets, we bring the connections, coordination and commitment to keep your supply chain moving.",
                'bullets' => '',
                'closing' => 'Global reach, without losing the personal touch.',
            ],
            [
                'title' => 'Global Reach. Local Understanding.',
                'body' => "International logistics is about more than moving goods from one country to another. It requires an understanding of markets, regulations, transportation routes and the people who make global trade possible.\n\nThrough our international network, we facilitate freight movements across major global trade lanes while maintaining a strong understanding of South African logistics requirements.\n\nOur network supports:",
                'bullets' => "International import and export movements\nGlobal air and ocean freight connections\nRoad freight and cross-border transportation\nCustoms clearing and trade coordination\nWarehousing and distribution\nMultimodal logistics solutions\nEnd-to-end shipment coordination",
                'closing' => 'From international origins to destinations across South Africa and beyond, we connect the different stages of your logistics journey.',
            ],
            [
                'title' => 'Connected by Expertise. Driven by Relationships.',
                'body' => "Strong networks are built on strong relationships. We believe the strength of a logistics network is measured not only by its geographical reach, but by the people behind it.\n\nOur established relationships across the logistics industry allow us to coordinate solutions that respond to the individual requirements of each shipment.\n\nRather than offering a one-size-fits-all approach, we consider your cargo, timelines, budget and operational priorities before developing a suitable logistics solution.\n\nAnd while our network works across borders, you have a dedicated Supreme team to engage with, communicate with and hold accountable.",
                'bullets' => '',
                'closing' => 'You deal with us. We take care of the connections.',
            ],
            [
                'title' => 'One Network. Multiple Possibilities.',
                'body' => "Every shipment has its own requirements. Some demand speed, others require cost efficiency, specialised handling or carefully coordinated transportation across multiple modes.\n\nOur network allows us to bring different logistics capabilities together under one coordinated solution.",
                'bullets' => '',
                'closing' => '',
            ],
        ],
    ];
}

function ssm_network_sanitize($input) {
    $defaults = ssm_network_defaults();
    $values = [
        'hero_title' => sanitize_text_field($input['hero_title'] ?? $defaults['hero_title']),
        'hero_intro' => sanitize_textarea_field($input['hero_intro'] ?? $defaults['hero_intro']),
        'sections' => [],
    ];

    for ($i = 0; $i < 5; $i++) {
        $fallback = $defaults['sections'][$i];
        $section = $input['sections'][$i] ?? [];
        $values['sections'][] = [
            'title' => sanitize_text_field($section['title'] ?? $fallback['title']),
            'body' => sanitize_textarea_field($section['body'] ?? $fallback['body']),
            'bullets' => sanitize_textarea_field($section['bullets'] ?? $fallback['bullets']),
            'closing' => sanitize_textarea_field($section['closing'] ?? $fallback['closing']),
        ];
    }

    return $values;
}

add_action('admin_init', function() {
    register_setting('ssm_network_group', 'ssm_global_network_page', [
        'type' => 'array',
        'sanitize_callback' => 'ssm_network_sanitize',
        'default' => ssm_network_defaults(),
    ]);
});

add_action('admin_menu', function() {
    add_menu_page(
        'SSM Global Network',
        'Global Network',
        'manage_options',
        'ssm-global-network',
        'ssm_network_render_page',
        'dashicons-admin-site-alt3',
        25
    );
});

function ssm_network_render_page() {
    if (!current_user_can('manage_options')) return;
    $values = wp_parse_args(get_option('ssm_global_network_page', []), ssm_network_defaults());
    ?>
    <div class="wrap">
      <h1>Supreme Supply Management — Global Network</h1>
      <p>Edit the content shown on the Next.js <strong>Global Network</strong> page. Separate body paragraphs with a blank line and bullet items with a new line.</p>
      <form method="post" action="options.php">
        <?php settings_fields('ssm_network_group'); ?>
        <h2>Page introduction</h2>
        <table class="form-table" role="presentation">
          <tr><th><label for="ssm_network_hero_title">Hero title</label></th><td><textarea class="large-text" rows="3" id="ssm_network_hero_title" name="ssm_global_network_page[hero_title]"><?php echo esc_textarea($values['hero_title']); ?></textarea></td></tr>
          <tr><th><label for="ssm_network_hero_intro">Hero introduction</label></th><td><textarea class="large-text" rows="3" id="ssm_network_hero_intro" name="ssm_global_network_page[hero_intro]"><?php echo esc_textarea($values['hero_intro']); ?></textarea></td></tr>
        </table>

        <?php foreach ($values['sections'] as $index => $section): ?>
          <hr />
          <h2><?php echo esc_html(sprintf('%02d', $index + 1)); ?>. <?php echo esc_html($section['title']); ?></h2>
          <table class="form-table" role="presentation">
            <tr><th><label>Section title</label></th><td><input class="large-text" name="ssm_global_network_page[sections][<?php echo esc_attr($index); ?>][title]" value="<?php echo esc_attr($section['title']); ?>" /></td></tr>
            <tr><th><label>Body</label></th><td><textarea class="large-text" rows="10" name="ssm_global_network_page[sections][<?php echo esc_attr($index); ?>][body]"><?php echo esc_textarea($section['body']); ?></textarea></td></tr>
            <tr><th><label>Bullet list</label></th><td><textarea class="large-text" rows="7" name="ssm_global_network_page[sections][<?php echo esc_attr($index); ?>][bullets]"><?php echo esc_textarea($section['bullets']); ?></textarea><p class="description">Optional. Put one item on each line.</p></td></tr>
            <tr><th><label>Closing line</label></th><td><textarea class="large-text" rows="2" name="ssm_global_network_page[sections][<?php echo esc_attr($index); ?>][closing]"><?php echo esc_textarea($section['closing']); ?></textarea></td></tr>
          </table>
        <?php endforeach; ?>

        <?php submit_button(); ?>
      </form>
    </div>
    <?php
}

function ssm_network_paragraphs($text) {
    $parts = preg_split('/\R\s*\R/', trim((string) $text));
    if (!$parts) return [];
    return array_values(array_filter(array_map('trim', $parts)));
}

function ssm_network_bullets($text) {
    $parts = preg_split('/\R/', trim((string) $text));
    if (!$parts) return [];
    return array_values(array_filter(array_map('trim', $parts)));
}

function ssm_network_rest_item() {
    $values = wp_parse_args(get_option('ssm_global_network_page', []), ssm_network_defaults());
    $sections = [];
    foreach ($values['sections'] as $index => $section) {
        $sections[] = [
            'number' => sprintf('%02d', $index + 1),
            'title' => $section['title'],
            'paragraphs' => ssm_network_paragraphs($section['body']),
            'bullets' => ssm_network_bullets($section['bullets']),
            'closing' => $section['closing'],
        ];
    }

    return [
        'heroTitle' => $values['hero_title'],
        'heroIntro' => $values['hero_intro'],
        'sections' => $sections,
    ];
}

add_action('rest_api_init', function() {
    register_rest_route('ssm/v1', '/global-network', [
        'methods' => 'GET',
        'callback' => 'ssm_network_rest_item',
        'permission_callback' => '__return_true',
    ]);
});

register_activation_hook(__FILE__, function() {
    if (get_option('ssm_global_network_page', null) === null) {
        add_option('ssm_global_network_page', ssm_network_defaults());
    }
});
