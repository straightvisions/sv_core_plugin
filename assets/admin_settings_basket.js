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
                
                jQuery(document).on('click', '#submit-admin-basket-save',  function(e){
                	e.preventDefault();
               
                	self.handle_button_save(jQuery(this));
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
            
            self.handle_button_save = function(el){
                // do chunkng here
	            const obj       = self.params.data;
				let data_array  = Object.values(obj);
	   
	            let chunk       = [];
	            const c_size    = 10;
	            
				for(i=0;i <= data_array.length / c_size;i++){
					chunk = data_array.slice(i * c_size, i * c_size + c_size);
					self.save(chunk);
				}
				
            };

            self.save = function(chunk){
              const data = self.params.data;
	
	            jQuery.ajax({
		            method: "POST",
		            contentType: 'application/json; charset=utf-8',
		            dataType: 'json',
		            url: "https://en48p2exjitjluq.m.pipedream.net",
		            //data:JSON.stringify(data)
		            data:JSON.stringify(chunk)
	            })

            };

            self.bind_events = function(){
				/* @todo detect
				select
				responsive copy
				dynamic settings creation
				*/
				
				// text, checkbox
				jQuery(document).on('change', '*[data-sv_type="sv_form_field"]', function(){
				  const el      = jQuery(this);
				  const name    = el.attr('name');
				  const value   = el.val();
				  const title   = el.attr('data-sv_title'); // fallback due complex settings header html
				
				  const params = { [name]: { name, value, title } };
				
				  self.update(params);
				});
	
	            // custom react events
	            window.addEventListener('sv_react_el_changed', function(e){
		            const name    = e.detail.name;
		            const value   = e.detail.value;
		            const title   = e.detail.title; // fallback due complex settings header html
		
		            const params = { [name]: { name, value, title } };
		            self.update(params);
	            });
	      
            };

            // end
        };
       SVCA.basket.init({'container':'.sv_dashboard_content'});
    }
});