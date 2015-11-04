define(['angular'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestDevices', []).config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider
            .when('/service_requests/devices/new', {
                templateUrl: '/app/device_service_requests/templates/new.html',
                controller: 'DeviceAddController'
            })
            .when('/service_requests/devices/new/:return', {
                templateUrl: '/app/device_service_requests/templates/new.html',
                controller: 'DeviceAddController'
            })
            .when('/service_requests/devices/pick_contact', {
                templateUrl: '/app/device_service_requests/templates/contact-picker.html',
                controller: 'ContactPickerController'
            })
            .when('/service_requests/devices/search', {
                templateUrl: '/app/device_service_requests/templates/search.html',
                controller: 'DeviceSearchController'
            })
            .when('/service_requests/devices/:id/view', {
                templateUrl: '/app/device_service_requests/templates/view-request.html',
                controller: 'DeviceServiceRequestDeviceController'
            })
            .when('/service_requests/devices/:id/review', {
                templateUrl: '/app/device_service_requests/templates/review-request.html',
                controller: 'DeviceServiceRequestDeviceController'
            })
            .when('/service_requests/devices/:id/update', {
                templateUrl: '/app/device_service_requests/templates/update.html',
                controller: 'DeviceUpdateController'
            })
            .when('/service_requests/devices/decomission/:id/view', {
                templateUrl: '/app/device_service_requests/templates/view-decomission.html',
                controller: 'DeviceDecomissionController'
            })
            .when('/service_requests/devices/decommission/:id/view', {
                templateUrl: '/app/device_service_requests/templates/view-decommission.html',
                controller: 'DeviceDecommissionController'
            })
            .when('/service_requests/devices/decommission/:id/review', {
                templateUrl: '/app/service_requests/templates/review.html',
                controller: 'DeviceDecommissionController'
            })
            .when('/service_requests/devices/decommission/:id/review/:return', {
                templateUrl: '/app/service_requests/templates/review.html',
                controller: 'DeviceDecommissionController'
            })
            .when('/service_requests/devices/decommission/:id/receipt', {
                templateUrl: '/app/service_requests/templates/receipt.html',
                controller: 'DeviceDecommissionController'
            })
            .when('/service_requests/devices/update/:updateid/review', {
                templateUrl: '/app/service_requests/templates/review.html',
                controller: 'DeviceUpdateController'
            })
            .when('/service_requests/devices/review', {
                templateUrl: '/app/device_service_requests/templates/review.html',
                controller: 'DeviceReviewController'
            })
            .when('/service_requests/devices/decommission/pick_contact', {
                templateUrl: '/app/device_service_requests/templates/contact-picker.html',
                controller: 'DeviceDecommissionController'
            });
        }
    ]);
});
