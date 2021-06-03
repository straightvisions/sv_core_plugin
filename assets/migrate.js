
// no need for rebind --------------------------------------------------------------------------------------------------

jQuery(document).on('click', '.sv_admin_mobile_toggle', function() {
    jQuery(jQuery(this).attr('data-target')).toggle();
    jQuery( 'body' ).toggleClass( 'sv_admin_menu_open' );
});


/* Responsive Select */
jQuery(document).on('click', '.sv_setting_header .sv_setting_responsive_select > *', function() {
    jQuery(this).parent().parent().parent().find('.sv_setting_responsive').removeClass('active').hide();
    jQuery(this).parent().parent().parent().find('.sv_setting_responsive_'+jQuery(this).data('sv_setting_responsive_select')).addClass('active').show();

    // highlight selector
    jQuery(this).parent().find('i').removeClass('active')
    jQuery(this).addClass('active')
});

/* Responsive Inherit Overwrite */
jQuery(document).on('click', '.sv_setting_header .sv_setting_responsive_force', function() {
    const container = jQuery(this).closest('.sv_setting');
    const settings_source = container.children('.active').first();
    const settings_source_inputs = settings_source.find('.sv_input');
    const is_color_setting = container.hasClass('sv_setting_color_parent');

    settings_source_inputs.each(function(){
        const el    = jQuery(this);
        let id      = el.attr('id');

        if(typeof id == 'undefined' || id == ''){
            return; // block group settings - please fix this
        }
        const value = el.val();

        /*hackish, use react or states */
        id = id.replace('[mobile]','[XXX]');
        id = id.replace('[mobile_landscape]','[XXX]');
        id = id.replace('[tablet]','[XXX]');
        id = id.replace('[tablet_landscape]','[XXX]');
        id = id.replace('[tablet_pro]','[XXX]');
        id = id.replace('[tablet_pro_landscape]','[XXX]');
        id = id.replace('[desktop]','[XXX]');

        container.find('.sv_input#'+id.replace('[XXX]','\\[mobile\\]')).val(value);
        container.find('.sv_input#'+id.replace('[XXX]','\\[mobile_landscape\\]')).val(value);
        container.find('.sv_input#'+id.replace('[XXX]','\\[tablet\\]')).val(value);
        container.find('.sv_input#'+id.replace('[XXX]','\\[tablet_landscape\\]')).val(value);
        container.find('.sv_input#'+id.replace('[XXX]','\\[tablet_pro\\]')).val(value);
        container.find('.sv_input#'+id.replace('[XXX]','\\[tablet_pro_landscape\\]')).val(value);
        container.find('.sv_input#'+id.replace('[XXX]','\\[desktop\\]')).val(value).trigger('change');

        // Settings type: color
        if ( is_color_setting ) {
            container.find('.sv_setting_responsive.sv_setting_responsive_mobile .sv_setting_color_value').css('background-color', 'rgba(' + value + ')');
            container.find('.sv_setting_responsive.sv_setting_responsive_mobile_landscape .sv_setting_color_value').css('background-color', 'rgba(' + value + ')');
            container.find('.sv_setting_responsive.sv_setting_responsive_tablet .sv_setting_color_value').css('background-color', 'rgba(' + value + ')');
            container.find('.sv_setting_responsive.sv_setting_responsive_tablet_landscape .sv_setting_color_value').css('background-color', 'rgba(' + value + ')');
            container.find('.sv_setting_responsive.sv_setting_responsive_tablet_pro .sv_setting_color_value').css('background-color', 'rgba(' + value + ')');
            container.find('.sv_setting_responsive.sv_setting_responsive_tablet_pro_landscape .sv_setting_color_value').css('background-color', 'rgba(' + value + ')');
            container.find('.sv_setting_responsive.sv_setting_responsive_desktop .sv_setting_color_value').css('background-color', 'rgba(' + value + ')');
        }
    });

    SVCA.show_notice('Setting copied to breakpoints.');
    update_option( jQuery( this ).closest( 'form' ) );

});

/* set form referer for redirect to current subpage on submit */
jQuery( document ).on('submit', 'section.sv_admin_section form', function(e){
    jQuery(this).find('input[name="_wp_http_referer"]').val(jQuery(location).attr('href'));
});


