jQuery(document).ready(function($) {

    if( typeof SVCA != 'undefined' ){

        SVCA.clipboard = new function(){

            self = this; // prevents scope problem within loops

            self.params = {
                container: null,
            };

            self.call = null;

            self.init = function(params){
                console.log('SVCA-CLIPBOARD init');
                self._bind();

                jQuery(window).on('SVCA_UPDATE',function(){
                   self._bind();
                });

                console.log('SVCA-CLIPBOARD init - done');
            };

            self._bind = function(){

                /* Copy from textarea to clipboard */
                jQuery('body').on('click', 'button.sv_copy_target_to_clipboard', function(e){
                    e.preventDefault();
                    jQuery('#'+jQuery(this).attr('data-source')).select();
                    document.execCommand('copy');
                    SVCA.show_notice('Copied');
                });
            }

            // end
        };
        SVCA.clipboard.init();
    }
});