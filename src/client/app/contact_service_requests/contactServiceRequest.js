define(['angular'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestContacts', []).config(['$routeProvider', 
        function ($routeProvider) {
            $routeProvider
           .when('/service_requests/contacts', {
                templateUrl: '/app/contact_service_requests/templates/view.html',
                controller: 'ContactListController'
            })
            .when('/service_requests/contacts/:id/review', {
                templateUrl: '/app/service_requests/templates/review.html',
                controller: 'ContactController',
                activeItem: '/device_management'
            })
            .when('/service_requests/devices/:id/receipt', {
                templateUrl: '/app/service_requests/templates/receipt.html',
                controller: 'ContactController',
                activeItem: '/service_requests/contacts'
            })
            .when('/service_requests/contacts/new', {
                templateUrl: '/app/contact_service_requests/templates/new.html',
                controller: 'ContactController',
                activeItem: '/service_requests/contacts'
            })
            .when('/service_requests/contacts/:id/update', {
                templateUrl: '/app/contact_service_requests/templates/update.html',
                controller: 'ContactController',
                activeItem: '/service_requests/contacts'
            });
        }
    ]);
});
