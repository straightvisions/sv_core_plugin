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