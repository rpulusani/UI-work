define(['angular', 'deviceManagement'], function(angular) {
    'use strict';
    angular.module('mps.deviceManagement')
    .factory('Device', 'serviceUrl', ['$resource', 'serviceUrl',
        function($resource, serviceUrl) {
            var url =  serviceUrl + '/accounts/:accountId/devices/:id';
            return $resource(url, {accountId: '@accountId', id: '@id'}, {});
        }
    ]);
});
