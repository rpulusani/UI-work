'use strict';

angular.module('mps.nav')
.factory('Nav', ['$http',
    function($http) {
        var Nav = function() {
            var nav = this;
            nav.data = [];
        };

        Nav.prototype.query = function(fn) {
            var nav = this;

            $http.get('app/nav/data/navigation.json').success(function(data) {
                nav.data = data;
                nav.makingCall = false;
                
                if (typeof fn === 'function') {
                    return fn(data);
                }
            });
        };

        return new Nav();
    }
])
.factory('RecursionHelper', ['$compile', function($compile){
    return {
        /**
         * Manually compiles the element, fixing the recursion loop.
         * @param element
         * @param [link] A post-link function, or an object with function(s) registered via pre and post properties.
         * @returns An object containing the linking functions.
         */
        compile: function(element, link){
            // Normalize the link parameter
            if(angular.isFunction(link)){
                link = { post: link };
            }

            // Break the recursion loop by removing the contents
            var contents = element.contents().remove();
            var compiledContents;
            return {
                pre: (link && link.pre) ? link.pre : null,
                /**
                 * Compiles and re-adds the contents
                 */
                post: function(scope, element){
                    // Compile the contents
                    if(!compiledContents){
                        compiledContents = $compile(contents);
                    }
                    // Re-add the compiled contents to the element
                    compiledContents(scope, function(clone){
                        element.append(clone);
                    });

                    // Call the post-linking function, if any
                    if(link && link.post){
                        link.post.apply(null, arguments);
                    }
                }
            };
        }
    };
}]);
