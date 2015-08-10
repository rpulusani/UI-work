define(['jquery'], function(jq) {
	'use strict';
	jq.fn.alertBox = function(options){
    	var settings = jq.extend({}, options);
    	jq.extend(this, settings);

    	function addIcons(element){
            var hasIcon = (function(){
                if(element.children(".icon.alert__icon").size() != 0){
                    return true;
                }else{
                    return false;
                }
            });
            var hasClose = (function(){
                if(element.children(".alert__close").size() != 0){
                    return true;
                }else{
                    return false;
                }
            });

            if(!element.data("basic") && !hasIcon()){
                var icon = chooseIcon(element);
                element.prepend("<icon class='alert__icon icon icon--small icon--ui " + icon + "'></i>");
            }
            if(!element.data('static') && !hasClose()){
                element.prepend("<span class='alert__close' data-js='alert-close' aria-hidden='true'>&times;</span>");
            }
        }
        function bindCloseButton(element){
            element.click(function(){
                jq(this).parent().addClass('alert--is-hidden');
            })
        }
        function chooseIcon(element){
            var icon = "";
            if(element.hasClass("alert--error")){
                icon = "icon--error";
            }else if(element.hasClass("alert--success")){
                icon = "icon--success";
            }else if(element.hasClass("alert--info")){
                icon = "icon--info";
            }else{
                icon = "icon--warning";
            }
            return icon;
        }
    	return this.each(function(){
				jq(this).children().wrapAll('<div class="alert__body"></div>');
            addIcons(jq(this));
            bindCloseButton(jq(this).find('[data-js=alert-close]'));
        });
    }
    jq('[data-js=alert]').alertBox();
});
