'use strict';
angular.module('mps.serviceRequests')
.directive('primaryRequestContact', function() {
    return {
        restrict: 'E',
        templateUrl: '/js/service_requests/templates/primary-request-contact.html'
    };
})
.directive('additionalRequestInfo', function() {
    return {
        restrict: 'E',
        templateUrl: '/js/service_requests/templates/additional-request-info.html'
    };
})
.directive('addressUpload', function() {
    return {
        restrict: 'E',
        templateUrl: '/js/service_requests/templates/address-upload.html'
    };
});
