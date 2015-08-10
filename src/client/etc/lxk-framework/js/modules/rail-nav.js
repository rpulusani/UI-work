define(['jquery', "stable/set", "stable/media-queries", "modernizr", "throttle-debounce"], function(jq, set, mediaQueries){
	;(function($){
		'use strict';
		$.fn.railNav = function(options){
			var settings = $.extend({
				breakpoint: "lt-laptop",
				label: "Menu",
				toggleSettings: {
					collapsable: true,
					collapseAll: true
				}
			}, options);
			$.extend(this, settings, this.data());

			var events = {
				draw: "railNav.draw",
				init: "railNav.init"
			},
			classNames = {
				base: "rail-navigation",
				collapse: "rail-navigation__collapse",
				button: "rail-navigation__btn",
				label: "rail-navigation__label",
				submenu: "rail-navigation__submenu"
			}

			function genMarkup(id){
				return {
					collapsableNav: '<div class="' + classNames.collapse + '" data-js="accordion"></div>',
					button: '<button class="' + classNames.button + '" data-toggle="' + id + '"><i class="icon icon--ui"></i></button>',
					label: '<div class="' + classNames.label + '">' + settings.label + '</div>',
					content: '<div class="set__content" id="' + id + '"></div>'
				};
			}

			function genIds(nav, items){
				$(items).each(function(i, item){
					var id = $(nav).attr("id") + "_item" + i;

					item.element.attr("id", id);

					if(item.subnav.length != 0){
						item.element.children("ul").attr("id", id + "_subnav");
						genIds(item.element.children("ul"), item.subnav);
					}
				});
			}

			function getNavItems(nav){
				var items = new Array();

				$(nav).children("li").each(function(i, item){
					items[i] = {
						"element": $(item),
						"text": $(item).clone().children("ul").remove().end().text().trim(),
						"url": $(item).children("a").attr("href") || null,
						"children": $(item).children(),
						"classes": $(item).attr("class") || null,
						"subnav": []
					}

					if($(item).children("ul").length != 0){
						// Subnav
						items[i]["subnav"] = getNavItems($(item).children("ul"));
					}
				});

				return items;
			}

			function buildBasicNav(nav, items){
				if(isCollapsableNav(nav)){
					var container = $(nav).closest("." + classNames.collapse);
					container.after($(nav));
					container.remove();
					$(nav)
						.find("." + classNames.button)
							.unbind()
							.off()
							.remove()
							.end()
						.find(".set__content")
							.removeClass("set__content")
							.end()
						.find(".set--is-active")
							.removeClass("set--is-active");

					$(nav).trigger($.Event(events.draw));
				}
			}

			function buildCollapsableNav(nav, items){
				if(!isCollapsableNav(nav)){
					var collapsableNav = $(genMarkup($(nav).attr("id") + "Container").collapsableNav),
						toggleBtn = $(genMarkup($(nav).attr("id") + "Wrapper").button),
						label = $(genMarkup($(nav).attr("id") + "Label").label),
						navContent = $(genMarkup($(nav).attr("id") + "Wrapper").content);

					collapsableNav
						.append(toggleBtn)
						.append(label)
						.append(navContent)
						.set(settings.toggleSettings);

					$(nav).after(collapsableNav);
					navContent.append($(nav));

					initSubnavs(items);

					$(nav).trigger($.Event(events.draw));
				}
			}

			function buildCorrectNav(nav, items, mq){
				if(Modernizr.mq(mq)){
					buildCollapsableNav(nav, items);
				}else{
					buildBasicNav(nav, items);
				}
			}

			function initSubnavs(items){
				$(items).each(function(i, item){
					if(item.subnav.length != 0){
						item.element
							.data("js", "accordion")
							.addClass(classNames.submenu)
							.children("ul")
							.addClass("set__content")
								.before(genMarkup(item.element.attr("id") + "_subnav").button);
						item.element.set(settings.toggleSettings);

						initSubnavs(item.subnav);
					}
				});
			}

			function isCollapsableNav(nav){
				if($(nav).closest("." + classNames.collapse).length != 0){
					return true;
				}
				return false;
			}

// START: Debuging functions
			function logItems(items){
				$(items).each(function(i, item){
					console.log("text: " + item.text
						+ " | URL: " + item.url
						+ " | Classes: " + item.classes
						+ " | Subnav items: " + item.subnav.length);
					
					if(item.subnav.length != 0){
						logItems(item.subnav);
					}
				});
			}

			function logEvts(nav){
				$(nav).on(events.draw, function(){
					console.log(events.draw);
				});

				$(nav).on(events.init, function(){
					console.log(events.init);
				});
			}
// END: Debuging functions

			return this.each(function(i, nav){
				var items = getNavItems($(nav)),
					mediaQuery = mediaQueries.setMediaQuery(settings.breakpoint);
				
				genIds(nav, items);

				buildCorrectNav(nav, items, mediaQuery);

				$(window).resize($.debounce(250, function(){
					buildCorrectNav(nav, items, mediaQuery);
				}));

				$(nav).trigger($.Event(events.init));
			});
		}

		$("[data-js=railNav]").each(function(i, nav){
			if($(nav).attr("id") == null || $(nav).attr("id") == undefined){
				$(nav).attr("id", "fef_railNav" + i);	
			}
			$(nav).railNav($(this).data());
		});
	})(jq);
});
