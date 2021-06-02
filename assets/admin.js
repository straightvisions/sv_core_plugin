/* NEW FOR LATER EXTENSION */
if( typeof SVCA == 'undefined' ){
    SVCA = new function(){

        this.init = function(){
            this.params = {
                ajax_url: 	sv_core_admin.ajaxurl,
                ajax_nonce: (typeof sv_core_admin.nonce !== 'undefined') ? sv_core_admin.nonce : '',
            };
        };

        this.loader = function(show){
        	const loader = jQuery('.sv_dashboard_ajax_loader');
        	if(typeof show == 'undefined'){
        		show = true;
			}

			if(show == true){
                loader.show();
			}else{
                loader.hide();
			}
		};

        this.get_url_param = function(param_name){
            let result 	= null;
            let tmp 	= [];
            const items = location.search.substr(1).split("&");

            for (var index = 0; index < items.length; index++) {
                tmp = items[index].split("=");
                if (tmp[0] === param_name) result = decodeURIComponent(tmp[1]);
            }

            return result;
		};

        this.set_url_param = function(params){
            const url 			= new URL( window.location.href );
            const search_params = url.searchParams;

            for (var key of Object.keys(params)) {
                search_params.set(key, params[key]);
            }

			url.search 		= search_params.toString();
			const new_url	= url.toString();

        	//@todo add support for urls without any param
            history.pushState({
                id: 'homepage'
            }, '', new_url);
        };

        this.get_plugin_localized_nonce = function(){
            let output = 'xxx';

            if( typeof sv_core_admin['nonce_sv_admin_ajax_' + this.get_url_param('page')] !== 'undefined' ){
                output = sv_core_admin['nonce_sv_admin_ajax_' + this.get_url_param('page')];
            }

            return output;
        };

        this.init();
    };
}
