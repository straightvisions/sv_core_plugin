function sv_admin_load_page(target){
	if(jQuery(target).length) {
		jQuery('.sv_admin_menu_item.active').removeClass('active');
		jQuery('*[data-target="' + target + '"]').addClass('active');
		jQuery('.sv_admin_section').hide();
		jQuery(target).fadeIn();
		window.location.hash = target;
	}
}

jQuery(document).on('click', '.sv_admin_menu_item', function() {
	if(!jQuery(this).hasClass('active')) {
		if(jQuery(document).width() < 800) {
			jQuery(jQuery('.sv_admin_mobile_toggle').attr('data-target')).toggle();
		}
		sv_admin_load_page(jQuery(this).data('target'));
	}
});
jQuery(document).on('click', '.sv_admin_mobile_toggle', function() {
	jQuery(jQuery(this).attr('data-target')).toggle();
	jQuery( 'body' ).toggleClass( 'sv_admin_menu_open' );
});
jQuery(document).ready(function(){
	sv_admin_load_page(window.location.hash);
});

/* Input - Radio checkbox style */
jQuery(document).on('click', '.sv_radio_switch_wrapper .switch_field input[type="radio"]:checked', function() {
	jQuery( '.sv_radio_switch_wrapper .switch_field input[type="radio"]:not(:checked)' ).prop( 'checked', true );
	jQuery( this ).removeProp( 'checked' );
});

/* Input - Color */
jQuery(document).on('click', '.sv_setting_header > .sv_setting_color_display, .sv_setting_header > h4', function() {
	const color_picker = jQuery( this ).parent().parent().find('.sv_input_label_color');

	if ( color_picker.hasClass('sv_hidden') ) {
		jQuery( color_picker ).slideDown();
		color_picker.removeClass('sv_hidden');
	} else {
		jQuery( color_picker ).slideUp();
		color_picker.addClass('sv_hidden');
	}
});

/* Description (Tooltip) */
jQuery(document).on('click', '.sv_tooltip', function() {
	jQuery(this).next().toggleClass('open');
});

/* Module: Log */

/* Select All */
jQuery( document ).on( 'click', 'div.log_list input[type="checkbox"]#logs_select', function() {
	jQuery( 'div.log_list input[type="checkbox"]' ).prop( 'checked', this.checked );
});

/* Select Log */
jQuery( document ).on( 'click', '.log_list input[type="checkbox"]', function() {
	if ( jQuery( '.log_list input[type="checkbox"]:checked:not(#logs_select)' ).length > 0) {
		jQuery( '.log_list #logs_delete' ).css( 'visibility', 'visible' );
		jQuery( '.log_list #logs_delete' ).css( 'opacity', '1' );
	} else {
		jQuery( '.log_list #logs_delete' ).css( 'visibility', 'hidden' );
		jQuery( '.log_list #logs_delete' ).css ('opacity', '0' );
	}
});

/* Click Log */
jQuery( document ).on( 'click', 'div.log_list tr.log', function() {
	var log_id		= jQuery( this ).attr( 'ID' )
	var table 		= jQuery( 'div.log_details table#log_' + log_id );

	jQuery( 'div.log_list tr.log' ).removeClass( 'active' );
	jQuery( 'div.sv_log' ).removeClass( 'show_filter' );

	if( jQuery( 'div.sv_log' ).hasClass( 'show_details' ) ) {
		var table_id	= jQuery( 'div.log_details table.show' ).attr( 'ID' );

		if( 'log_' + log_id != table_id ) {
			jQuery( this ).addClass( 'active' );
			jQuery( 'div.log_details table.show' ).toggleClass( 'show' );
			table.toggleClass( 'show' );
		} else {
			table.toggleClass( 'show' );
			jQuery( 'div.sv_log' ).toggleClass( 'show_details' );
		}
	} else {
		jQuery( this ).addClass( 'active' );
		jQuery( 'div.sv_log' ).toggleClass( 'show_details' );
		table.toggleClass( 'show' );
	}
});

