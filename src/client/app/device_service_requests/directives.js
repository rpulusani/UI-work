define(['angular', 'deviceServiceRequest'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestDevices')
    .directive('readDevice', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/device_service_requests/templates/read.html'
        };
    })
    .directive('deviceNewFields', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/device_service_requests/templates/device-new-fields.html',
            controller: ['$scope', 'CountryService', function($scope, CountryService){
            $scope.countryHAL = CountryService.getHAL();
            $scope.countrySelected = function(country) {
              $scope.country = country;
            };

            var loaded = false;
           $scope.$watchGroup(['countryHAL', 'device'], function(vals) {
                 var countries = vals[0], device = vals[1];
                 if(countries && device && !loaded) {
                   countries.$promise.then(function() {
                     $.each(countries.countries, function(_i, c) {
                       if(c.code == device.country) {
                         $scope.country = c;
                       }
                     });
                     loaded = true;
                   });
                 }
               });
            }]
        };
    });
});
