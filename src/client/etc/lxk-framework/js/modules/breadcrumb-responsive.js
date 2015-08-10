require(["jquery", "throttle-debounce", "modernizr"], function(jq) {
Modernizr.generatedcontent;
	jq.fn.breadcrumb = function() {
		this.each(function(i, el) {
			if (jq(el).parent('.breadcrumb__wrapper__inner').length > 0) {
				return; // we already have a wrapper, so we'll assume we're initialized
			}
			jq(el).wrap('<div class="breadcrumb__wrapper" />').wrap('<div class="breadcrumb__wrapper__inner" />').before('<span class="breadcrumb__previous icon icon--ui icon--left-arrow-primary"></span>').after('<span class="breadcrumb__next breadcrumb__next--is-disabled icon icon--ui icon--right-arrow-secondary"></span>');
			jq(el).children('li:last()').addClass('breadcrumb--is-active breadcrumb--animate').prev().addClass('breadcrumb--is-previous');

			jq(el).siblings('.breadcrumb__next').addClass('breadcrumb__next--is-disabled').click( jq.throttle( 500, function(evt) {
				var current = jq(evt.target).siblings('ul.breadcrumb').children('.breadcrumb--is-active');
				if (current.next().length) {
					current.removeClass('breadcrumb--is-active').addClass('breadcrumb--is-previous').next().removeClass('breadcrumb--is-next').addClass('breadcrumb--animate breadcrumb--is-active');
					jq(evt.target).siblings('.breadcrumb__previous').removeClass('breadcrumb__previous--is-disabled icon--left-arrow-secondary').addClass('icon--left-arrow-primary');
				}
				if (current.nextAll().length == 1) {
					jq(evt.target).removeClass('icon--right-arrow-primary').addClass('breadcrumb__next--is-disabled icon--right-arrow-secondary');
				}
			} ));

			jq(el).siblings('.breadcrumb__previous').click( jq.throttle( 500, function(evt) {
				var current = jq(evt.target).siblings('ul.breadcrumb').children('.breadcrumb--is-active');
				if (current.prev().length) {
					current.removeClass('breadcrumb--is-active').addClass('breadcrumb--is-next').prev().removeClass('breadcrumb--is-previous').addClass('breadcrumb--animate breadcrumb--is-active');
					jq(evt.target).siblings('.breadcrumb__next').removeClass('breadcrumb__next--is-disabled icon--right-arrow-secondary').addClass('icon--right-arrow-primary');
				}
				if (current.prevAll().length == 1) {
					jq(evt.target).removeClass('icon--left-arrow-primary').addClass('breadcrumb__previous--is-disabled icon--left-arrow-secondary');
				}
			} ));

			// IE7
			if (Modernizr.generatedcontent === false) {
				addSeparators(el);
			}

			// IE 8
			if (Modernizr.lastchild === false) {
				jq('html').addClass('no-lastchild');	// Modernizr does this anyways, but let's doublecheck, as we remove :after when this is present.
				addSeparators(el);
			}

			function addSeparators(el) {
				jq(el).children('li').each(function(index, li) {
					if (index < (jq(el).children('li').length-1) &&
						 jq(li).children('.breadcrumb__separator').length == 0) 
					{
						jq(li).append('<span class="breadcrumb__separator"> ></span>');
					}
				});
			}

		}); // end .each()

		return this;
	};
	
	jq("[data-js='breadcrumb']").breadcrumb();
});
