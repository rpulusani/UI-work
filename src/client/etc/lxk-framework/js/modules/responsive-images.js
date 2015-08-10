define(['modernizr'], function() {
/*! Picturefill - Responsive Images that work today. (and mimic the proposed Picture element with span elements). Author: Scott Jehl, Filament Group, 2012 | License: MIT/GPLv2 */

(function( w ){

	// Enable strict mode
	"use strict";
	
	w.picturefill = function() {
		var ps = w.document.getElementsByTagName( "span" );

		// Loop the pictures
		for( var i = 0, il = ps.length; i < il; i++ ){
			if( ps[ i ].getAttribute( "data-js" ) !== null && ps[ i ].getAttribute( "data-js" ) == "responsive-img" ){

				var sources = ps[ i ].getElementsByTagName( "span" ),
					matches = [];

				// See if which sources match
				for( var j = 0, jl = sources.length; j < jl; j++ ){
					var media = sources[ j ].getAttribute( "data-mq" );
					
					// if there's no media specified, OR w.matchMedia is supported 
					if( !media || ( Modernizr && Modernizr.mq && Modernizr.mq( _getMediaQuery(media) ) ) ){
						matches.push( sources[ j ] );
					}
				}

				// Find any existing img element in the picture element
				var picImg = ps[ i ].getElementsByTagName( "img" )[ 0 ];

				if( matches.length ){
					var matchedEl = matches.pop();
					if( matchedEl.getAttribute( "data-src" ) === picImg.getAttribute( "src" ) ){
						// Skip further actions if the correct image is already in place
						_showImage(picImg);
						continue;
					}

					picImg.src =  matchedEl.getAttribute( "data-src" );
					if (w.addEventListener) {
						picImg.addEventListener("load", _showImage, false);
					} else if (w.attachEvent) {
						picImg.attachEvent("onload", _showImage);
					}
				} else if ( Modernizr.mq ( 'only all' ) ) {
					_showImage(picImg);	// no media query support, so show image
				}
			}
		}
	};

	// Run on resize and domready (w.load as a fallback)
	if (document.body) {	// we've been loaded, and the DOM is already there. sadface. fire away!
		picturefill();
	}
	if( w.addEventListener ){
		w.addEventListener( "resize", w.picturefill, false );
		w.addEventListener( "DOMContentLoaded", function(){
			w.picturefill();
			// Run once only
			w.removeEventListener( "load", w.picturefill, false );
		}, false );
		w.addEventListener( "load", w.picturefill, false );
	}
	else if( w.attachEvent ){
		w.attachEvent( "onload", w.picturefill );
	}

	function _showImage(img) {
		if (img.target) {
			img = img.target;
		}
		if ( (" "+img.parentNode.className+" ").indexOf(" responsive-img--is-loaded ") == -1 ) {
			img.parentNode.className += " responsive-img--is-loaded";
		}
		img.removeEventListener( "load", _showImage, false );
	}

	function _getMediaQuery(media) {
		if (media == "mobile") {
			return "(max-width: 34em)";
		}
		if (media == "tablet") {
			return "(min-width: 34em) and (max-width: 54em)";
		}
		if (media == "laptop") {
			return "(min-width: 54em) and (max-width: 74em)";
		}
		if (media == "desktop") {
			return "(min-width: 74em)";
		}
		return media;
	}

}( this ));

});
