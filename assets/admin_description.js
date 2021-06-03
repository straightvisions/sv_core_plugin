jQuery(document).ready(function($) {

    if( typeof SVCA != 'undefined' ){

        SVCA.description = new function(){

            self = this; // prevents scope problem within loops

            self.params = {
                container: null,
            };

            self.call = null;

            self.init = function(params){
                console.log('SVCA-DESCRIPTION init');
                self._bind();
                console.log('SVCA-DESCRIPTION init - done');
            };

            self._bind = function(){
                /* Description (Tooltip) */
                jQuery(document).on('click', '.sv_setting_header .sv_setting_description_icon', function() {
                    jQuery( this ).parent().find('.sv_setting_description').slideToggle(200);
                });

            }

            // end
        };
        SVCA.description.init();
    }
});