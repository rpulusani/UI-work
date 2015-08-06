'use strict';
angular.module('mps.serviceRequestAddresses')
.directive('addressNewFields', function() {
    return {
        restrict: 'E',
        templateUrl: '/js/address_service_request/templates/address-new-fields.html'
    };
})
.directive('addressReview', function() {
    return {
        restrict: 'E',
        templateUrl: '/js/address_service_request/templates/review.html'
    };
})
.directive('primaryRequestContact', function() {
    return {
        restrict: 'E',
        templateUrl: '/js/address_service_request/templates/common/primary-request-contact.html'
    };
})
.directive('additionalRequestInfo', function() {
    return {
        restrict: 'E',
        templateUrl: '/js/address_service_request/templates/common/additional-request-info.html'
    };
})
.directive('addressUpload', function() {
    return {
        restrict: 'E',
        templateUrl: '/js/address_service_request/templates/common/address-upload.html'
    };
})
.directive('readAddress', function() {
    return {
        restrict: 'E',
        templateUrl: '/js/address_service_request/templates/read.html'
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
