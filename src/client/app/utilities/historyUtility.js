'use strict';
angular.module('mps.utility')
.factory('History', ['$window', function($window) {
    var History = function() {

    };

    History.prototype.back = function() {
        return $window.history.back();
    };

    return new History();
}])

.factory('halInterceptor', function() {
    return {
        response: function(response) {
            angular.copy(response.data._embedded, response.resource);
            return response;
        }
    }
})

.factory('CountryService', ['$resource', 'mpsApiUri', 'halInterceptor',
    function($resource, mpsApiUri, halInterceptor) {
        var url = mpsApiUri + '/countries';
        return $resource(url, {}, {
            'getHAL': { method: 'GET', url: url, interceptor: halInterceptor }
        });
    }
]);
