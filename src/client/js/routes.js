angular.module('mps')
.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/device_management', {
            templateUrl: '/js/device_management/device-management-home.html'
        })
        .when('/invoices', {
            templateUrl: '/js/invoices/invoices-home.html'
        })
        .when('/reporting', {
            templateUrl: '/js/reporting/reporting-home.html'
        })
        .when('/service_requests', {
            templateUrl: '/js/service_requests/service-request-dashboard.html'
        })
        .when('/service_requests/addresses', {
            templateUrl: '/js/service_requests/addresses/view.html',
            controller: 'AddressesController'
        })
        .when('/service_requests/addresses/delete', {
            templateUrl: '/js/service_requests/addresses/delete.html',
            controller: 'AddressesController'
        })
        .when('/service_requests/addresses/new', {
            templateUrl: '/js/service_requests/addresses/new.html',
            controller: 'AddressesController'
        })
        .when('/service_requests/addresses/addMultiple', {
            templateUrl: '/js/service_requests/addresses/addMultiple.html',
            controller: 'AddressesController'
        })
        .when('/service_requests/addresses/updateMultiple', {
            templateUrl: '/js/service_requests/addresses/updateMultiple.html',
            controller: 'AddressesController'
        })
        .when('/service_requests/addresses/deleteMultiple', {
            templateUrl: '/js/service_requests/addresses/deleteMultiple.html',
            controller: 'AddressesController'
        })
        .when('/service_requests/addresses/update', {
            templateUrl: '/js/service_requests/addresses/update.html',
            controller: 'AddressesController'
        })
        .when('/service_requests/addresses/:id', {
            templateUrl: '/js/service_requests/addresses/review.html',
            controller: 'AddressesController'
        })
        .otherwise({
            templateUrl: '/templates/home.html'
        });
    
    $locationProvider.html5Mode(true);
}]);
