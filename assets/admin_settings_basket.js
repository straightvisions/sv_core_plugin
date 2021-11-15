jQuery(document).ready(function($) {

    if( typeof SVCA != 'undefined' ){

        SVCA.basket = new function(){

            const self = this; // prevents scope problem within loops

            self.params = {
                container: null,
                data: {}
            };

            self.call = null;

            self.init = function(params){
                console.log('SVCA-BASKET init');

                self.params = {...self.params,...params};

                jQuery(window).on('sv_admin_section_loaded',function(){
                    SVCA.basket.on_update();
                });

                console.log('SVCA-BASKET init - done');
            };

            self.on_update = function(){
                self.bind_events();
            };

            self.update = function(params){

                self.params.data = {...self.params.data, ...params};
                console.log(self.params.data);
                jQuery(window).trigger('SVCA_UPDATE');
            };

            self.save = function(){
              const data = self.params.data;


            };

            self.bind_events = function(){
				const container = self.params.container;
				/* @todo detect
				select
				responsive copy
				dynamic settings creation
				*/
				
				// text, checkbox
				jQuery(container+' input.sv_input').on('change', function(){
				  const el      = jQuery(this);
				  const name    = el.attr('name');
				  const value   = el.val();
				  const title   = el.attr('placeholder'); // fallback due complex settings header html
				
				  const params = { [name]: { name, value, title } };
				
				  self.update(params);
				});
	            // select
	            jQuery(container+' select.sv_input').on('change', function(){
		            const el      = jQuery(this);
		            const name    = el.attr('name');
		            const value   = el.val();
		            const title   = el.attr('placeholder'); // fallback due complex settings header html
		
		            const params = { [name]: { name, value, title } };
		
		            self.update(params);
	            });

            };

            // end
        };
       SVCA.basket.init({'container':'.sv_dashboard_content'});
    }
});