/* Click Filter */
jQuery( document ).on( 'click', 'div.log_summary button#logs_filter', function() {
	jQuery( 'div.log_list tr.log' ).removeClass( 'active' );
	jQuery( 'div.sv_log' ).removeClass( 'show_details' );
	jQuery( 'div.log_details table' ).removeClass( 'show' );
	jQuery( 'div.sv_log' ).toggleClass( 'show_filter' );
});

/* set form referer for redirect to current subpage on submit */
jQuery( document ).on('submit', 'section.sv_admin_section form', function(e){
	jQuery(this).find('input[name="_wp_http_referer"]').val(jQuery(location).attr('href'));
});

/* ===== Ajax Save Settings ===== */
function show_notice( msg, type = 'info' ) {
	var types 	= [ 'info', 'success', 'warning', 'error' ];

	if ( jQuery.inArray( type, types ) >= 0 ) {
		var el = jQuery( '.sv_admin_notice' );
		type = 'notice-' + type;

		// Removes old message and replaces it with the new one
		el.html( msg );

		if ( ! el.hasClass( type ) ) {
			el.attr( 'class', 'sv_admin_notice' );
			el.toggleClass( type );
		}

		el.toggleClass( 'show' );

		setTimeout( function () {
			el.toggleClass( 'show' );
		}, 3000 );
	}
}

/**
 * This part prevents spamming of the ajax request.
 * When update_option is called, it starts a timeout with the duration define in the timeout var,
 * if the save_option function is called in this time window, the timeout will reset and start again.
 */
var timeout			= 1000;
var forms			= {};
var timeout_handle	= setTimeout( save_settings , timeout );

function update_option( form ) {
	if ( ! jQuery( form ).find( 'input[type="file"]' ).length > 0
		&& (
			jQuery( form ).data( 'ajax' ) === undefined
			|| jQuery( form ).data( 'ajax' ) === '1'
		)
	) {
		forms[ form.attr('id') ] = form;

		window.clearTimeout( timeout_handle );
		timeout_handle = setTimeout( save_settings, timeout );
	}
}

function save_settings() {
	for ( const [ id, form ] of Object.entries( forms ) ) {
		jQuery( form ).ajaxSubmit({
			success: function () {
				show_notice( sv_core_admin.settings_saved, 'success' );
			},
		});
	}

	forms 	= [];
}

/*
jQuery('.sv_dashboard_content form').submit( function ( e ) {
	if ( jQuery( this ).find( 'input[type="file"]' ).length < 1 ) {
		e.preventDefault();
		update_option( jQuery( this ) )
	}
});
*/

jQuery( '.sv_dashboard_content input[type="checkbox"], .sv_dashboard_content input[type="radio"]' ).on( 'click', function() {
	update_option( jQuery( this ).parents( 'form' ) );
});

jQuery( '.sv_dashboard_content input, .sv_dashboard_content select' ).on( 'focusin', function() {
	if ( ! jQuery( this ).is( 'input[type="radio"]' ) ) {
		jQuery( this ).data( 'val', jQuery( this ).val() );
	}
});


jQuery( '.sv_dashboard_content input, .sv_dashboard_content select' ).on( 'change', function() {
	if ( ! jQuery( this ).is( 'input[type="radio"]' ) ) {
		var prev 	= jQuery( this ).data( 'val' );
		var current = jQuery( this ).val();

		if ( current !== prev ) {
			update_option( jQuery( this ).parents( 'form' ) );
		}
	}
});


jQuery( '.sv_dashboard_content textarea' ).on( 'change', function() {
	var prev 	= jQuery( this ).data( 'text' );
	var current = jQuery( this ).val();

	if ( current !== prev ) {
		update_option( jQuery( this ).parents( 'form' ) );
	}
});

