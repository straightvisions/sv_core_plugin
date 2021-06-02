jQuery(document).ready(function($) {

    if( typeof SVCA != 'undefined' ){

        SVCA.navigation = new function(){

            self = this; // prevents scope problem within loops

            self.params = {
                container: null,
            };

            self.call = null;

            self.init = function(params){
                console.log('SVCA-NAVIGATION init');
                if(typeof params != 'undefined'){
                    if(typeof params.container != 'undefined' && jQuery(params.container).length > 0){
                        self.params.container = jQuery(params.container);
                    }else{
                        console.log('ERROR - container element not found');
                    }
                }

                jQuery(document).on('click', '.sv_admin_menu_item, [data-sv_admin_menu_target]', function() {
                    if(!jQuery(this).hasClass('active')) {
                        if(jQuery(document).width() < 800) {
                            jQuery(jQuery('.sv_admin_mobile_toggle').attr('data-sv_admin_menu_target')).toggle();
                        }
                        jQuery('.sv_admin_menu_item').removeClass('active');
                        SVCA.sections.get( jQuery(this).data('sv_admin_menu_target') );
                        jQuery(this).addClass('active');
                    }
                });

                console.log('SVCA-NAVIGATION init - done');
            };

            // end
        };
        SVCA.navigation.init({'container':'.sv_admin_menu_body'});
    }
});