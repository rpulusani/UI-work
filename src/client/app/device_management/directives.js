define(['angular', 'deviceManagement'], function(angular) {
    'use strict';
    angular.module('mps.deviceManagement')
    .directive('deviceInformation', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/device_management/templates/device-information.html',
            controller: 'DeviceManagementController' 
        };
    });
});
