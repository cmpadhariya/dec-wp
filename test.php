<?php

/**
 * GraphQl assets file link.
 */
// function add_scripts_to_graphql() {
// register_graphql_field(
// 'RootQuery',
// 'enqueuedScripts',
// array(
// 'type'    => array( 'list_of' => 'String' ),
// 'resolve' => function() {
// return array(
// '1' => get_stylesheet_uri(),
// );
// },
// )
// );
// }
// add_action( 'graphql_register_types', 'add_scripts_to_graphql' );

// function textnext_frontend_theme_scripts() {
// wp_enqueue_style( 'Kishan', get_stylesheet_uri(), array(), 'all' );
// }
// add_action( 'wp_enqueue_scripts', 'textnext_frontend_theme_scripts' );



add_action(
	'graphql_register_types',
	function () {
		register_graphql_field(
			'RootQuery',
			'customStylesheet',
			array(
				'type'    => 'String',
				'resolve' => function () {
					$stylesheet_url     = get_stylesheet_directory_uri() . '/style.css';
					$stylesheet_content = file_get_contents( $stylesheet_url );
					return $stylesheet_content;
				},
			)
		);
	}
);


/**
 * GraphQl acf.
 */
function enable_acf_for_graphql( $field_group ) {
	$field_group['location'][] = array(
		array(
			'param'    => 'Homepage',
			'operator' => '==',
			'value'    => 'acf-options',
		),
	);

	return $field_group;
}
add_filter( 'acf/rest_api/field_group', 'enable_acf_for_graphql' );

/**
 * GraphQl contact form .
 */
add_action(
	'graphql_register_types',
	function () {
		register_graphql_mutation(
			'submitContactForm',
			array(
				'inputFields'         => array(
					'name'    => array(
						'type' => 'String',
					),
					'email'   => array(
						'type' => 'String',
					),
					'message' => array(
						'type' => 'String',
					),
				),
				'outputFields'        => array(
					'success' => array(
						'type' => 'Boolean',
					),
					'message' => array(
						'type' => 'String',
					),
				),
				'mutateAndGetPayload' => function ( $input ) {

					$name    = $input['name'];
					$email   = $input['email'];
					$message = $input['message'];

					$subject = 'New Form Submission';
					$body    = "Name: $name\nEmail: $email\nMessage: $message";

					$recipient = 'kishankantaria0@gmail.com';
					$headers   = array( 'Content-Type: text/html; charset=UTF-8' );
					$success   = wp_mail( $recipient, $subject, $message, $headers );

					// if ( $success ) {
					// $post_id = wp_insert_post(
					// array(
					// 'post_title'  => $recipient,
					// 'post_type'   => 'email_posts',
					// 'post_status' => 'publish',
					// )
					// );

					// update_post_meta( $post_id, 'receipient', $recipient );
					// }

					return array(
						'success' => $success,
						'message' => $subject ? 'Form submited successfully' : 'Error sending mail!',
					);
				},
			)
		);
	}
);

/**
 * GraphQl costomize opstion.
 */
// Register the 'customizerOptions' field
add_action(
	'graphql_register_types',
	function () {
		register_graphql_object_type(
			'CustomizerOptionstypes',
			array(
				'description' => 'Customizer Options',
				'fields'      => array(
					'siteIcon'           => array(
						'type'        => 'String',
						'description' => 'Site Icon',
						'resolve'     => function () {
							$siteIcon = get_site_icon_url();
							error_log( 'Site Icon URL: ' . $siteIcon );
							return $siteIcon;
						},
					),
					'logoHeight'         => array(
						'type'        => 'Int',
						'description' => 'Logo height',
					),
					'logoWidth'          => array(
						'type'        => 'Int',
						'description' => 'Logo width',
					),
					'flexHeight'         => array(
						'type'        => 'Boolean',
						'description' => 'Flex height',
					),
					'flexWidth'          => array(
						'type'        => 'Boolean',
						'description' => 'Flex width',
					),
					'siteDescription'    => array(
						'type'        => 'String',
						'description' => 'Header text options',
					),
					'siteTitle'          => array(
						'type'        => 'String',
						'description' => 'Header text options',
					),
					'unlinkHomepageLogo' => array(
						'type'        => 'Boolean',
						'description' => 'Unlink homepage logo',
					),
					'logo'               => array(
						'type'        => 'String',
						'description' => 'site logo',
					),
				),
			)
		);
		register_graphql_field(
			'RootQuery',
			'customizerOptions',
			array(
				'type'    => 'CustomizerOptionstypes',
				'resolve' => function () {
					$logo_options = get_theme_support( 'custom-logo' );

					return array(
						'siteIcon'           => get_site_icon_url(),
						'logoHeight'         => (int) $logo_options[0]['height'],
						'logoWidth'          => (int) $logo_options[0]['width'],
						'flexHeight'         => (bool) $logo_options[0]['flex-height'],
						'flexWidth'          => (bool) $logo_options[0]['flex-width'],
						'siteTitle'          => get_bloginfo( 'name' ),
						'siteDescription'    => get_bloginfo( 'description' ),
						'unlinkHomepageLogo' => (bool) $logo_options[0]['unlink-homepage-logo'],
						'logo'               => (string) wp_get_attachment_image_url( get_theme_mod( 'custom_logo' ), 'full' ),
					);
				},
			)
		);
	}
);



