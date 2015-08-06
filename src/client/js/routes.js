'use strict';
angular.module('mps.routes', [])
.config(['$routeProvider', '$locationProvider', 
function($routeProvider, $locationProvider) {
    $routeProvider
    // Routes for address_service_request
    .when('/service_requests/addresses', {
        templateUrl: '/js/address_service_requests/templates/view.html',
        controller: 'AddressesController'
    })
    .when('/service_requests/addresses/delete', {
        templateUrl: '/js/address_service_requests/templates/delete.html',
        controller: 'AddressesController'
    })
    .when('/service_requests/addresses/new', {
        templateUrl: '/js/address_service_requests/templates/new.html',
        controller: 'AddressesController'
    })
    .when('/service_requests/addresses/addMultiple', {
        templateUrl: '/js/address_service_requests/templates/addMultiple.html',
        controller: 'AddressesController'
    })
    .when('/service_requests/addresses/updateMultiple', {
        templateUrl: '/js/address_service_requests/templates/updateMultiple.html',
        controller: 'AddressesController'
    })
    .when('/service_requests/addresses/deleteMultiple', {
        templateUrl: '/js/address_service_requests/templates/deleteMultiple.html',
        controller: 'AddressesController'
    })
    .when('/service_requests/addresses/update', {
        templateUrl: '/js/address_service_requests/templates/update.html',
        controller: 'AddressesController'
    })
    .when('/service_requests/addresses/:id', {
        templateUrl: '/js/address_service_requests/templates/review.html',
        controller: 'AddressesController'
    })
    .otherwise({
        templateUrl: '/templates/home.html'
    });
    
    $locationProvider.html5Mode(true);
}]);
