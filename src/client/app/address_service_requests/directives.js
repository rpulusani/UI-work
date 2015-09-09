'use strict';
angular.module('mps.serviceRequestAddresses')
.directive('addressNewFields', function() {
    return {
        restrict: 'A',
        templateUrl: '/app/address_service_requests/templates/address-new-fields.html'
    };
})
.directive('addressLocationFields', function() {
    return {
        restrict: 'A',
        templateUrl: '/app/address_service_requests/templates/address-location-fields.html'
    };
})
.directive('addressReview', function() {
    return {
        restrict: 'A',
        templateUrl: '/app/address_service_requests/templates/review.html'
    };
})
.directive('readAddress', function() {
    return {
        restrict: 'A',
        templateUrl: '/app/address_service_requests/templates/read.html'
    };
});
