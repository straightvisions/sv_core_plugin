jQuery(document).ready(function($) {

    if( typeof SVCA != 'undefined' ){

        SVCA.select_number_units = new function(){

            const self = this; // prevents scope problem within loops

            self.params = {
                container: null,
            };

            self.call = null;

            self.init = function(params){
                console.log('SVCA-select_number_units init');

                /* When the select unit changes */
                jQuery(document).on( 'change', '.sv_setting select.sv_input_units', function(e) {
                    const number_select = jQuery( e.target ).parent().children( 'input[type="number"]' );
                    const data_input = jQuery( e.target ).parent().children( 'input[data-sv_type="sv_form_field"]' );

                    const unit 		= e.target.value;
                    const number 	= number_select.val();
                    const value 	= number + unit;

                    data_input.val( value );
                } );

                /* When the number value changes */
                jQuery(document).on( 'change', '.sv_setting input[type="number"]', function(e) {
                    const unit_select = jQuery( e.target ).parent().children( 'select.sv_input_units' );

                    if ( unit_select.length > 0 ) {
                        const data_input = jQuery( e.target ).parent().children( 'input[data-sv_type="sv_form_field"]' );

                        const unit 		= unit_select.val();
                        const number 	= e.target.value;
                        const value 	= number + unit;

                        data_input.val( value );
                    }
                } );

                console.log('SVCA-select_number_units init - done');
            };

            // end
        };
        SVCA.select_number_units.init();
    }
});