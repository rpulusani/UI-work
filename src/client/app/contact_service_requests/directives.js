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
    .directive('contactUpdateAddressFields', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/contact_service_requests/templates/contact-update-address-fields.html',
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
    .directive('contactUpdateInfoFields', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/contact_service_requests/templates/contact-update-info-fields.html',
            controller: 'ContactUpdateController'
        };
    })
    .directive('contactUpdateAddressForm', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/contact_service_requests/templates/contact-update-address-form.html',
            controller: 'ContactUpdateAddressController'
        };
    })
    .directive('cancelUpdate', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/contact_service_requests/templates/cancel-update.html',
            controller: 'ContactController'
        };
    })
    .directive('contactUpdateTabs', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/contact_service_requests/templates/contact-update-tabs.html',
            controller: 'ContactUpdateTabController',
            link: function(scope, el, attr){
                require(['lxk.fef'], function() {
                    var $ = require('jquery'),
                        sets = $(el).find("[data-js=tab], [data-js=set], [data-js=accordion]");
                        sets.each(function(i,set){
                            $(set).set({});
                        });
                });
            }
        };
    });
});
