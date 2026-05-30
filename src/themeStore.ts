export const themeFiles = {
  'style.css': `/*
Theme Name: ElectroStore WooCommerce
Theme URI: https://electrostore.com
Author: ElectroStore Team
Author URI: https://electrostore.com
Description: A modern, high-conversion WooCommerce theme built specifically for electronics, gadgets, and tech stores. Clean design, fast loading, and fully compatible with all WooCommerce extensions.
Version: 1.0.0
Requires at least: 5.8
Tested up to: 6.4
Requires PHP: 7.4
License: GNU General Public License v2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
Text Domain: electrostore
Tags: e-commerce, custom-colors, custom-menu, featured-images, translation-ready, electronics
*/

:root {
  --primary: #3b82f6; /* Blue 500 */
  --primary-hover: #2563eb; /* Blue 600 */
  --bg-color: #f8fafc;
  --text-dark: #0f172a;
  --text-light: #64748b;
  --border-color: #e2e8f0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background-color: var(--bg-color);
  color: var(--text-dark);
  margin: 0;
  padding: 0;
  line-height: 1.6;
}

a {
  color: var(--primary);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.electro-header {
  background: #ffffff;
  border-bottom: 1px solid var(--border-color);
  padding: 1.5rem 2rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.electro-header-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.electro-logo a {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--text-dark);
  text-transform: uppercase;
  letter-spacing: -0.05em;
  text-decoration: none;
}

.electro-logo span {
  color: var(--primary);
}

.electro-search {
  flex: 1;
  max-width: 500px;
  display: flex;
}

.electro-search input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: 8px 0 0 8px;
  outline: none;
}

.electro-search input:focus {
  border-color: var(--primary);
}

.electro-search button {
  background: var(--primary);
  color: #fff;
  border: none;
  padding: 0 1.5rem;
  border-radius: 0 8px 8px 0;
  font-weight: 600;
  cursor: pointer;
}

.electro-nav {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.electro-nav a {
  color: var(--text-dark);
  font-weight: 500;
}

.electro-main {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 2rem;
}

/* WOOCOMMERCE STYLES (Storefront Inspired) */
.woocommerce ul.products {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.woocommerce ul.products li.product {
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
}

.woocommerce ul.products li.product:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.woocommerce ul.products li.product img {
  max-width: 100%;
  height: auto;
  margin-bottom: 1rem;
  border-radius: 8px;
}

.woocommerce ul.products li.product .woocommerce-loop-product__title {
  font-size: 1.125rem;
  color: var(--text-dark);
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.woocommerce ul.products li.product .price {
  color: var(--primary);
  font-size: 1.25rem;
  font-weight: 700;
  display: block;
  margin-bottom: 1rem;
}

.woocommerce button.button.alt,
.woocommerce a.button {
  background-color: var(--primary) !important;
  color: #ffffff !important;
  border: none !important;
  border-radius: 8px !important;
  padding: 0.75rem 1.5rem !important;
  font-weight: 600 !important;
  width: 100%;
  display: inline-block;
  text-align: center;
  transition: background-color 0.2s;
}

.woocommerce button.button.alt:hover,
.woocommerce a.button:hover {
  background-color: var(--primary-hover) !important;
}

.electro-footer {
  background: #ffffff;
  border-top: 1px solid var(--border-color);
  padding: 4rem 2rem;
  margin-top: 4rem;
  text-align: center;
  color: var(--text-light);
}
`,
  'functions.php': `<?php
if ( ! defined( 'ABSPATH' ) ) exit;

function electrostore_setup() {
    add_theme_support( 'automatic-feed-links' );
    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );

    // WooCommerce Setup
    add_theme_support( 'woocommerce', array(
        'thumbnail_image_width' => 300,
        'single_image_width'    => 600,
        'product_grid'          => array(
            'default_rows'    => 3,
            'min_rows'        => 2,
            'max_rows'        => 8,
            'default_columns' => 4,
            'min_columns'     => 2,
            'max_columns'     => 5,
        ),
    ) );
    add_theme_support( 'wc-product-gallery-zoom' );
    add_theme_support( 'wc-product-gallery-lightbox' );
    add_theme_support( 'wc-product-gallery-slider' );
}
add_action( 'after_setup_theme', 'electrostore_setup' );

function electrostore_scripts() {
    wp_enqueue_style( 'electrostore-style', get_stylesheet_uri(), array(), '1.0.0' );
}
add_action( 'wp_enqueue_scripts', 'electrostore_scripts' );
`,
  'header.php': `<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header class="electro-header">
    <div class="electro-header-container">
        <div class="electro-logo">
            <a href="<?php echo esc_url( home_url( '/' ) ); ?>">
                Electro<span>Store</span>
            </a>
        </div>
        
        <div class="electro-search">
            <?php if ( class_exists( 'WooCommerce' ) ) : ?>
                <form role="search" method="get" class="woocommerce-product-search" action="<?php echo esc_url( home_url( '/' ) ); ?>">
                    <input type="search" class="search-field" placeholder="<?php echo esc_attr__( 'Search for products&hellip;', 'woocommerce' ); ?>" value="<?php echo get_search_query(); ?>" name="s" />
                    <button type="submit" value="<?php echo esc_attr_x( 'Search', 'submit button', 'woocommerce' ); ?>">Search</button>
                    <input type="hidden" name="post_type" value="product" />
                </form>
            <?php endif; ?>
        </div>

        <nav class="electro-nav">
            <?php if ( class_exists( 'WooCommerce' ) ) : ?>
                <a href="<?php echo esc_url( wc_get_page_permalink( 'myaccount' ) ); ?>">Account</a>
                <a href="<?php echo esc_url( wc_get_cart_url() ); ?>" style="display: flex; align-items: center; gap: 0.5rem; color: var(--primary);">
                    🛒 Cart (<?php echo WC()->cart->get_cart_contents_count(); ?>)
                </a>
            <?php endif; ?>
        </nav>
    </div>
</header>
<main class="electro-main">
`,
  'footer.php': `</main> <!-- .electro-main -->
<footer class="electro-footer">
    <div class="electro-container">
        <p>&copy; <?php echo date('Y'); ?> ElectroStore Theme.</p>
        <p style="margin-top: 0.5rem; font-size: 0.875rem;">Premium e-commerce architecture tailored for electronics, built for speed.</p>
    </div>
</footer>
<?php wp_footer(); ?>
</body>
</html>
`,
  'index.php': `<?php get_header(); ?>
<div style="background: #fff; padding: 2rem; border-radius: 12px; border: 1px solid var(--border-color);">
    <?php if ( have_posts() ) : ?>
        <header class="page-header" style="margin-bottom: 2rem;">
            <h1 class="page-title"><?php single_post_title(); ?></h1>
        </header>

        <?php
        while ( have_posts() ) :
            the_post();
            ?>
            <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
                <header class="entry-header">
                    <?php
                    if ( is_singular() ) :
                        the_title( '<h2 class="entry-title">', '</h2>' );
                    else :
                        the_title( '<h2 class="entry-title" style="margin-bottom:1rem;"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h2>' );
                    endif;
                    ?>
                </header>

                <div class="entry-content">
                    <?php
                    the_content();
                    ?>
                </div>
            </article>
            <hr style="border: 0; border-top: 1px solid var(--border-color); margin: 2rem 0;">
            <?php
        endwhile;
    else :
        ?>
        <p><?php esc_html_e( 'No items found.', 'electrostore' ); ?></p>
        <?php
    endif;
    ?>
</div>
<?php get_footer(); ?>
`,
  'woocommerce.php': `<?php get_header(); ?>

<div class="electro-woo-content">
    <?php woocommerce_content(); ?>
</div>

<?php get_footer(); ?>
`
};
