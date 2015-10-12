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
            .when('/service_requests/devices/review', {
                templateUrl: '/app/device_service_requests/templates/review.html',
                controller: 'DeviceReviewController'
            });
        }
    ]);
});
