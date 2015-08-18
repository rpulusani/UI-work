'use strict';
angular.module('mps.navigation').factory('Navigation', ['$http', function($http) {
    var Nav = function() {
        var nav = this;
        nav.data = [];
        nav.makingCall = false;
    };

    Nav.prototype.query = function(fn) {
        var nav = this;

        if (!nav.makingCall) {
            nav.makingCall = true;
            $http.get('app/navigation/data/navigation-details.json').success (function(data) {
                nav.data = data;
                nav.makingCall = false;
                
                if (typeof fn === 'function') {
                    return fn(data);
                }
            });
        }
    };

    return new Nav();
}]);
