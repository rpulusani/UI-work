define(['jquery'], function(jq){
	;(function($){
		'use strict';
		$.fn.pullquote = function(options){
            var settings = $.extend({
            	before: false,
            	ellipsis: false,
            	color: ""
            }, options);
            $.extend(this, settings);

            var container = $(this).closest('p');

            function setQuote(el){
            	var text = $(el).text().charAt(0).toUpperCase() + $(el).text().slice(1);;
            	switch(settings.ellipsis){
            		case "start":
            			text = "..." + text;
            		break;
            		case "end":
            			text = text + "...";
            		break;
            		case "both":
            			text = "..." + text + "...";
            		break;
            		default:
            		break;
            	}
            	container.attr("data-pullquote", text);
            }

            function addClasses(){
            	container.addClass("pullquote");
            	if(settings.before){
            		container.addClass("pullquote--before");
            	}
            	if(settings.color != ""){
                        if(settings.before){
                              container.addClass("before-text--" + settings.color);
                        }else{
                              container.addClass("after-text--" + settings.color);
                        }
            	}
            }

            return this.each(function(){
            	var el = $(this);
            	addClasses();
            	setQuote(el);
            });
        }

		$('[data-js=pullquote]').each(function(){
			$(this).pullquote($(this).data());
		});
	})(jq);
});
