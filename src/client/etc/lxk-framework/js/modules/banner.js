define(['jquery', 'modernizr', 'throttle-debounce'], function(jq){
	(function(window, $){
		var Banner = function(element, options){
			this.element = element;
			this.options = options;
			this.metadata = $(element).data("banner-options");
		}

		Banner.prototype = {
			defaults: {

			},
			events: {
				init: "banner.init",
				resize: "banner.resize"
			},
			debug: false,
			init: function(){
				var _ = this,
					currentHeight = windowHeight = $(window).height(),
					currentWidth = windowWidth = $(window).width();

				_.settings = $.extend({}, _.defaults, _.options, _.metadata);

				if(console && _.debug){
					_.logEvents();
				}

				_.visualContainer = $(_.element).find(".banner__visual-container");
				_.visual = $(_.element).find(".banner__visual");
				_.contentContainer = $(_.element).find(".banner__content-container");
				_.content = $(_.element).find(".banner__content");
				
				$(_.element).find('img').load(function(){
					$(_.element).css({
						"min-height": _.getMinHeight()
					});
				});

				$(_.element).css({
					"min-height": _.getMinHeight()
				});

				_.alignMiddleFallback();

				$(window).resize($.debounce(250, function(){
					windowHeight = $(window).height();
					windowWidth = $(window).width();

					if(currentHeight !== windowHeight || currentWidth !== windowWidth){
						$(_.element).css({
							"min-height": _.getMinHeight()
						});

						_.alignMiddleFallback();

						currentHeight = windowHeight;
						currentWidth = windowWidth;

						$(_.element).trigger($.Event(_.events.resize));
					}
				}));

				$(_.element).trigger($.Event(_.events.init));
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
					console.log(event.type + "." + event.namespace);
				});
			},
			getMinHeight: function(){
				var _ = this;

				return (_.content.outerHeight() > _.visual.outerHeight()) ? _.content.outerHeight() : _.visual.outerHeight();
			},
			alignMiddleFallback: function(){
				var _ = this;

				if(!Modernizr.csstransforms && ($(_.element).hasClass("banner--overlay") || $(_.element).hasClass("banner--overlay-r"))){
					$(_.contentContainer).add(_.visualContainer).css({
						"transform": "none"
					});
					if($(_.element).hasClass("banner--content-middle")){
						_.contentContainer.css({
							"margin-top": (-0.5)*_.content.outerHeight()
						});
					}
					if($(_.element).hasClass("banner--visual-middle")){
						_.visualContainer.css({
							"margin-top": (-0.5)*_.visual.outerHeight()
						});
					}
				}
			}
		}

		Banner.defaults = Banner.prototype.defaults;

		$.fn.banner = function(options){
			return this.each(function(i, element){
				new Banner(element, options).init();
			});
		}

		window.Banner = Banner;

		$(document).ready(function(){
			$("[data-banner], [data-js*=banner]").banner();
		})
	})(window, jq);
});