jQuery('#sv_core_expert_mode .sv_setting_checkbox input').on('change', function(){
	jQuery.post( sv_core_admin.ajaxurl, {
			action : 'sv_core_expert_mode',
			nonce : sv_core_admin.nonce_expert_mode,
			state : jQuery(this).val()
		},
		function(response) {
			response = JSON.parse(response);

			if(response.status === 'success') {
				show_notice( response.message, 'success' );
			} else {
				show_notice( response.message, 'error' );
			}
	});
});

jQuery(document).ready(function(){
	jQuery('.sv_setting_subpages').each(function() {
		jQuery( this ).children('.sv_setting_subpage').each(function( i ) {
			// Checks if the subpage contains breakpoint pages
			let nav_item = '<li data-id="' + ( i + 1 ) + '">' + jQuery( this ).children('h2').text();
			const desktop = jQuery( this ).children('.sv_setting_subpage_desktop').length > 0 ? true : false;

			if ( desktop ) {
				let breakpoint_nav = '<ul class="sv_breakpoint_nav">';
                breakpoint_nav += '<li data-id="desktop" class="active"><i class="fas fa-desktop"></i></li>';

                const tablet_landscape = jQuery( this ).children('.sv_setting_subpage_tablet_landscape').length > 0 ? true : false;
                const tablet = jQuery( this ).children('.sv_setting_subpage_tablet').length > 0 ? true : false;
                const mobile_landscape = jQuery( this ).children('.sv_setting_subpage_mobile_landscape').length > 0 ? true : false;
                const mobile = jQuery( this ).children('.sv_setting_subpage_mobile').length > 0 ? true : false;

                breakpoint_nav += tablet_landscape ? '<li data-id="tablet_landscape"><i class="fas fa-tablet-alt sv_rotate"></i></li>' : '';
                breakpoint_nav += tablet ? '<li data-id="tablet"><i class="fas fa-tablet-alt"></i></li>' : '';
                breakpoint_nav += mobile_landscape ? '<li data-id="mobile_landscape"><i class="fas fa-mobile-alt sv_rotate"></i></li>' : '';
                breakpoint_nav += mobile ? '<li data-id="mobile" ><i class="fas fa-mobile-alt"></i></li>' : '';

                breakpoint_nav += '</ul>';
                nav_item += breakpoint_nav;

                const is_size_mobile = jQuery( window ).width() < 850 ? true : false;

                if ( is_size_mobile ) {
                	console.log( jQuery( this ).parent().children('.sv_setting_subpages_nav'));
                    jQuery( this ).parent().children('.sv_setting_subpages_nav > .active').css('margin-bottom', '60px');
				} else {
                    jQuery( this ).parent().children('.sv_setting_subpages_nav').css('margin-bottom', '40px');
				}
			}

			nav_item += '</li>';

			jQuery( this ).parent().children('.sv_setting_subpages_nav').append( nav_item );
		});
	});
	jQuery('.sv_setting_subpages_nav li:first-child').addClass('active');
	jQuery('body').on('click', '.sv_setting_subpages_nav > *', function(){
		jQuery( this ).parent().children('*').removeClass('active');
		jQuery( this ).addClass('active');
		jQuery( this ).parent().parent().children('.sv_setting_subpage').hide();

		// Checks if the subpage has a breakpoint nav
		const has_breakpoint_nav = jQuery( this ).children( '.sv_breakpoint_nav' ).length > 0 ? true : false;
        const is_size_mobile = jQuery( window ).width > 849 ? true : false;

		if ( has_breakpoint_nav && ! is_size_mobile ) {
			jQuery( this ).parent().css( 'margin-bottom', '40px' );
		} else {
            jQuery( this ).parent().css( 'margin-bottom', '0' );
		}

		jQuery( this ).parent().parent().children('.sv_setting_subpage:nth-of-type('+jQuery(this).data('id')+')').fadeIn();
	});

    jQuery('body').on('click', '.sv_setting_subpages_nav > * > .sv_breakpoint_nav > *', function(){
        jQuery( this ).parent().children('*').removeClass('active');
        jQuery( this ).addClass('active');

        const subpage_id = jQuery(this).parent().parent().data('id');
        const subpage = '.sv_setting_subpage:nth-of-type(' + subpage_id + ')';
        const breakpoint_page = '.sv_setting_subpage_' + jQuery(this).data('id');

        jQuery( this ).parent().parent().parent().parent().children( subpage ).children( 'div' ).hide();
        jQuery( this ).parent().parent().parent().parent().children( subpage ).children( breakpoint_page ).fadeIn();
    });
});

