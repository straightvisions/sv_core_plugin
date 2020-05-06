jQuery(document).ready(function($) {

    if( typeof SVCA != 'undefined' ){

        SVCA.sections = new function(){

            self = this; // prevents scope problem within loops

            self.params = {
                container: null,
            };

            self.init = function(params){
                console.log('SVCA-SECTIONS init');
                if(typeof params != 'undefined'){
                    if(typeof params.container != 'undefined' && $(params.container).length > 0){
                        self.params.container = $(params.container);
                    }else{
                        console.log('ERROR - container element not found');
                    }
                }
                console.log('SVCA-SECTIONS init - done');
            };

            self.get = function(section){
               let output = '';
               return $.ajax({
                    async: false,
                    url: SVCA.params.ajax_url,
                    data: {
                        'action'    : 'sv_ajax_get_section',
                        'section'   : section.replace('#section_',''),
                        'page'      : SVCA.get_url_param('page'),
                        'nonce'     : SVCA.get_plugin_localized_nonce(),
                    },
                    success:function(res) {
                        if(res){

                            self.params.container.prepend( atob(res.data) );
                            if($(section).length > 0){
                                $('.sv_admin_menu_item.active').removeClass('active');
                                self.params.container.find('.sv_admin_section').removeClass('active');
                                $(section).addClass('active ajax-loaded');
                                self.params.container.find('.sv_admin_section:not(.active)').remove();
                                $(section).addClass('active ajax-loaded').fadeIn();
                            }
                        }

                    },
                    error: function(errorThrown){
                        console.log(errorThrown);
                    }
                });
            }


        };

        SVCA.sections.init({container:'.sv_dashboard_content'});

    }

    class SV_CORE_SECTIONS{
        container   = null;

        construct(container){


        }




    }
    // We'll pass this variable to the PHP function example_ajax_request


    // This does the ajax request


});