// functions.php or your custom theme file

// Add theme support for custom logo and post thumbnails
// function piroll_custom_logo_setup() {
// $defaults = array(
// 'height'               => 100,
// 'width'                => 400,
// 'flex-height'          => true,
// 'flex-width'           => true,
// 'header-text'          => array( 'site-title', 'site-description' ),
// 'unlink-homepage-logo' => true,
// );
// add_theme_support( 'custom-logo', $defaults );
// add_theme_support( 'post-thumbnails' );
// }
// add_action( 'after_setup_theme', 'piroll_custom_logo_setup' );

// // Extend WPGraphQL schema to include customizer options
// add_action( 'graphql_register_types', 'register_customizer_options_field' );
// function register_customizer_options_field() {
// register_graphql_field(
// 'RootQuery',
// 'customizerOptions',
// array(
// 'type'    => 'CustomizerOptions',
// 'resolve' => function () {

// return get_theme_mods();
// },
// )
// );

// register_graphql_object_type(
// 'CustomizerOptions',
// array(
// 'fields' => array(
// 'customLogoUrl' => array(
// 'type'    => 'String',
// 'resolve' => function () {
// Get the custom logo URL
// return wp_get_attachment_image_url( get_theme_mod( 'custom_logo' ), 'full' );
// },
// ),
// Add more customizer fields as needed
// ),
// )
// );
// }













add_action(
	'graphql_register_types',
	function () {
		register_graphql_object_type(
			'SidebarTypes',
			array(
				'description' => 'Sidebar Type',
				'fields'      => array(
					'sidebarOne' => array(
						'type'        => 'String',
						'description' => __( 'sidebarOne', 'headless' ),
						'resolve'     => function () {
							// Your logic to retrieve content for sidebarOne
							ob_start();
							dynamic_sidebar( 'next' );
							dynamic_sidebar( 'test' );
							return ob_get_clean();
						},
					),
					'sidebartwo' => array(
						'type'        => 'String',
						'description' => __( 'sidebartwo', 'headless2' ),
						'resolve'     => function () {
							// Your logic to retrieve content for sidebarOne
							ob_start();
							dynamic_sidebar( 'next1' );
							dynamic_sidebar( 'test1' );
							return ob_get_clean();
						},
					),

				),
			)
		);
		register_graphql_field(
			'RootQuery',
			'Sidebar',
			array(
				'description' => __( 'Get Sidebar', 'headless' ),
				'type'        => 'SidebarTypes',
				'resolve'     => function () {
					// Your logic to retrieve sidebar content
					return array();
				},
			)
		);
	}
);














// Register custom field for GraphQL
function register_custom_meta_field() {
	register_graphql_field(
		'service',
		'customMeta',
		array(
			'type'        => 'String',
			'description' => 'Custom meta field value',
			'resolve'     => function ( $post ) {
				return get_post_meta( $post->ID, '_custom_meta_field', true );
			},
		)
	);
}
add_action( 'graphql_register_types', 'register_custom_meta_field' );


<?php
/**
 * This is our functions file
 *
 * @package WordPress
 * @subpackage textnext
 */