/* ===== Ajax Check ===== */
jQuery( 'button[data-sv_admin_ajax], input[data-sv_admin_ajax]' ).on( 'click', function() {
	let ajax = jQuery( this ).data( 'sv_admin_ajax' );
	let is_modal = jQuery( this ).data( 'sv_admin_modal' ) ? true : false;

	if ( ! is_modal ) {
		sv_admin_ajax_call( ajax );
	}
} );

function sv_admin_ajax_call( data, modal = false ) {
	if ( data[0].nonce === 'undefined' ) return false;

	if ( modal ) {
		jQuery( '.sv_admin_modal' ).removeClass( 'show' );
	}

	jQuery.post( ajaxurl, data[0], function( response ) {
		let data = JSON.parse( response );

		if ( data.notice ) {
			show_notice( data.msg, data.type )
		} else {
			console.log( response );
		}
	} );
}

/* ===== Modals ===== */
function show_modal( title, desc, type, args ) {
	let el		= jQuery( '.sv_admin_modal' );
	let content = get_modal_content( type, args );

	if ( content ) {
		el.find( '.sv_admin_modal_title' ).html( title );
		el.find( '.sv_admin_modal_description' ).html( desc );
		el.find( '.sv_admin_modal_content' ).html( content );

		el.addClass( 'show' );
	}
}

function get_modal_content( type, args ) {
	let content = '';
	let ajax_call = args.ajax
		? "onclick='sv_admin_ajax_call( " + JSON.stringify( args.ajax ) + ", true )'"
		: '';
	let form_call = args.form
		? 'onclick=jQuery("form#' + args.form + '").submit()'
		: '';

	switch ( type ) {
		case 'confirm':
			content = '<button class="sv_dashboard_button" ' + ajax_call + ' ' + form_call + '>Proceed</button>';
			break;
		default:
			return false;
	}

	return content;
}

jQuery( 'button[data-sv_admin_modal], input[data-sv_admin_modal]' ).on( 'click', function() {
	let title 	= jQuery( this ).data( 'sv_admin_modal' )[0].title;
	let desc 	= jQuery( this ).data( 'sv_admin_modal' )[0].desc;
	let type	= jQuery( this ).data( 'sv_admin_modal' )[0].type;
	let args	= jQuery( this ).data( 'sv_admin_modal' )[0].args ? jQuery( this ).data( 'sv_admin_modal' )[0].args : {};
	let ajax	= jQuery( this ).data( 'sv_admin_ajax' );

	if ( ajax !== 'undefined' ) {
		args.ajax = ajax;
	}

	show_modal( title, desc, type, args );
} );

jQuery( '.sv_admin_modal .sv_admin_modal_close, .sv_admin_modal .sv_admin_modal_cancel, .sv_admin_modal .sv_admin_modal_submit' ).on( 'click', function() {
	jQuery( this ).parents( '.sv_admin_modal' ).removeClass( 'show' );
} );

/* When the number setting has is_units is enabled */

/* When the select unit changes */
jQuery( '.sv_setting select.sv_input_units' ).on( 'change', function(e) {
	const number_select = jQuery( e.target ).parent().children( 'input[type="number"]' );
	const data_input = jQuery( e.target ).parent().children( 'input[data-sv_type="sv_form_field"]' );

	const unit 		= e.target.value;
	const number 	= number_select.val();
	const value 	= number + unit;

	data_input.val( value );
} );

