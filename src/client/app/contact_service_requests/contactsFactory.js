'use strict';
angular.module('mps.serviceRequestContacts')
.factory('ContactService', ['$resource', 'mpsApiUri', 'halInterceptor',
    function($resource, mpsApiUri, halInterceptor) {
        var url = mpsApiUri + '/accounts/:accountId/contacts/:id';
        return $resource(url, {accountId: '@accountId', id: '@id'}, {
            'update': { method: 'PUT' },
            'getHAL': { method: 'GET', interceptor: halInterceptor }
        });
    }
]);