/**
 * Frontend side css files
 * This file is display all enqueue function in site.
 */
function piroll_theme_scripts() {
	wp_enqueue_style( 'bootstrap-css', get_template_directory_uri() . '/assets/css/library/bootstrap.min.css', array(), 'all' );
	wp_enqueue_style( 'style', get_stylesheet_uri(), array(), 'all' );
}
add_action( 'wp_enqueue_scripts', 'piroll_theme_scripts' );

/**
 * This code for custom logo.
 */
function textnext_custom_logo_setup() {
	$defaults = array(
		'height'               => 100,
		'width'                => 400,
		'flex-height'          => true,
		'flex-width'           => true,
		'header-text'          => array( 'site-title', 'site-description' ),
		'unlink-homepage-logo' => true,
	);
	add_theme_support( 'custom-logo', $defaults );
	add_theme_support( 'post-thumbnails' );
}
add_action( 'after_setup_theme', 'textnext_custom_logo_setup' );

/**
 * Header menu.
 */
function textnext_header_menu() {
	register_nav_menu( 'textnext-header-menu', __( 'textnext header Menu' ) );
	register_nav_menu( 'textnext-footer-menu', __( 'textnext footer Menu' ) );
}
add_action( 'init', 'textnext_header_menu' );

/**
 * Footer menu.
 */
function textnext_footer_menu() {
	register_nav_menu( 'textnext-footer-menu', __( 'textnext footer Menu' ) );
}
add_action( 'init', 'textnext_footer_menu' );



/**
 * Register career custom post type and category taxonomy.
 */
function careers_decopled_register_graphql_post_types() {
	// Register custom post type.
	register_post_type(
		'careers',
		array(
			'show_in_graphql'       => true,
			'graphql_single_name'   => 'career',
			'graphql_plural_name'   => 'careers',
			'public'                => true,
			'labels'                => array(
				'name'               => 'careers',
				'singular_name'      => 'career',
				'menu_name'          => 'careers',
				'add_new'            => 'Add New career',
				'add_new_item'       => 'Add New career',
				'edit'               => 'Edit',
				'edit_item'          => 'Edit career',
				'new_item'           => 'New career',
				'view'               => 'View',
				'view_item'          => 'View career',
				'search_items'       => 'Search careers',
				'not_found'          => 'No careers found',
				'not_found_in_trash' => 'No careers found in Trash',
				'all_items'          => 'All careers',
			),
			'description'           => 'Your description here',
			'supports'              => array( 'title', 'editor', 'thumbnail', 'excerpt', 'custom-fields', 'comments', 'page-attributes' ),
			'taxonomies'            => array( 'career_category' ), // Add support for the custom taxonomy.
			'hierarchical'          => false,
			'publicly_queryable'    => true,
			'exclude_from_search'   => false,
			'show_ui'               => true,
			'show_in_menu'          => true,
			'show_in_nav_menus'     => true,
			'show_in_admin_bar'     => true,
			'menu_position'         => 5,
			'menu_icon'             => 'dashicons-admin-multisite',
			'capability_type'       => 'post',
			'map_meta_cap'          => true,
			'has_archive'           => 'careers',
			'rewrite'               => array(
				'slug'       => 'careers',
				'with_front' => true,
			),
			'publicly_queryable'    => true,
			'query_var'             => true,
			'can_export'            => true,
			'delete_with_user'      => false,
			'show_in_rest'          => true,
			'rest_base'             => 'careers-api',
			'rest_controller_class' => 'WP_REST_Posts_Controller',
		)
	);

	// Register custom taxonomy (category) for the custom post type.
	register_taxonomy(
		'career_category', // Taxonomy name.
		'careers',         // Associated post type.
		array(
			'label'               => 'career Categories',
			'rewrite'             => array( 'slug' => 'career-category' ),
			'hierarchical'        => true,
			'show_in_rest'        => true,
			'show_in_graphql'     => true,
			'graphql_single_name' => 'careerCategory',
			'graphql_plural_name' => 'careerCategories',
		)
	);
}

add_action( 'init', 'careers_decopled_register_graphql_post_types' );

// Add support for post thumbnails (featured images).
add_theme_support( 'post-thumbnails' );

