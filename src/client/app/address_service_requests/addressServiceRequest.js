define(['angular'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestAddresses', []).config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider
            .when('/service_requests/addresses', {
                templateUrl: '/app/address_service_requests/templates/view.html',
                controller: 'AddressListController'
            })
            .when('/service_requests/addresses/:id/delete', {
                templateUrl: '/app/address_service_requests/templates/delete.html',
                controller: 'AddressController'
            })
            .when('/service_requests/addresses/new', {
                templateUrl: '/app/address_service_requests/templates/new.html',
                controller: 'AddressController'
            })
            .when('/service_requests/addresses/:id/review', {
                templateUrl: '/app/address_service_requests/templates/review.html',
                controller: 'AddressController'
            })
                    .when('/service_requests/addresses/:id/submitted', {
                templateUrl: '/app/address_service_requests/templates/submitted.html',
                controller: 'AddressController'
            })
            .when('/service_requests/addresses/:id/update', {
                templateUrl: '/app/address_service_requests/templates/update.html',
                controller: 'AddressController'
            })
            .when('/service_requests/addresses/:id/verify', {
                templateUrl: '/app/address_service_requests/templates/address-bod.html',
                controller: 'AddressController'
            });
        }
    ]);
});
