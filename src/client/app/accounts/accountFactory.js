'use strict';
angular.module('mps.account')
.factory('AccountService', ['$resource', 'serviceUrl', 'halInterceptor',
    function($resource, serviceUrl, halInterceptor) {
        var url = serviceUrl + '/accounts/:accountId';
        return $resource(url, {accountId: '@accountId'}, {
        	
        });
    }
]);
