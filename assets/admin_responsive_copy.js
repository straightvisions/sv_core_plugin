jQuery(document).ready(function($) {

    if( typeof SVCA != 'undefined' ){

        SVCA.responsive_copy = new function(){

            self = this; // prevents scope problem within loops

            self.params = {
                container: null,
            };

            self.call = null;

            self.init = function(params){
                console.log('SVCA-responsive_copy init');
                /* Responsive Inherit Overwrite */
                jQuery(document).on('click', '.sv_setting_header .sv_setting_responsive_force', function() {
                    const container = jQuery(this).closest('.sv_setting');
                    const settings_source = container.children('.active').first();
                    const settings_source_inputs = settings_source.find('.sv_input');

                    settings_source_inputs.each(function(){
                        const el    = jQuery(this);
                        let id      = el.attr('id');
                        const is_color_setting = el.closest('.sv_setting').hasClass('sv_setting_color_parent');

                        if(typeof id == 'undefined' || id == ''){
                            return; // block group settings - please fix this
                        }
                        const value = el.val();
                        let settings_type = el.attr('data-sv_settings_type') ? el.attr('data-sv_settings_type') : 'default';

                        // hotfix color settings field for missing react object class
                        if( is_color_setting ){
                            settings_type = 'color';
                        }

                        // copy to main settings input form field
                        SVCA.responsive_copy.copy(container, id, value);

                        // do frontend update processing
                        switch(settings_type){
                            case 'border_width': SVCA.responsive_copy.update_border_width(container, id, value); break;
                            case 'border_radius': SVCA.responsive_copy.update_border_radius(container, id, value); break;
                            case 'color': SVCA.responsive_copy.update_color(container, id, value); break;
                        }

                    });

                    SVCA.show_notice('Setting copied to breakpoints.');

                });

                console.log('SVCA-responsive_copy init - done');
            };

            self.get_placeholder_id = function(id){
                /*hackish, use react or states */
                id = id.replace('[mobile]','[XXX]');
                id = id.replace('[mobile_landscape]','[XXX]');
                id = id.replace('[tablet]','[XXX]');
                id = id.replace('[tablet_landscape]','[XXX]');
                id = id.replace('[tablet_pro]','[XXX]');
                id = id.replace('[tablet_pro_landscape]','[XXX]');
                id = id.replace('[desktop]','[XXX]');

                // color hotfix
                id = id.replace('[color]','\\[color\\]');

                return id;
            };

            self.copy = function(container, id, value){
                id = SVCA.responsive_copy.get_placeholder_id(id); // weird scope change

                container.find('.sv_input#'+id.replace('[XXX]','\\[mobile\\]')).val(value);
                container.find('.sv_input#'+id.replace('[XXX]','\\[mobile_landscape\\]')).val(value);
                container.find('.sv_input#'+id.replace('[XXX]','\\[tablet\\]')).val(value);
                container.find('.sv_input#'+id.replace('[XXX]','\\[tablet_landscape\\]')).val(value);
                container.find('.sv_input#'+id.replace('[XXX]','\\[tablet_pro\\]')).val(value);
                container.find('.sv_input#'+id.replace('[XXX]','\\[tablet_pro_landscape\\]')).val(value);
                container.find('.sv_input#'+id.replace('[XXX]','\\[desktop\\]')).val(value).trigger('change');

            };

            self.update_color = function(container, id, value){
                id = SVCA.responsive_copy.get_placeholder_id(id);

                const classes = [
                    'mobile',
                    'mobile_landscape',
                    'tablet',
                    'tablet_landscape',
                    'tablet_pro',
                    'tablet_pro_landscape',
                    'desktop'
                ];

                for(i=0;i<classes.length;i++){
                    container.find('.sv_setting_responsive.sv_setting_responsive_'+classes[i]+' .sv_setting_color_value').css('background-color', 'rgba(' + value + ')');
                }

            };

            self.update_border_width = function(container, id, value){
                id = SVCA.responsive_copy.get_placeholder_id(id);

                const IDs = [
                    id.replace('[XXX]','\\[mobile\\]'),
                    id.replace('[XXX]','\\[mobile_landscape\\]'),
                    id.replace('[XXX]','\\[tablet\\]'),
                    id.replace('[XXX]','\\[tablet_landscape\\]'),
                    id.replace('[XXX]','\\[tablet_pro\\]'),
                    id.replace('[XXX]','\\[tablet_pro_landscape\\]'),
                    id.replace('[XXX]','\\[desktop\\]')
                    ];

                for(i=0;i<IDs.length;i++){
                    const target = container.find('.sv_input#'+IDs[i]);
                    const wrapper = target.closest('.sv_setting_border_width_wrapper');
                    if(wrapper.length > 0){
                        const _value = SVCA.responsive_copy.get_value_unit_array(value);
                        const input_number = wrapper.find('.sv_setting_border_width_number');
                        const input_unit = wrapper.find('.sv_setting_border_width_unit');

                        input_number.val(_value.val);
                        input_unit.val(_value.unit);


                    }else{
                        console.log('ERROR - update_border_width wrapper not found!');
                    }

                }

            };

            self.update_border_radius = function(container, id, value){
                id = SVCA.responsive_copy.get_placeholder_id(id);
         
                const IDs = [
                    id.replace('[XXX]','\\[mobile\\]'),
                    id.replace('[XXX]','\\[mobile_landscape\\]'),
                    id.replace('[XXX]','\\[tablet\\]'),
                    id.replace('[XXX]','\\[tablet_landscape\\]'),
                    id.replace('[XXX]','\\[tablet_pro\\]'),
                    id.replace('[XXX]','\\[tablet_pro_landscape\\]'),
                    id.replace('[XXX]','\\[desktop\\]')
                ];

                for(i=0;i<IDs.length;i++){
                    const target = container.find('.sv_input#'+IDs[i]);
                    const wrapper = target.closest('.sv_setting_border_radius_wrapper');
                    if(wrapper.length > 0){
                        const _value = SVCA.responsive_copy.get_value_unit_array(value);
                        const input_number = wrapper.find('.sv_setting_border_radius_number');
                        const input_unit = wrapper.find('.sv_setting_border_radius_unit');

                        input_number.val(_value.val);
                        input_unit.val(_value.unit);


                    }else{
                        console.log('ERROR - update_border_width wrapper not found!');
                    }

                }

            };


            self.get_value_unit_array = function(str) {
                res = str.match(/(-?[\d.]+)([a-z%]*)/);
                return {
                    val: parseFloat(res[1]),
                    unit: res[2]
                }
            }

            // end
        };
        SVCA.responsive_copy.init();
    }
});