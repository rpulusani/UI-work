'use strict';
angular.module('mps.serviceRequestAddresses', []).config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider
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
        .when('/service_requests/addresses/:id', {
            templateUrl: function(routeParams) {
                if (routeParams.view === 'update') {
                    return '/app/address_service_requests/templates/update.html';
                } else {
                    return '/app/address_service_requests/templates/review.html';
                }
            },
            controller: 'AddressesController'
        });
    }
]);
