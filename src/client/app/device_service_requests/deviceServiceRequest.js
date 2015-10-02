define(['angular'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestDevices', []).config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider
            .when('/service_requests/devices/new', {
                templateUrl: '/app/device_service_requests/templates/new.html',
                controller: 'DeviceAddController'
            });
        }
    ]);
});
