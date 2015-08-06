'use strict';
angular.module('mps.serviceRequestAddresses')
.directive('addressNewFields', function() {
    return {
        restrict: 'E',
        templateUrl: '/js/address_service_requests/templates/address-new-fields.html'
    };
})
.directive('addressReview', function() {
    return {
        restrict: 'E',
        templateUrl: '/js/address_service_requests/templates/review.html'
    };
})
.directive('primaryRequestContact', function() {
    return {
        restrict: 'E',
        templateUrl: '/js/address_service_requests/templates/common/primary-request-contact.html'
    };
})
.directive('additionalRequestInfo', function() {
    return {
        restrict: 'E',
        templateUrl: '/js/address_service_requests/templates/common/additional-request-info.html'
    };
})
.directive('addressUpload', function() {
    return {
        restrict: 'E',
        templateUrl: '/js/address_service_requests/templates/common/address-upload.html'
    };
})
.directive('readAddress', function() {
    return {
        restrict: 'E',
        templateUrl: '/js/address_service_requests/templates/read.html'
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