/* When the number value changes */
jQuery( '.sv_setting input[type="number"]' ).on( 'change', function(e) {
	const unit_select = jQuery( e.target ).parent().children( 'select.sv_input_units' );
	
	if ( unit_select.length > 0 ) {
		const data_input = jQuery( e.target ).parent().children( 'input[data-sv_type="sv_form_field"]' );

		const unit 		= unit_select.val();
		const number 	= e.target.value;
		const value 	= number + unit;

		data_input.val( value );
	}
} );

/* Input Range & Box Shadow Settings Type */
function sv_setting_box_shadow( target ) {
	const parent = jQuery( target ).parents( '.sv_setting_box_shadow' );
	
	if ( parent.length > 0 ) {
		/* Inputs */
		const horizontal 		= parent.find( '.sv_setting_box_shadow_horizontal' ).children( 'input[type="number"].sv_input_range_indicator' ).val();
		const horizontal_unit 	= parent.find( '.sv_setting_box_shadow_horizontal' ).children( 'select.sv_input_units' ).val() + ' ';

		const vertical			= parent.find( '.sv_setting_box_shadow_vertical' ).children( 'input[type="number"].sv_input_range_indicator' ).val();
		const vertical_unit 	= parent.find( '.sv_setting_box_shadow_vertical' ).children( 'select.sv_input_units' ).val() + ' ';

		const blur				= parent.find( '.sv_setting_box_shadow_blur' ).children( 'input[type="number"].sv_input_range_indicator' ).val();
		const blur_unit 		= parent.find( '.sv_setting_box_shadow_blur' ).children( 'select.sv_input_units' ).val() + ' ';

		const spread			= parent.find( '.sv_setting_box_shadow_spread' ).children( 'input[type="number"].sv_input_range_indicator' ).val();
		const spread_unit 		= parent.find( '.sv_setting_box_shadow_spread' ).children( 'select.sv_input_units' ).val() + ' ';

		const color				= parent.find( '.sv_setting_box_shadow_color' ).children( 'input[type="color"]' ).val();
		const inset				= parent.find( '.sv_setting_box_shadow_inset' ).children( 'select' ).val() === 'inset' ? 'inset ' : '';

		/* Value */
		const box_shadow		= inset + horizontal + horizontal_unit + vertical + vertical_unit + blur + blur_unit + spread + spread_unit + color;

		/* Updates the input value and the preview */
		parent.children( 'input[data-sv_type="sv_form_field"]' ).val( box_shadow );
		parent.children( '.sv_setting_preview' ).css( 'box-shadow', box_shadow );
	}
}

jQuery(  '.sv_setting .sv_setting_range input[type="range"]' ).on( 'input', function(e) {
	const number_input = jQuery( e.target ).parent().children('input[type="number"].sv_input_range_indicator');

	number_input.val( e.target.value );

	/* Box Shadow Settings Type */
	sv_setting_box_shadow( e.target );
} );

jQuery(  '.sv_setting .sv_setting_range input[type="number"].sv_input_range_indicator' ).on( 'change', function(e) {
	const range_input = jQuery( e.target ).parent().children('input[type="range"]');

	range_input.val( e.target.value );

	/* Box Shadow Settings Type */
	sv_setting_box_shadow( e.target );
} );

jQuery( '.sv_setting .sv_setting_range select.sv_input_units' ).on( 'change', function( e ) { sv_setting_box_shadow( e.target ) } );
jQuery( '.sv_setting .sv_setting_box_shadow input[type="color"]' ).on( 'change', function( e ) { sv_setting_box_shadow( e.target ) } );
jQuery( '.sv_setting .sv_setting_box_shadow select' ).on( 'change', function( e ) { sv_setting_box_shadow( e.target ) } );