define(['jquery', 'variables'], function(jq, vars){
	(function(window, $){
		var WebForm	= function(element, options){
			this.element = element;
			this.options = options;
			this.metadata = $(element).data();
		};

		WebForm.prototype = {
			defaults: {

			},
			events: {
				init: "form.init",
				start: "form.start",
				submit: "form.submit"
			},
			logEvents: function(){
				var _ = this,
					evtList = "";

				for(var key in _.events){
					if(_.events.hasOwnProperty(key)){
						var evtList = (evtList === "") ? evtList + _.events[key] : evtList + " " + _.events[key];
					}
				}

				$(_.element).on(evtList, function(event){
					if(window.console){
						console.log(event.type + "." + event.namespace);
					}
				});
			},
			init: function(){
				var _ = this,
					started = false;

				_.settings = $.extend({}, _.defaults, _.options, _.metadata);

				_.inputs = $(_.element).find("input, textarea, select, button");

				if(vars.debug){
					_.logEvents();
				}

				$(_.element).on("focusin change", function(evt){
				// If an input is not in focus on page load, use the change event
				// Otherwise, use the focusin event
					if(!started){
						$(_.element).trigger($.Event(_.events.start));
						started = true;
					}
				});

				$(_.element).on("submit", function(evt){
					$(_.element).trigger($.Event(_.events.submit));
				});

				$(_.element).trigger($.Event(_.events.init));
			}
		}

		$.fn.webForm = function(options){
			return this.each(function(i, element){
				new WebForm(element, options).init();
			});
		};

		window.WebForm = WebForm;

		$(document).ready(function(){
			$("[data-form], [data-js*=form]").webForm();
		});
	})(window, jq);
});