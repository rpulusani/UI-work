define(['angular'], function(angular) {
    'use strict';
    angular.module('mps.deviceManagement', []).config(['$routeProvider', function ($routeProvider) {
        $routeProvider
        .when('/device_management', {
            templateUrl: '/app/device_management/templates/device-management-home.html',
            controller: 'DeviceManagementController'
        })
        .when('/device_management/:id/review', {
            templateUrl: '/app/device_management/templates/review.html',
            controller: 'DeviceInformationController'
        })
        .when('/device_management/:id/page_count', {
            templateUrl: '/app/device_management/templates/device-page-count.html',
            controller: 'DevicePageCountsController'
        })
    }]);
});
