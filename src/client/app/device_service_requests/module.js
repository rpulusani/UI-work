
angular.module('mps.serviceRequestDevices', []).config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider
        .when('/service_requests/devices/new', {
            templateUrl: '/app/device_service_requests/templates/new.html',
            controller: 'DeviceAddController',
            activeItem: '/device_management'
        })
        .when('/service_requests/devices/add/review', {
            templateUrl: '/app/service_requests/templates/review.html',
            controller: 'DeviceAddController',
            activeItem: '/device_management'
        })
        .when('/service_requests/devices/add/receipt/:queued', {
            templateUrl: '/app/service_requests/templates/receipt.html',
            controller: 'DeviceAddController',
            activeItem: '/device_management'
        })
        .when('/service_requests/devices/new/:return', {
            templateUrl: '/app/device_service_requests/templates/new.html',
            controller: 'DeviceAddController',
            activeItem: '/device_management'
        })
        .when('/service_requests/devices/update/pick_contact', {
            templateUrl: '/app/device_service_requests/templates/contact-picker.html',
            controller: 'DeviceUpdateController',
            activeItem: '/device_management'
        })
        .when('/service_requests/devices/search', {
            templateUrl: '/app/device_service_requests/templates/search.html',
            controller: 'DeviceSearchController',
            activeItem: '/device_management'
        })
        .when('/service_requests/devices/picker', {
            templateUrl: '/app/device_service_requests/templates/device-picker.html',
            controller: 'DeviceServiceRequestDeviceController',
            activeItem: '/device_management',
            reloadOnSearch: false
        })
        .when('/service_requests/devices/:id/view', {
            templateUrl: '/app/device_service_requests/templates/view-breakfix.html',
            controller: 'DeviceServiceRequestDeviceController',
            activeItem: '/device_management'
        })
        .when('/service_requests/devices/breakfix', {
            templateUrl: '/app/device_service_requests/templates/view-breakfix.html',
            controller: 'DeviceServiceRequestDeviceController',
            activeItem: '/device_management'
        })
        .when('/service_requests/devices/:id/review', {
            templateUrl: '/app/service_requests/templates/review.html',
            controller: 'DeviceServiceRequestDeviceController',
            activeItem: '/device_management'
        })
      .when('/service_requests/devices/:id/receipt/:queued', {
            templateUrl: '/app/service_requests/templates/receipt.html',
            controller: 'DeviceServiceRequestDeviceController',
            activeItem: '/device_management'
        })
        .when('/service_requests/devices/:id/update', {
            templateUrl: '/app/device_service_requests/templates/update.html',
            controller: 'DeviceUpdateController',
            activeItem: '/device_management'
        })
        .when('/service_requests/devices/update/:id/review', {
            templateUrl: '/app/service_requests/templates/review.html',
            controller: 'DeviceUpdateController',
            activeItem: '/device_management'
        })
        .when('/service_requests/devices/update/:id/receipt/:queued', {
            templateUrl: '/app/service_requests/templates/receipt.html',
            controller: 'DeviceUpdateController',
            activeItem: '/device_management'
        })
        .when('/service_requests/devices/decommission/:id/view', {
            templateUrl: '/app/device_service_requests/templates/view-decommission.html',
            controller: 'DeviceDecommissionController',
            activeItem: '/device_management'
        })
        .when('/service_requests/devices/decommission/:id/review', {
            templateUrl: '/app/service_requests/templates/review.html',
            controller: 'DeviceDecommissionController',
            activeItem: '/device_management'
        })
        .when('/service_requests/devices/decommission/:id/receipt/:queued', {
            templateUrl: '/app/service_requests/templates/receipt.html',
            controller: 'DeviceDecommissionController',
            activeItem: '/device_management'
        })
        .when('/service_requests/devices/review', {
            templateUrl: '/app/device_service_requests/templates/review.html',
            controller: 'DeviceReviewController',
            activeItem: '/device_management'
        });
    }
]);
