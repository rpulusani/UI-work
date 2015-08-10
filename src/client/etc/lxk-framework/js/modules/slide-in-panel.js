define(['jquery', 'throttle-debounce', 'modernizr'], function(jq) {
 	;(function($){
	 	'use strict';
		$.fn.slideInPanel = function(options){
		    var settings = $.extend({
		    	breakpoint: "",
		    	static: false,
		    	button: true,
		    	trigger: "[data-target=#" + $(this).attr("id") + "], [href=#" + $(this).attr("id") + "], [data-slide=" + $(this).attr("id") + "]"
		    }, options);
		    $.extend(this, settings);

		    var panelClassName = "slide-in-panel",
		    	panelAfterClassName = panelClassName + "--after",
		    	openPanelClassName = panelClassName + "--is-open",
		    	pageContainerClassName = panelClassName + "__page-container",
		    	backdropClassName = panelClassName + "__backdrop",
		    	closeButtonClassName = panelClassName + "__close",
		    	closeButtonContent = "&times;",
		    	transitionTime = 1000;

		    var panelIsOpen = false;

		    function fixMarkup(element){
		    	if($("." + pageContainerClassName).size() == 0){
					$(document.body).children()
						.wrapAll('<div class="' + pageContainerClassName + '"></div>');
				}
		    	if(element.parents("." + pageContainerClassName).size() > 0){
			    	element.insertAfter(element.closest("." + pageContainerClassName));
			    }
		    }

		    function addCloseButton(element){
		    	if(!element.find("." + closeButtonClassName).size() > 0){
		    		element.append('<a href="#" class="'
		    			+ closeButtonClassName
		    			+ '" data-js="closePanel">'
		    			+ closeButtonContent
		    			+ '</a>');
		    	}
		    }

		    function openSlide(element){
		    	var breakpoint = standardizeBreakPointKeyWords(settings.breakpoint);

		    	if(!Modernizr.mq("only screen and (" + breakpoint + ")") || breakpoint === ""){
			    	element.addClass(openPanelClassName);
			    	if(element.hasClass(panelAfterClassName)){
			    		$("." + pageContainerClassName).addClass(panelAfterClassName);
			    	}
			    	$("." + pageContainerClassName).addClass(openPanelClassName)
			    		.append('<div class="' + backdropClassName + '" />');
			    	$("." + backdropClassName).click(function(e){
	    				e.stopPropagation();
	    				e.preventDefault();

	    				if(!settings.static){
				    		closeSlide(element);
	    				}
	    			});
	    			window.setTimeout(function(){
	    				$(document.body).addClass(openPanelClassName);
	    			}, transitionTime);
			    }
		    }

		    function closeSlide(element){
    			element.removeClass(openPanelClassName);
		    	$("." + pageContainerClassName).removeClass(openPanelClassName).removeClass(panelAfterClassName);
		    	$("." + backdropClassName).unbind().remove();
		    	window.setTimeout(function(){
		    		$(document.body).removeClass(openPanelClassName);
		    	}, transitionTime);
		    }

		    function standardizeBreakPointKeyWords(breakpoint){
		    	switch(breakpoint){
		    		case "mobile":
		    			breakpoint = "min-width: 34em";
		    		break;
		    		case "tablet":
		    			breakpoint = "min-width: 54em";
		    		break;
		    		case "laptop":
		    			breakpoint = "min-width: 74em";
		    		break;
		  			default:
		    	}
		    	return breakpoint;
		    }

		    function closeOnBreakPoint(element){
		    	var breakpoint = standardizeBreakPointKeyWords(settings.breakpoint);
		    	
	    		if(element.hasClass(openPanelClassName) && Modernizr.mq("only screen and (" + breakpoint + ")")){
				    closeSlide(element);
	    		}
		    }

		    function initPanel(element){
		    	element.click(function(e){
		    		e.stopPropagation();
		    	});

		    	$(settings.trigger).each(function(){
		    		$(this).click(function(e){
		    			e.preventDefault();
		    			e.stopPropagation();

		    			if($("." + openPanelClassName).length != 0){
				    		if(element.hasClass(openPanelClassName)){
				    			closeSlide(element);
				    		}else{
					    		closeSlide($("." + panelClassName + "." + openPanelClassName));
					    		window.setTimeout(openSlide(element), transitionTime);
					    	}
				    	}else{
		    				openSlide(element);
		    			}
		    		});
		    	});

			    if(settings.button){
			    	addCloseButton(element);
			    	$("." + closeButtonClassName).click(function(e){
			    		e.preventDefault();
			    		e.stopPropagation();
			    	});
			    }else{
			    	element.find("." + closeButtonClassName).remove();
			    }

			    element.find("[data-js=closePanel]").each(function(){
		    		$(this).click(function(e){
				    	closeSlide(element);
		    		});
		    	});

		    	$(window).resize($.debounce(250, function(){
		    		closeOnBreakPoint(element);
		    	}));

		    	fixMarkup(element);

		    	$(element).trigger($.Event("panel.init"));
		    }

		    return this.each(function(){
		    	var element = $(this);
		    	initPanel(element);
		    });
		}

		$("[data-js=slideInPanel]").each(function(){
			$(this).slideInPanel(jq(this).data());
		});
	})(jq);
});