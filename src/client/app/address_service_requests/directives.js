define(['angular', 'address'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestAddresses')
    .directive('addressNewFields', function() {
        return {
            restrict: 'A',
        templateUrl: '/app/address_service_requests/templates/address-new-fields.html',
        controller: ['$scope', 'CountryService', function($scope, CountryService){
            $scope.countryHAL = CountryService.getHAL();
            $scope.countrySelected = function(country) {
              $scope.country = country;
            };
        }]};
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
});
