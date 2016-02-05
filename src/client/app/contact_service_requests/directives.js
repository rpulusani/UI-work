define(['angular', 'contact'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestContacts')
    .directive('newContactFields', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/contact_service_requests/templates/contact-fields.html',
            controller: ['$scope', 'CountryService', function($scope, CountryService) {
                var loaded = false;

                $scope.countryHAL = CountryService.getHAL();
               
                $scope.countrySelected = function(country) {
                  $scope.country = country;
                };

                $scope.$watchGroup(['countryHAL', 'device'], function(vals) {
                    var countries = vals[0],
                    device = vals[1];
                    
                    if (countries && device && !loaded) {
                        countries.$promise.then(function() {
                            $.each(countries.countries, function(_i, c) {
                                if (c.code == device.country) {
                                    $scope.country = c;
                                }
                            });
                        
                            loaded = true;
                        });
                    }
               });
            }]
        };
    })
    .directive('addressBod', function() {
        return {
            restrict: 'E',
            templateUrl: '/app/address_service_requests/templates/address-bod.html'
        };
    });
});
