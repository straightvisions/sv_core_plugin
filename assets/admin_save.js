jQuery(document).ready(function($) {

    if( typeof SVCA != 'undefined' ){

        SVCA.save = new function(){

            self = this; // prevents scope problem within loops

            self.params = {
                container: null,
            };

            self.call = null;

            self.init = function(params){
                console.log('SVCA-SAVE init');

                // hotfix while feature dev
                jQuery( document ).on('submit', 'section.sv_admin_section form', function(e){
                    jQuery(this).find('input[name="_wp_http_referer"]').val(jQuery(location).attr('href'));
                });

                console.log('SVCA-SAVE init - done');
            };

            // end
        };
        SVCA.save.init({'container':'.sv_admin_menu_body'});
    }
});