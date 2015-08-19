'use strict';
angular.module('mps.serviceRequestContacts')
.directive('newContactFields', function() {
    return {
        restrict: 'E',
        templateUrl: '/app/contact_service_requests/templates/contact-fields.html'
    };
})
.directive('readContact', function() {
    return {
        restrict: 'E',
        templateUrl: '/app/contact_service_requests/templates/read.html'
    };
});
