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
})
.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel),
            modelSetter = model.assign;

            element.bind('change', function() {
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
