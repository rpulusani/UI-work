angular.module('mps')
.directive('addressNewForm', function() {
    return {
        restrict: 'E',
        templateUrl: '/js/service_requests/addresses/address-new-form.html'
    };
})
 
.directive('addressReview', function() {
    return {
        restrict: 'E',
        templateUrl: '/js/service_requests/addresses/review.html'
    };
});