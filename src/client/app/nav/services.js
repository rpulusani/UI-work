define([
    'nav'
], function(nav){

    'use strict';

    nav
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
    ]);
});