// needs for rebind ----------------------------------------------------------------------------------------------------
function bind_events(){ //@todo remove deprecated functions and move all of this into admin class plugins

    add_subpage_nav();

    jQuery( '.sv_dashboard_content input, .sv_dashboard_content textarea, .sv_dashboard_content select' ).unbind().on( 'change', function() {
        update_option( jQuery( this ).parents( 'form' ) );
    });

    jQuery('#sv_core_expert_mode .sv_setting_checkbox input').unbind().on('change', function(){
        jQuery.post( sv_core_admin.ajaxurl, {
                action : 'sv_core_expert_mode',
                nonce : sv_core_admin.nonce_expert_mode,
                state : jQuery(this).val()
            },
            function(response) {
                response = JSON.parse(response);

                if(response.status === 'success') {
                    SVCA.show_notice( response.message, 'success' );
                } else {
                    SVCA.show_notice( response.message, 'error' );
                }
            });
    });

    jQuery(  '.sv_setting .sv_setting_range input[type="range"]' ).unbind().on( 'input', function(e) {
        const number_input = jQuery( e.target ).parent().children('input[type="number"].sv_input_range_indicator');

        number_input.val( e.target.value );

        /* Box Shadow Settings Type */
        sv_setting_box_shadow( e.target );
    } );

    jQuery(  '.sv_setting .sv_setting_range input[type="number"].sv_input_range_indicator' ).unbind().on( 'change', function(e) {
        const range_input = jQuery( e.target ).parent().children('input[type="range"]');

        range_input.val( e.target.value );

        /* Box Shadow Settings Type */
        sv_setting_box_shadow( e.target );
    } );

    jQuery( '.sv_setting .sv_setting_range select.sv_input_units' ).unbind().on( 'change', function( e ) { sv_setting_box_shadow( e.target ) } );
    jQuery( '.sv_setting .sv_setting_box_shadow_color input[type="hidden"].sv_input' ).unbind().on( 'change', function( e ) { sv_setting_box_shadow( e.target ) } );
    jQuery( '.sv_setting .sv_setting_box_shadow select' ).unbind().on( 'change', function( e ) { sv_setting_box_shadow( e.target ) } );


    jQuery( 'button[data-sv_admin_modal], input[data-sv_admin_modal]' ).unbind().on( 'click', function() {
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

    jQuery( '.sv_admin_modal .sv_admin_modal_close, .sv_admin_modal .sv_admin_modal_cancel, .sv_admin_modal .sv_admin_modal_submit' ).unbind().on( 'click', function() {
        jQuery( this ).parents( '.sv_admin_modal' ).removeClass( 'show' );
    } );

    /* When the number setting has is_units is enabled */

    /* When the select unit changes */
    jQuery( '.sv_setting select.sv_input_units' ).unbind().on( 'change', function(e) {
        const number_select = jQuery( e.target ).parent().children( 'input[type="number"]' );
        const data_input = jQuery( e.target ).parent().children( 'input[data-sv_type="sv_form_field"]' );

        const unit 		= e.target.value;
        const number 	= number_select.val();
        const value 	= number + unit;

        data_input.val( value );
    } );

    /* When the number value changes */
    jQuery( '.sv_setting input[type="number"]' ).unbind().on( 'change', function(e) {
        const unit_select = jQuery( e.target ).parent().children( 'select.sv_input_units' );

        if ( unit_select.length > 0 ) {
            const data_input = jQuery( e.target ).parent().children( 'input[data-sv_type="sv_form_field"]' );

            const unit 		= unit_select.val();
            const number 	= e.target.value;
            const value 	= number + unit;

            data_input.val( value );
        }
    } );

    /* ===== Ajax Check ===== */
    jQuery( 'button[data-sv_admin_ajax], input[data-sv_admin_ajax]' ).on( 'click', function() {
        let ajax = jQuery( this ).data( 'sv_admin_ajax' );
        let is_modal = jQuery( this ).data( 'sv_admin_modal' ) ? true : false;

        if ( ! is_modal ) {
            sv_admin_ajax_call( ajax );
        }
    } );


    /* AJAX SAVE FORM ------------------------------- */
    let settings_form_list = jQuery('.sv_admin_section.active .sv100_settings_ajax_save_form');

    if( settings_form_list.length > 0 ){
        settings_form_list.each(function(){
            const form = jQuery(this);

            form.find('.save-classic').on('click',function(){
                form.submit();
            });

            form.find('.save-ajax').on('click',function(e){
                e.preventDefault();

                //form.ajaxSubmit();
                /* get auth data */
                let options = [
                    {
                        name: 'option_page',
                        value: form.find('input[name="option_page"]').val(),
                    },
                    {
                        name: 'action',
                        //value: form.find('input[name="action"]').val(),
                        value: 'sv_ajax_settings_save_form'
                    },
                    {
                        name: '_wpnonce',
                        value: form.find('input[name="_wpnonce"]').val(),
                    },


                ];

                const perChunk = 50; // CHANGE THIS TO TOGGLE CHUNK SIZE
                const data = form.serializeArray();
                const chunks = data.reduce((all,one,i) => {
                    const ch = Math.floor(i/perChunk);
                    all[ch] = [].concat((all[ch]||[]),one);
                    return all;
                }, []);

                const len = chunks.length;
                jQuery(this).val(chunks.length);
                chunkCrunch(chunks.splice(0, Math.ceil(len / 4)), options, perChunk, jQuery(this));
                chunkCrunch(chunks.splice(0, Math.ceil(len / 4)), options, perChunk, jQuery(this));
                chunkCrunch(chunks.splice(0, Math.ceil(len / 4)), options, perChunk, jQuery(this));
                chunkCrunch(chunks.splice(0, Math.ceil(len / 4)), options, perChunk, jQuery(this));

            });

        });
    }

} // ----------------------------------------------

function chunkCrunch(chunks, options, perChunk, btn){
    if(chunks.length <= 0) return;

    promisedAjax({
        method: 'POST',
        url: SVCA.params.ajax_url + '?action=' + options[1].value,
        data: {
            page: SVCA.get_url_param('page'),
            nonce: SVCA.get_plugin_localized_nonce(),
            // fields:           jQuery.param(chunks[i]), // url param variant
            fields: chunks.splice(0, 1),
        }

    }).then(function(){
        btn.val(btn.val() - 1);
        chunkCrunch(chunks, options, perChunk, btn);
    });

}

function promisedAjax(params, i) {
    return new Promise(function(resolve, reject) {
        jQuery.ajax(
            Object.assign(params, {
                success: function (data) {
                    resolve(true) // Resolve promise and go to then()
                },
                error: function (err) {
                    reject(false) // Reject the promise and go to catch()
                }
            })
        );
    });
}

// very important ;)
jQuery(document).ready(function(){
    bind_events();
});


function add_subpage_nav(){
    /* // migrated
    jQuery('.sv_setting_subpages').each(function() {

        if( jQuery( this ).children('.sv_setting_subpages_nav').children().length > 0 ){
            return; // skip
        }

        jQuery( this ).children('.sv_setting_subpage').each(function( i ) {

            // Checks if the subpage contains breakpoint pages
            let nav_item = '<li data-id="' + ( i + 1 ) + '">' + jQuery( this ).children('h2').text();
            const desktop = jQuery( this ).children('.sv_setting_subpage_desktop').length > 0 ? true : false;

            if ( desktop ) {
                let breakpoint_nav = '<ul class="sv_breakpoint_nav">';
                breakpoint_nav += '<li data-id="desktop" class="active"><i class="fas fa-desktop"></i></li>';

                const tablet_pro_landscape = jQuery( this ).children('.sv_setting_subpage_tablet_pro_landscape').length > 0 ? true : false;
                const tablet_pro = jQuery( this ).children('.sv_setting_subpage_tablet_pro').length > 0 ? true : false;
                const tablet_landscape = jQuery( this ).children('.sv_setting_subpage_tablet_landscape').length > 0 ? true : false;
                const tablet = jQuery( this ).children('.sv_setting_subpage_tablet').length > 0 ? true : false;
                const mobile_landscape = jQuery( this ).children('.sv_setting_subpage_mobile_landscape').length > 0 ? true : false;
                const mobile = jQuery( this ).children('.sv_setting_subpage_mobile').length > 0 ? true : false;

                breakpoint_nav += tablet_pro_landscape ? '<li data-id="tablet_pro_landscape"><i class="fas fa-tablet-alt sv_rotate"></i></li>' : '';
                breakpoint_nav += tablet_pro ? '<li data-id="tablet_pro"><i class="fas fa-tablet-alt"></i></li>' : '';
                breakpoint_nav += tablet_landscape ? '<li data-id="tablet_landscape"><i class="fas fa-tablet-alt sv_rotate"></i></li>' : '';
                breakpoint_nav += tablet ? '<li data-id="tablet"><i class="fas fa-tablet-alt"></i></li>' : '';
                breakpoint_nav += mobile_landscape ? '<li data-id="mobile_landscape"><i class="fas fa-mobile-alt sv_rotate"></i></li>' : '';
                breakpoint_nav += mobile ? '<li data-id="mobile" ><i class="fas fa-mobile-alt"></i></li>' : '';

                breakpoint_nav += '</ul>';
                nav_item += breakpoint_nav;

                const is_size_mobile = jQuery( window ).width() < 850 ? true : false;

                if ( is_size_mobile ) {
                    // console.log( jQuery( this ).parent().children('.sv_setting_subpages_nav'));
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
    });*/
}



function sv_admin_ajax_call( data, modal = false ) {
    if ( data[0].nonce === 'undefined' ) return false;

    if ( modal ) {
        jQuery( '.sv_admin_modal' ).removeClass( 'show' );
    }

    jQuery.post( ajaxurl, data[0], function( response ) {
        let data = JSON.parse( response );

        if ( data.notice ) {
            SVCA.show_notice( data.msg, data.type )
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

        const color				= 'rgba(' + parent.find( '.sv_setting_box_shadow_color' ).children( 'input[type="hidden"]' ).val() + ')';
        const inset				= parent.find( '.sv_setting_box_shadow_inset' ).children( 'select' ).val() === 'inset' ? 'inset ' : '';

        /* Value */
        const box_shadow		= inset + horizontal + horizontal_unit + vertical + vertical_unit + blur + blur_unit + spread + spread_unit + color;

        /* Updates the input value and the preview */
        parent.children( 'input[data-sv_type="sv_form_field"]' ).val( box_shadow );
        parent.children( '.sv_setting_preview' ).css( 'box-shadow', box_shadow );
    }
}

