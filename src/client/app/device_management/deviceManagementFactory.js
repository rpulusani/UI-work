define(['angular', 'deviceManagement'], function(angular) {
    'use strict';
    angular.module('mps.deviceManagement')
    .factory('Device', ['$resource',
        function($resource) {
            var url =  '/accounts/:accountId/devices/:id';
            return $resource(url, {accountId: '@accountId', id: '@id'}, {});
        }
    ]);
});
