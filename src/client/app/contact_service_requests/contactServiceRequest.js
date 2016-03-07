'use strict';
angular.module('mps.serviceRequestContacts', []).config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider
       .when('/service_requests/contacts', {
            templateUrl: '/app/contact_service_requests/templates/view.html',
            controller: 'ContactListController'
        })
        .when('/service_requests/contacts/update/:id/review', {
            templateUrl: '/app/service_requests/templates/review.html',
            controller: 'ContactController',
            activeItem: '/service_requests/contacts'
        })
        .when('/service_requests/contacts/update/:id/receipt', {
            templateUrl: '/app/service_requests/templates/receipt.html',
            controller: 'ContactController',
            activeItem: '/service_requests/contacts'
        })
        .when('/service_requests/contacts/new', {
            templateUrl: '/app/contact_service_requests/templates/new.html',
            controller: 'ContactAddController',
            activeItem: '/service_requests/contacts'
        })
        .when('/service_requests/contacts/:id/update', {
            templateUrl: '/app/contact_service_requests/templates/update.html',
            controller: 'ContactUpdateController',
            activeItem: '/service_requests/contacts'
        })
        .when('/service_requests/contacts/pick_contact/:source', {
            templateUrl: '/app/address_service_requests/templates/contact-picker.html',
            controller: 'ContactPickerController',
            activeItem: '/service_requests/contacts'
        })
        .when('/service_requests/contacts/delete/:id/review', {
            templateUrl: '/app/service_requests/templates/review.html',
            controller: 'ContactDeleteController',
            activeItem: '/service_requests/contacts'
        })
        .when('/service_requests/contacts/pick_account/:source', {
            templateUrl: '/app/utilities/templates/pick-account.html',
            controller: 'AccountPickerController',
            activeItem: '/service_requests/contacts'
        })
        .when('/service_requests/contacts/delete/:id/receipt/:queued', {
            templateUrl: '/app/service_requests/templates/receipt.html',
            controller: 'ContactDeleteController',
            activeItem: '/service_requests/contacts'
        });
    }
]);