function career_flush_graphql_cache() {
	if ( function_exists( 'graphql_clear_cached_schema' ) ) {
		graphql_clear_cached_schema();
	}
}

career_flush_graphql_cache();
// Optional: You may need to flush rewrite rules to make the new post type available.
// Uncomment the line below during development and then recomment it.
// flush_rewrite_rules();.



/**
 * Register portfolio custom post type and category taxonomy.
 */
function portfolio_decopled_register_graphql_post_types() {
	// Register custom post type.
	register_post_type(
		'portfolio',
		array(
			'show_in_graphql'       => true,
			'graphql_single_name'   => 'portfolio',
			'graphql_plural_name'   => 'portfolios',
			'public'                => true,
			'labels'                => array(
				'name'               => 'portfolio',
				'singular_name'      => 'portfolio',
				'menu_name'          => 'portfolio',
				'add_new'            => 'Add New portfolio',
				'add_new_item'       => 'Add New portfolio',
				'edit'               => 'Edit',
				'edit_item'          => 'Edit portfolio',
				'new_item'           => 'New portfolio',
				'view'               => 'View',
				'view_item'          => 'View portfolio',
				'search_items'       => 'Search portfolio',
				'not_found'          => 'No portfolio found',
				'not_found_in_trash' => 'No portfolio found in Trash',
				'all_items'          => 'All portfolio',
			),
			'description'           => 'Your description here',
			'supports'              => array( 'title', 'editor', 'thumbnail', 'excerpt', 'custom-fields', 'comments', 'page-attributes' ),
			'taxonomies'            => array( 'portfolio_category' ), // Add support for the custom taxonomy.
			'hierarchical'          => false,
			'publicly_queryable'    => true,
			'exclude_from_search'   => false,
			'show_ui'               => true,
			'show_in_menu'          => true,
			'show_in_nav_menus'     => true,
			'show_in_admin_bar'     => true,
			'menu_position'         => 5,
			'menu_icon'             => 'dashicons-admin-multisite',
			'capability_type'       => 'post',
			'map_meta_cap'          => true,
			'has_archive'           => 'portfolio',
			'rewrite'               => array(
				'slug'       => 'portfolio',
				'with_front' => true,
			),
			'publicly_queryable'    => true,
			'query_var'             => true,
			'can_export'            => true,
			'delete_with_user'      => false,
			'show_in_rest'          => true,
			'rest_base'             => 'portfolio-api',
			'rest_controller_class' => 'WP_REST_Posts_Controller',
		)
	);

	// Register custom taxonomy (category) for the custom post type.
	register_taxonomy(
		'portfolio_category', // Taxonomy name.
		'portfolio',         // Associated post type.
		array(
			'label'               => 'portfolio Categories',
			'rewrite'             => array( 'slug' => 'portfolio-category' ),
			'hierarchical'        => true,
			'show_in_rest'        => true,
			'show_in_graphql'     => true,
			'graphql_single_name' => 'portfolioCategory',
			'graphql_plural_name' => 'portfolioCategories',
		)
	);
}

add_action( 'init', 'portfolio_decopled_register_graphql_post_types' );

// Add support for post thumbnails (featured images).
add_theme_support( 'post-thumbnails' );

function portfolio_flush_graphql_cache() {
	if ( function_exists( 'graphql_clear_cached_schema' ) ) {
		graphql_clear_cached_schema();
	}
}

portfolio_flush_graphql_cache();
// Optional: You may need to flush rewrite rules to make the new post type available.
// Uncomment the line below during development and then recomment it.
// flush_rewrite_rules();.



/**
 * Register Service custom post type and category taxonomy.
 */
