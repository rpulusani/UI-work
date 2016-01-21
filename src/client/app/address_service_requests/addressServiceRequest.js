define(['angular'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestAddresses', []).config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider
            .when('/service_requests/addresses', {
                templateUrl: '/app/address_service_requests/templates/view.html',
                controller: 'AddressListController'
            })
            .when('/service_requests/addresses/new', {
                templateUrl: '/app/address_service_requests/templates/new.html',
                controller: 'AddressAddController',
                activeItem: '/service_requests/addresses'
            })
            .when('/service_requests/addresses/add/review', {
                templateUrl: '/app/service_requests/templates/review.html',
                controller: 'AddressAddController',
                activeItem: '/service_requests/addresses'
            })
            .when('/service_requests/addresses/add/receipt', {
                templateUrl: '/app/service_requests/templates/receipt.html',
                controller: 'AddressAddController',
                activeItem: '/service_requests/addresses'
            })
            .when('/service_requests/addresses/:id/receipt', {
                templateUrl: '/app/service_requests/templates/receipt.html',
                controller: 'AddressController',
                activeItem: '/service_requests/addresses'
            })
            .when('/service_requests/addresses/:id/update', {
                templateUrl: '/app/address_service_requests/templates/update.html',
                controller: 'AddressController',
                activeItem: '/service_requests/addresses'
            });
        }
    ]);
});
