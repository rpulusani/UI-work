'use strict';
angular.module('mps.carrier')
.directive('carrierFields', function(){
    return {
        restrict: 'A',
        templateUrl : '/app/carrier/templates/carrier-fields.html'
    };
})
.directive('carrierFormButtons', function() {
    return {
        restrict: 'A',
        templateUrl: '/app/carrier/templates/carrier-form-buttons.html'
    };
})
.directive('carrierUpdateButtons', function() {
    return {
        restrict: 'A',
        templateUrl: '/app/carrier/templates/carrier-update-buttons.html'
    };
});
