define(['angular'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestContacts', []).config(['$routeProvider', 
        function ($routeProvider) {
            $routeProvider
           .when('/service_requests/contacts', {
                templateUrl: '/app/contact_service_requests/templates/view.html',
                controller: 'ContactListController'
            })
            .when('/service_requests/contacts/:id/delete', {
                templateUrl: '/app/contact_service_requests/templates/review.html',
                controller: 'ContactController',
                activeItem: '/service_requests/contacts',
                resolve: {
                     translationPlaceHolder: function() {
                        return {
                            contactInfo:'CONTACT.INFO',
                            requestContactInfo:'DEVICE_SERVICE_REQUEST.REQUEST_CONTACT_INFORMATION',
                            submit: 'CONTACT_SERVICE_REQUEST.SUBMIT',
                            cancel: 'CONTACT_SERVICE_REQUEST.ABANDON'
                        };
                    }
                }
            })
            .when('/service_requests/contacts/new', {
                templateUrl: '/app/contact_service_requests/templates/new.html',
                controller: 'ContactController',
                activeItem: '/service_requests/contacts'
            })
            .when('/service_requests/contacts/:id/update', {
                templateUrl: '/app/contact_service_requests/templates/update.html',
                controller: 'ContactController',
                activeItem: '/service_requests/contacts',
                resolve: {
                     translationPlaceHolder: function() {
                        return { };
                    }
                }
            });
        }
    ]);
});
