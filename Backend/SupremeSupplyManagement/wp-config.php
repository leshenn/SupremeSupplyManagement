<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the website, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'supreme_supply_management' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', '' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'pRKhAoCj$ ?Fx2^QzSH#z{-mT-(CsN8c`SHa6ae5efK o+HP/fO,y`t-VwRD77^9' );
define( 'SECURE_AUTH_KEY',  'i9}b9qym!u9u4&8o/;HNC~D*-uP/6I_2;vBEeZyRgJT8IYT<O+HRLmwB|p<Ll;+W' );
define( 'LOGGED_IN_KEY',    '7Q^er3EMC);EPzHw:@p@U%evmMXEA|vM*[SSLYKZ5q$c_&M_`1+F$zUy2!31cRK.' );
define( 'NONCE_KEY',        'FPb}5Y<m] !ZHJ6oMA=!-G{t+Bj$zokN%WV}7HQS|vxs!)zS6~[MRF~9YFqT^X)+' );
define( 'AUTH_SALT',        'RG$ch+++pP|So/@~s~Ndi_1zgTQR;.sKw`j$6O/Fvv5+^08@$Kk`Yw/ArBS& -N?' );
define( 'SECURE_AUTH_SALT', '/b5|?)PMufY&~vH8xSb&IwPFia1mF^Gf|+*m_G%[M2kFnfzD us7bkdpA-/gh~{.' );
define( 'LOGGED_IN_SALT',   'P$+&RQZ>mmp/-gXwT#ph|]F!.^zrwnv-i(%u.1{d 5Phx.,3?fb.!?}Co%P@mB2k' );
define( 'NONCE_SALT',       '{RJIHG5g!:U0UD^jWeg2j-XVf2KB$f@nNAGB:pI{|#GO&P1v-KvDYia3AWk:zi3F' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 *
 * At the installation time, database tables are created with the specified prefix.
 * Changing this value after WordPress is installed will make your site think
 * it has not been installed.
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/#table-prefix
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://developer.wordpress.org/advanced-administration/debug/debug-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
