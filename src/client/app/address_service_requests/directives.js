
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

        var loaded = false;
       $scope.$watchGroup(['countryHAL', 'address'], function(vals) {
             var countries = vals[0], address = vals[1];
             if(countries && address && !loaded) {
               countries.$promise.then(function() {
                 $.each(countries.countries, function(_i, c) {
                   if(c.code == address.country) {
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
.directive('addressUpdateFields', function() {
    return {
        restrict: 'A',
        templateUrl: '/app/address_service_requests/templates/address-update-fields.html',
        controller: ['$scope', 'CountryService', function($scope, CountryService) {
            CountryService.getCountries().then(function(countries) {
                $scope.countries = countries;

                $scope.countrySelected = function(countryCode) {
                    if (!countryCode) {
                        countryCode = $scope.address.countryIsoCode
                    }

                    CountryService.getCountryByCode(countryCode).then(function(country) {
                        $scope.country = country;
                        $scope.code = $scope.address.state;
                    });
                };

                if ($scope.address) {
                    $scope.countrySelected()
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
