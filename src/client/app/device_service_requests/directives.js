
angular.module('mps.serviceRequestDevices')
.directive('readDevice', function() {
    return {
        restrict: 'A',
        templateUrl: '/app/device_service_requests/templates/read.html'
    };
})
.directive('submitDevice', function() {
    return {
        restrict: 'A',
        templateUrl: '/app/device_service_requests/templates/submitted.html'
    };
})
 .directive('deviceInfoSection', function() {
    return {
        restrict: 'A',
        templateUrl: '/app/device_service_requests/templates/device-info-section.html'
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
})
.directive('deviceUpdateFields', function() {
    return {
        restrict: 'A',
        templateUrl: '/app/device_service_requests/templates/device-update-fields.html',
        controller: ['$scope', 'CountryService', function($scope, CountryService){
        $scope.countryHAL = CountryService.getHAL();
        $scope.countrySelected = function(country) {
          $scope.country = country;
        };

        var loaded = false;
       $scope.$watchGroup(['countryHAL', 'installAddress'], function(vals) {
             var countries = vals[0], installAddress = vals[1];
             if(countries && installAddress && !loaded) {
               countries.$promise.then(function() {
                 $.each(countries.countries, function(_i, c) {
                   if(c.code == installAddress.country) {
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
.directive('deviceSearchFields', function() {
    return {
        restrict: 'A',
        templateUrl: '/app/device_service_requests/templates/device-search-fields.html'
    };
});
