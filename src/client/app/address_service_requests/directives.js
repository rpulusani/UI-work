define(['angular', 'address'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestAddresses')
    .directive('newAddressFields', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/address_service_requests/templates/address-fields.html'
        };
    });
});
