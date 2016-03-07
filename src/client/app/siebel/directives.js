
'use strict';
angular.module('mps.siebel')
.directive('siebelFields', function(){
    return {
        restrict: 'A',
        templateUrl : '/app/siebel/templates/siebel-fields.html'
    };
})
.directive('siebelFormButtons', function() {
    return {
        restrict: 'A',
        templateUrl: '/app/siebel/templates/siebel-form-buttons.html'
    };
})
.directive('siebelUpdateButtons', function() {
    return {
        restrict: 'A',
        templateUrl: '/app/siebel/templates/siebel-update-buttons.html'
    };
});
