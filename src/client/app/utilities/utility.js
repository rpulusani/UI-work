define(['angular'], function(angular) {
    'use strict';
    angular.module('mps.utility', [])
    .factory('CountryService', ['$resource', 'serviceUrl', 'halInterceptor',
        function($resource, serviceUrl, halInterceptor) {
            var url = serviceUrl + '/countries';
            return $resource(url, {}, {
                'getHAL': { method: 'GET', url: url, interceptor: halInterceptor }
            });
        }
    ]);
});
