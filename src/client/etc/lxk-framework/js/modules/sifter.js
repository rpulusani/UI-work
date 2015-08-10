define(['jquery'], function(jq){
	(function(window, $){
		var Sifter = function(element, options){
			this.element = element;
			this.options = options;
			this.metadata = $(element).data("sifter-options");
		}

		Sifter.prototype = {
			defaults: {
				itemSelector: '[data-sifter-tags]',
				filterSelector: '[data-sifter-filter]',
				filter: ''
			},
			events: {
				init: "sifter.init",
				filter: "sifter.filter",
				filtered: "sifter.filtered",
				itemHide: "sifter.item.hide",
				itemShow: "sifter.item.show"
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
			init: function(){
				var _ = this;

				_.settings = $.extend({}, _.defaults, _.options, _.metadata);

				_.items = $(_.element).find(_.settings.itemSelector);

				_.filters = $(_.element).find(_.settings.filterSelector);

				if(_.settings.filter !== ''){
					_.filterByTag(_.settings.filter);
				}

				_.filters.each(function(i, filterElement){
					var filter = $(filterElement).data("sifter-filter");

					$(filterElement).click(function(){
						$(_.element).trigger($.Event(_.events.filter));
						_.filterByTag(filter);
					});
				});

				$(_.element).trigger($.Event(_.events.init));
			},
			filterByTag: function(tag){
				var _ = this;

				_.items.each(function(i, item){
					var hideItem = (tag != "") ? true : false;
					var itemTags = $(item).data("sifter-tags").split(" ");
					
					$(itemTags).each(function(n, itemTag){
						if(itemTag === tag ){
							hideItem = false;
						}
					});

					if(hideItem){
						$(item).hide();
						$(item).trigger($.Event(_.events.itemHide));
					}else{
						$(item).show();
						$(item).trigger($.Event(_.events.itemShow));
					}
				});

				$(_.element).trigger($.Event(_.events.filtered));
			}
		}

		Sifter.defaults = Sifter.prototype.defaults;

		$.fn.sifter = function(options){
			return this.each(function(i, element){
				new Sifter(element, options).init();
			});
		}

		window.Sifter = Sifter;

		$(document).ready(function(){
			$("[data-sifter], [data-js*=sifter]").sifter();
		})
	})(window, jq);
});
