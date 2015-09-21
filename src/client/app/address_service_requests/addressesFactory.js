define(['angular', 'address'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestAddresses')
    .factory('Addresses', ['$resource', 'serviceUrl', 'halInterceptor',
        function($resource, serviceUrl, halInterceptor) {
            var url = serviceUrl + '/accounts/:accountId/addresses/:id';

        return $resource(url, {accountId: '@accountId', id: '@id'}, {
            'update': { method: 'PUT' },
            'query': { method: 'GET', interceptor: halInterceptor },
            'verify': {url: serviceUrl + '/mps/verification', method: 'GET'}
        });
    }]);
});
