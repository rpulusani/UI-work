'use strict';
angular.module('mps.account')
.factory('RoleService', ['$resource', 'serviceUrl', 'halInterceptor',
    function($resource, serviceUrl, halInterceptor) {
        var url = serviceUrl + '/roles/CustomerPortal/:roleId';
        return $resource(url, {roleId: '@roleId'}, {
            
        });
    }
]);
