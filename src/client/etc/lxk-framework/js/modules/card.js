define(['jquery', 'modernizr', 'throttle-debounce'], function(jq){
	(function(window, $){
		var Card = function(element, options){
			this.element = element;
			this.options = options;
			this.metadata = $(element).data("card-options");
		}

		Card.prototype = {
			defaults: {

			},
			events: {
				init: "card.init",
				draw: "card.draw"
			},
			init: function(){
				var _ = this;

				_.settings = $.extend({}, _.defaults, _.options, _.metadata);

				_.title = $(this.element).find(".card__title");
				_.subTitle = $(this.element).find(".card__sub-title");
				_.author = $(this.element).find(".card__author");
				_.content = $(this.element).find(".card__content");
				_.visual = $(this.element).find(".card__visual");
				_.action = $(this.element).find(".card__action");
				_.actionOverlay = $(this.element).find(".card__action-overlay");

				_.addActionOverlay();

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
			addActionOverlay: function(){
				var _ = this,
					actionCopy = _.action.clone(true, true).attr("id", "").attr("class", "").html("");
					// Make a copy of the action link only (remove all classes, ids, and text)
					// This is to make sure to keep any other needed attributes of the action link (such as target)

				if(_.actionOverlay.length === 0){
					_.actionOverlay = actionCopy.clone(true, true).addClass("card__action-overlay");

					$(_.element).append(_.actionOverlay);
				}
				
				if(_.visual.find("img").parent("a").length === 0){
					_.visual.find("img").wrap(actionCopy.clone(true, true));
				}
			}
		}

		Card.defaults = Card.prototype.defaults;

		$.fn.card = function(options){
			return this.each(function(i, element){
				new Card(element, options).init();
			});
		}

		window.Card = Card;

		$(document).ready(function(){
			$("[data-card], [data-js*=card]").card();
		})
	})(window, jq);
});
