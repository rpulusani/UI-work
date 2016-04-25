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
.directive('addressUpdateFields', function() {
    return {
        restrict: 'A',
        templateUrl: '/app/address_service_requests/templates/address-update-fields.html'
    };
})
.directive('addressBod', function() {
    return {
        restrict: 'E',
        templateUrl: '/app/address_service_requests/templates/address-bod.html'
    };
});
