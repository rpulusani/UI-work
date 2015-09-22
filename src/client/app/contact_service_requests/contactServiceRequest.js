define(['angular'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestContacts', []).config(['$routeProvider', function ($routeProvider) {
        $routeProvider
       .when('/service_requests/contacts', {
            templateUrl: '/app/contact_service_requests/templates/view.html',
            controller: 'ContactsController'
        })
        .when('/service_requests/contacts/:id/delete', {
            templateUrl: '/app/contact_service_requests/templates/delete.html',
            controller: 'ContactController'
        })
        .when('/service_requests/contacts/new', {
            templateUrl: '/app/contact_service_requests/templates/new.html',
            controller: 'ContactController'
        })
        .when('/service_requests/contacts/:id/update', {
            templateUrl: '/app/contact_service_requests/templates/update.html',
            controller: 'ContactController'
        })
        .when('/service_requests/contacts/:id/review', {
            templateUrl: '/app/contact_service_requests/templates/review.html',
            controller: 'ContactController'
        });
    }]);
});
