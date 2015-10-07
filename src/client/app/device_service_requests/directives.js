define(['angular', 'deviceServiceRequest'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestAddresses')
    .directive('customRadios', function(){
      return {
        restrict: 'A',
        replace: true,
        template: function (el, attr) {
          console.log('hello');
          console.log(el[0]["type"]);
          console.log('value is '+attr.ngValue);
          //var more_class = tAttrs.class ? ' '+tAttrs.class : '';
          // return '<label ng-transclude><input type="radio" ng-model="' + tAttrs.model
          //       + '" value="' + tAttrs.value + '"><div class="custom-radio'+ more_class +'"></div>'
          return '<input type="radio" name="' + attr.name + '" id="' + attr.id + '" ng-model="' + attr.ngModel + '" ng-value="' + attr.ngValue + '">';
          //return abcd;
          }
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
