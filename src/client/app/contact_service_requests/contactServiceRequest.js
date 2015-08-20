'use strict';
angular.module('mps.serviceRequestContacts', []).config(['$routeProvider', function ($routeProvider) {
    $routeProvider
   .when('/service_requests/contacts', {
        templateUrl: '/app/contact_service_requests/templates/view.html',
        controller: 'ContactsController'
    })
    .when('/service_requests/contacts/delete', {
        templateUrl: '/app/contact_service_requests/templates/delete.html',
        controller: 'ContactsController'
    })
    .when('/service_requests/contacts/new', {
        templateUrl: '/app/contact_service_requests/templates/new.html',
        controller: 'ContactsController'
    })
    .when('/service_requests/contacts/review', {
        templateUrl: '/app/contact_service_requests/templates/review.html',
        controller: 'ContactsController'
    })
    .when('/service_requests/contacts/update', {
        templateUrl: '/app/contact_service_requests/templates/update.html',
        controller: 'ContactsController'
    });
}]);