function services_decopled_register_graphql_post_types() {
	// Register custom post type.
	register_post_type(
		'services',
		array(
			'show_in_graphql'       => true,
			'graphql_single_name'   => 'Service',
			'graphql_plural_name'   => 'Services',
			'public'                => true,
			'labels'                => array(
				'name'               => 'Services',
				'singular_name'      => 'Service',
				'menu_name'          => 'Services',
				'add_new'            => 'Add New Service',
				'add_new_item'       => 'Add New Service',
				'edit'               => 'Edit',
				'edit_item'          => 'Edit Service',
				'new_item'           => 'New Service',
				'view'               => 'View',
				'view_item'          => 'View Service',
				'search_items'       => 'Search Services',
				'not_found'          => 'No Services found',
				'not_found_in_trash' => 'No Services found in Trash',
				'all_items'          => 'All Services',
			),
			'description'           => 'Your description here',
			'supports'              => array( 'title', 'editor', 'thumbnail', 'excerpt', 'custom-fields', 'comments', 'page-attributes' ),
			'taxonomies'            => array( 'service_category' ), // Add support for the custom taxonomy.
			'hierarchical'          => false,
			'publicly_queryable'    => true,
			'exclude_from_search'   => false,
			'show_ui'               => true,
			'show_in_menu'          => true,
			'show_in_nav_menus'     => true,
			'show_in_admin_bar'     => true,
			'menu_position'         => 5,
			'menu_icon'             => 'dashicons-admin-multisite',
			'capability_type'       => 'post',
			'map_meta_cap'          => true,
			'has_archive'           => 'services',
			'rewrite'               => array(
				'slug'       => 'services',
				'with_front' => true,
			),
			'publicly_queryable'    => true,
			'query_var'             => true,
			'can_export'            => true,
			'delete_with_user'      => false,
			'show_in_rest'          => true,
			'rest_base'             => 'services-api',
			'rest_controller_class' => 'WP_REST_Posts_Controller',
		)
	);

	// Register custom taxonomy (category) for the custom post type.
	register_taxonomy(
		'service_category', // Taxonomy name.
		'services',         // Associated post type.
		array(
			'label'               => 'Service Categories',
			'rewrite'             => array( 'slug' => 'service-category' ),
			'hierarchical'        => true,
			'show_in_rest'        => true,
			'show_in_graphql'     => true,
			'graphql_single_name' => 'ServiceCategory',
			'graphql_plural_name' => 'ServiceCategories',
		)
	);
}

add_action( 'init', 'services_decopled_register_graphql_post_types' );

// Add support for post thumbnails (featured images).
add_theme_support( 'post-thumbnails' );

function flush_graphql_cache() {
	if ( function_exists( 'graphql_clear_cached_schema' ) ) {
		graphql_clear_cached_schema();
	}
}

flush_graphql_cache();
// Optional: You may need to flush rewrite rules to make the new post type available.
// Uncomment the line below during development and then recomment it.
// flush_rewrite_rules();.





/**
 * GraphQL Query
 */
// Register the 'customizerOptions' field for GraphQL.
add_action(
	'graphql_register_types',
	function () {
		register_graphql_object_type(
			'CustomizerOptionstypes',
			array(
				'description' => 'Customizer Options',
				'fields'      => array(
					'id'       => array(
						'type'        => 'ID',
						'description' => 'The unique identifier for customizer options',
						'resolve'     => function () {
							// You need to provide a unique identifier for each object, for example, you can use a function like wp_generate_uuid4() to generate a UUID.
							return wp_generate_uuid4();
						},
					),
					'siteIcon' => array(
						'type'        => 'String',
						'description' => 'Site Icon',
						'resolve'     => function () {
							return get_site_icon_url();
						},
					),
					'logo'     => array(
						'type'        => 'String',
						'description' => 'Site logo',
						'resolve'     => function () {
							return (string) wp_get_attachment_image_url( get_theme_mod( 'custom_logo' ), 'full' );
						},
					),
				),
			)
		);

		register_graphql_field(
			'RootQuery',
			'customizerOptions',
			array(
				'type'    => 'CustomizerOptionstypes',
				'resolve' => function () {
					return array(
						'id'       => wp_generate_uuid4(), // Generate a unique ID.
						'siteIcon' => get_site_icon_url(),
						'logo'     => (string) wp_get_attachment_image_url( get_theme_mod( 'custom_logo' ), 'full' ),
					);
				},
			)
		);
	}
);


/**
 * GraphQl contact form .
 */
