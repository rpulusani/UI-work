'use strict';
angular.module('mps.serviceRequestContacts')
.factory('ContactService', ['$resource', 'serviceUrl', 'halInterceptor',
    function($resource, serviceUrl, halInterceptor) {
        var url = serviceUrl + '/accounts/:accountId/contacts/:id';
        return $resource(url, {accountId: '@accountId', id: '@id'}, {
            'update': { method: 'PUT' },
            'getHAL': { method: 'GET', interceptor: halInterceptor }
        });
    }
]);
