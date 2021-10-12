jQuery(document).ready(function($) {

    if( typeof SVCA != 'undefined' ){

        SVCA.subpages = new function(){

            const self = this; // prevents scope problem within loops

            self.params = {
                container: null,
            };

            self.call = null;

            self.init = function(params){
                console.log('SVCA-SUBPAGES init');
                self.create();
                self._bind();

                jQuery(window).on('SVCA_UPDATE',function(){
                    SVCA.subpages.create();
                });

                console.log('SVCA-SUBPAGES init - done');
            };

            self.create = function(){
                jQuery('.sv_setting_subpages:not(.rendered)').each(function() {

                    if( jQuery( this ).children('.sv_setting_subpages_nav').children().length > 0 ){
                        return; // skip
                    }

                    // add class to prevent rerender => performance increase
                    jQuery(this).addClass('rendered');

                    jQuery( this ).children('.sv_setting_subpage').each(function( i ) {
                        let _class = '';
                        if(i === 0){
                            _class += ' active';
                        }
                        // Checks if the subpage contains breakpoint pages
                        let nav_item = '<li class="'+_class+'" data-id="' + ( i + 1 ) + '">' + jQuery( this ).children('h2').text()+'</li>';

                        jQuery( this ).parent().children('.sv_setting_subpages_nav').append( nav_item );
                    });
                });
            };

            self._bind = function(){
                jQuery('body').on('click', '.sv_setting_subpages_nav > *', function(){
                    jQuery( this ).parent().children('*').removeClass('active');
                    jQuery( this ).addClass('active');
                    jQuery( this ).parent().parent().children('.sv_setting_subpage').hide();
                    jQuery( this ).parent().parent().children('.sv_setting_subpage:nth-of-type('+jQuery(this).data('id')+')').fadeIn();
                });
            }

            // end
        };
        SVCA.subpages.init();
    }
});