add_action(
	'graphql_register_types',
	function () {
		register_graphql_mutation(
			'submitContactForm',
			array(
				'inputFields'         => array(
					'name'    => array(
						'type' => 'String',
					),
					'email'   => array(
						'type' => 'String',
					),
					'message' => array(
						'type' => 'String',
					),
				),
				'outputFields'        => array(
					'success' => array(
						'type' => 'Boolean',
					),
					'message' => array(
						'type' => 'String',
					),
				),
				'mutateAndGetPayload' => function ( $input ) {

					$name    = $input['name'];
					$email   = $input['email'];
					$message = $input['message'];

					$subject = 'New Form Submission';
					$body    = "Name: $name\nEmail: $email\nMessage: $message";

					$recipient = 'kishankantaria0@gmail.com';
					$headers   = array( 'Content-Type: text/html; charset=UTF-8' );
					$success   = wp_mail( $recipient, $subject, $message, $headers );

					return array(
						'success' => $success,
						'message' => $subject ? 'Form submited successfully' : 'Error sending mail!',
					);
				},
			)
		);
	}
);




add_action( 'widgets_init', 'my_register_sidebars' );
function my_register_sidebars() {
	// Register the 'Test' sidebar.
	register_sidebar(
		array(
			'id'            => 'test',
			'name'          => __( 'test' ),
			'description'   => __( 'A short description of the sidebar.' ),
			'before_widget' => '<div id="%1$s" class="widget %2$s">',
			'after_widget'  => '</div>',
			'before_title'  => '<h3 class="widget-title">',
			'after_title'   => '</h3>',
		)
	);
}
add_action(
	'graphql_register_types',
	function () {
		register_graphql_object_type(
			'SidebarTypes',
			array(
				'description' => 'Sidebar Type',
				'fields'      => array(
					'customsidebar' => array(
						'type'        => 'String',
						'description' => __( 'customsidebar', 'headless' ),
						'resolve'     => function () {
							ob_start();
							dynamic_sidebar( 'test' );
							return ob_get_clean();
						},
					),
				),
			)
		);
		register_graphql_field(
			'RootQuery',
			'Sidebar',
			array(
				'description' => __( 'Get Sidebar', 'headless' ),
				'type'        => 'SidebarTypes',
				'resolve'     => function () {
					return array();
				},
			)
		);
	}
);


/**
 * Register Meta Box.
 */
function custom_meta_box() {
	add_meta_box(
		'custom_meta_box',
		'Custom Meta Box',
		'display_custom_meta_box',
		'post', // You can change 'post' to the post type where you want the meta box.
		'normal',
		'high'
	);
}
add_action( 'add_meta_boxes', 'custom_meta_box' );

/**
 * Display meta box content.
 */
function display_custom_meta_box( $post ) {
	$meta_value = get_post_meta( $post->ID, '_custom_meta_field', true );
	?>
	<label for="custom_meta_field">Custom Text:</label>
	<input type="text" name="custom_meta_field" id="custom_meta_field" value="<?php echo esc_attr( $meta_value ); ?>">
	<?php
}

/**
 * Save meta box data.
 */
function save_custom_meta_box( $post_id ) {
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}

	$meta_field_value = isset( $_POST['custom_meta_field'] ) ? sanitize_text_field( $_POST['custom_meta_field'] ) : '';
	update_post_meta( $post_id, '_custom_meta_field', $meta_field_value );
}
add_action( 'save_post', 'save_custom_meta_box' );


/**
 * Register custom field for GraphQL.
 */
function register_custom_meta_field() {
	register_graphql_field(
		'post',
		'customMeta',
		array(
			'type'        => 'String',
			'description' => 'Custom meta field value',
			'resolve'     => function ( $post ) {
				return get_post_meta( $post->ID, '_custom_meta_field', true );
			},
		)
	);
}
add_action( 'graphql_register_types', 'register_custom_meta_field' );

function custom_init_function() {
    // Global dummy content
    $dummy_content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla accumsan, quam eu ultrices blandit, purus lectus laoreet sem, eu dictum magna mi ut nisi. Sed dictum varius nibh, interdum nunc. Nam lacinia urna ex, vitae dictum turpis dapibus sed. Suspendisse non bibendum erat. Integer ut leo eu libero facilisis fermentum. Ut quis euismod nisl.";
    
    // Convert the dummy content into paragraphs
    $paragraphs = wpautop($dummy_content);

    // Output the paragraphs
    echo $paragraphs;

	var_dump( $dummy_content);
	die('chirag');
}

// Add the custom_init_function to the init action hook
add_action('init', 'custom_init_function');






