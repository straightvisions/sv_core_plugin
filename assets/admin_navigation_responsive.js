jQuery(document).ready(function($) {

    if( typeof SVCA != 'undefined' ){

        SVCA.navigation_responsive = new function(){

            const self = this; // prevents scope problem within loops

            self.params = {
                container: null,
            };

            self.call = null;

            self.init = function(params){
                console.log('SVCA-navigation_responsive init');

                // responsive navigation
                jQuery(document).on('click', '.sv_setting_header .sv_setting_responsive_select > *', function() {
                    jQuery(this).parent().parent().parent().find('.sv_setting_responsive').removeClass('active').hide();
                    jQuery(this).parent().parent().parent().find('.sv_setting_responsive_'+jQuery(this).data('sv_setting_responsive_select')).addClass('active').show();

                    // highlight selector
                    jQuery(this).parent().find('i').removeClass('active');
                    jQuery(this).addClass('active');
                });

                console.log('SVCA-navigation_responsive init - done');
            };

            // end
        };
        SVCA.navigation_responsive.init();
    }
});