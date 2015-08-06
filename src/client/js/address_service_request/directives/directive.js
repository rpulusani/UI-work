angular.module('mps.serviceRequestAddresses')
.directive('addressNewFields', function() {
    return {
        restrict: 'E',
        templateUrl: '/js/service_requests/addresses/address-new-fields.html'
    };
})
 .directive('addressReview', function() {
    return {
        restrict: 'E',
        templateUrl: '/js/service_requests/addresses/review.html'
    };
})
.directive('primaryRequestContact', function() {
    return {
        restrict: 'E',
        templateUrl: '/js/service_requests/templates/primary-request-contact.html'
    };
})
.directive('additionalRequestInfo', function() {
    return {
        restrict: 'E',
        templateUrl: '/js/service_requests/templates/additional-request-info.html'
    };
})
.directive('addressUpload', function() {
    return {
        restrict: 'E',
        templateUrl: '/js/service_requests/templates/address-upload.html'
    };
})
.directive('readAddress', function() {
    return {
        restrict: 'E',
        templateUrl: '/js/service_requests/addresses/read.html'
    };
})
.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel),
            modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
