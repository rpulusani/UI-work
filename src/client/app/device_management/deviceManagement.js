define(['angular'], function(angular) {
    'use strict';
    angular.module('mps.deviceManagement', []).config(['$routeProvider', function ($routeProvider) {
        $routeProvider
        .when('/device_management', {
            templateUrl: '/app/device_management/templates/view.html',
            controller: 'DeviceListController'
        })
        .when('/device_management/:id/review', {
            templateUrl: '/app/device_management/templates/review.html',
            controller: 'DeviceInformationController',
            activeItem: '/device_management'
        })
        .when('/device_management/:id/page_count', {
            templateUrl: '/app/device_management/templates/device-page-count.html',
            controller: 'DevicePageCountsController'
        })
        .when('/device_management/pick_address/:source', {
            templateUrl: '/app/device_service_requests/templates/address-picker.html',
            controller: 'AddressPickerController',
            activeItem: '/device_management'
        })
        .when('/device_management/pick_contact/:source', {
            templateUrl: '/app/device_service_requests/templates/contact-picker.html',
            controller: 'ContactPickerController',
            activeItem: '/device_management'
        })
        .when('/device_management/pick_device/:source', {
            templateUrl: '/app/device_service_requests/templates/device-picker.html',
            controller: 'DevicePickerController',
            activeItem: '/device_management'
        });
    }]);
});
