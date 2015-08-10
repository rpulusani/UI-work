define(["jquery", "throttle-debounce", "modernizr"], function(jq) {
	Modernizr.generatedcontent;
	jq.fn.breadcrumb = function() {
		this.each(function(i, el) {
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
