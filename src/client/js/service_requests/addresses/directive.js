angular.module('mps')
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
        templateUrl: '/js/service_requests/common/primary-request-contact.html'
    };
})
.directive('additionalRequestInfo', function() {
    return {
        restrict: 'E',
        templateUrl: '/js/service_requests/common/additional-request-info.html'
    };
})
.directive('addressUpload', function() {
    return {
        restrict: 'E',
        templateUrl: '/js/service_requests/common/address-upload.html'
    };
})
.directive('readAddress', function() {
    return {
        restrict: 'E',
        templateUrl: '/js/service_requests/addresses/read.html'
    };
});
