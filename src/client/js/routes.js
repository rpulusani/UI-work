'use strict';
angular.module('mps.routes', [])
.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
    $routeProvider
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
