'use strict';
angular.module('mps.serviceRequestAddresses')
.factory('Addresses', ['$resource', 'mpsApiUri', 'halInterceptor',
    function($resource, mpsApiUri, halInterceptor) {
        var url = mpsApiUri + '/accounts/:accountId/addresses/:id';

        return $resource(url, {accountId: '@accountId', id: '@id'}, {
            'update': { method: 'PUT' },
            'query': { method: 'GET', interceptor: halInterceptor }
        });
    }
]);
