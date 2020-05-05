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
                $.ajax({
                    url: SVCA.params.ajax_url,
                    data: {
                        'action': 'sv_ajax_get_section',
                        'section' : section,
                        'nonce' : SVCA.params.ajax_nonce,
                    },
                    success:function(data) {
                        self.params.container.prepend(data.html);
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