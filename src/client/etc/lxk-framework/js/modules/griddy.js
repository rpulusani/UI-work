define(['jquery', 'modernizr', 'throttle-debounce'], function(jq){
	(function(window, $){
		var Griddy = function(element, options){
			this.element = element;
			this.options = options;
			this.metadata = $(element).data("griddy-options");
		}

		Griddy.prototype = {
			defaults: {
				itemSelector: '[data-griddy-item]',
				columnCount: "",
				columnWidth: "",
				columnGap: "20px",
				columnFill: "balance"
			},
			events: {
				init: "griddy.init",
				draw: "griddy.draw",
				drawn: "griddy.drawn"
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

				_.grid = $(_.element);

				_.items = _.grid.children(_.settings.itemSelector);

				if(Modernizr.csscolumns){
					// use css columns
					_.grid.css({
						"column-fill": _.settings.columnFill,
						"column-gap": _.settings.columnGap,
						"column-width": _.settings.columnWidth,
						"column-count": _.settings.columnCount
					});
				}else{
					_.fallback(_.settings.columnCount, _.settings.columnWidth);

					var currentHeight = $(window).height(),
						currentWidth = $(window).width();

					$(window).resize($.debounce(250, function(){
						var windowHeight = $(window).height(),
							windowWidth = $(window).width();

						if(currentHeight !== windowHeight || currentWidth !== windowWidth){
							_.fallback(_.settings.columnCount, _.settings.columnWidth);

							currentHeight = windowHeight;
							currentWidth = windowWidth;
						}
					}))
					.on("sifter.filtered", function(){
						// All FEF events that could cause a need to redraw the grid
						_.fallback(_.settings.columnCount, _.settings.columnWidth);
					});
				}

				$(_.element).trigger($.Event(_.events.init));
			},
			fallback: function(columnCount, columnWidth){
				var _ = this,
					columnStr = '<div class="col-griddy"></div>',
					colCount = 1,
					colWidth;

				if(_.columns){
					_.grid.append(_.items);
							
					$(_.columns).each(function(i, column){
						$(column).remove();
					});
					_.columnContainer.remove();
				}

				$(_.element).trigger($.Event(_.events.draw));

				_.columnContainer = $('<div class="row" style="margin-right: -' + _.settings.columnGap + '"></div>'),

				_.columns = new Array();

				_.grid
					.css({
						// disable css columns just in case
						"columns": "auto auto"
					})
					.append(_.columnContainer);

				if(columnCount != "" && columnCount != "auto"){
					colCount = columnCount;
				}else if(columnWidth != "" && columnWidth != "auto" && _.grid.width() > parseInt(columnWidth)){
					colCount = Math.floor(_.grid.width() / parseInt(columnWidth));
				}

				colWidth = 100 / colCount + "%";

				for(var i = 0; i < colCount; i++){
					_.columns[i] = $(columnStr).css({
						"width": colWidth,
						"padding-right": _.settings.columnGap
					});
					_.columnContainer.append(_.columns[i]);
				}

				_.columns[0].append(_.items);

				var optimalHeight = Math.floor(_.grid.height() / colCount);

				for(var i = 0; i < colCount - 1; i++){
					_.columns[i].children(_.settings.itemSelector).each(function(n, item){
						if($(item).position().top >= optimalHeight){
							_.columns[i + 1].append($(item));
						}
					});
				}

				$(_.element).trigger($.Event(_.events.drawn));
			}
		}

		Griddy.defaults = Griddy.prototype.defaults;

		$.fn.griddy = function(options){
			return this.each(function(i, element){
				new Griddy(element, options).init();
			});
		}

		window.Griddy = Griddy;

		$(document).ready(function(){
			$("[data-griddy], [data-js*=griddy]").griddy();
		})
	})(window, jq);
});
