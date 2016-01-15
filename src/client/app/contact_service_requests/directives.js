define(['angular', 'contact'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestContacts')
    .directive('newContactFields', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/contact_service_requests/templates/contact-fields.html'
        };
    })
});
