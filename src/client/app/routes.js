'use strict';
angular.module('mps.routes', [])
.config(['$routeProvider', '$locationProvider', 
function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/device_management', {
            templateUrl: '/app/device_management/templates/device-management-home.html'
        })
        .when('/invoices', {
            templateUrl: '/app/invoices/templates/invoices-home.html'
        })
        .when('/reporting', {
            templateUrl: '/app/reporting/templates/reporting-home.html'
        })
        .when('/page_count/update_page_count', {
            templateUrl: '/js/page_count/templates/update-page-count.html'
        })
        .when('/service_requests', {
            templateUrl: '/app/service_requests/templates/service-request-dashboard.html'
        })
        .when('/service_requests/order_request', {
            templateUrl: '/js/service_requests/templates/create-service-request.html'
        })
        .when('/service_requests/addresses', {
        templateUrl: '/app/address_service_requests/templates/view.html',
            controller: 'AddressesController'
        })
        .when('/service_requests/addresses/delete', {
        templateUrl: '/app/address_service_requests/templates/delete.html',
            controller: 'AddressesController'
        })
        .when('/service_requests/addresses/new', {
        templateUrl: '/app/address_service_requests/templates/new.html',
            controller: 'AddressesController'
        })
        .when('/service_requests/addresses/addMultiple', {
        templateUrl: '/app/address_service_requests/templates/addMultiple.html',
            controller: 'AddressesController'
        })
        .when('/service_requests/addresses/updateMultiple', {
        templateUrl: '/app/address_service_requests/templates/updateMultiple.html',
            controller: 'AddressesController'
        })
        .when('/service_requests/addresses/deleteMultiple', {
        templateUrl: '/app/address_service_requests/templates/deleteMultiple.html',
            controller: 'AddressesController'
        })
        .when('/service_requests/addresses/:id', {
        templateUrl: function(routeParams) {
            if (!routeParams.view || routeParams.view === '') {
                return '/app/address_service_requests/templates/review.html';
            } else if (routeParams.view === 'update') {
                return '/app/address_service_requests/templates/update.html';
            }
        },
            controller: 'AddressesController'
        })
        .when('/service_requests/contacts', {
        templateUrl: '/js/contact_service_requests/templates/view.html',
            controller: 'ContactsController'
        })
        .otherwise({
            templateUrl: '/app/dashboard/templates/home.html'
        });
    
    $locationProvider.html5Mode(true);
}]);
