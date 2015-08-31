'use strict';
angular.module('mps.utility', [])
.factory('CountryService', ['$resource', 'mpsApiUri', 'halInterceptor',
    function($resource, mpsApiUri, halInterceptor) {
        var url = mpsApiUri + '/countries';
        return $resource(url, {}, {
            'getHAL': { method: 'GET', url: url, interceptor: halInterceptor }
        });
    }
]);
