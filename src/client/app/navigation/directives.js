'use strict';
angular.module('mps.navigation')
.directive('topNavigation', function() {
    return {
        restrict: 'E',
        templateUrl: '/app/navigation/templates/top-navigation.html',
        controller: 'TopNavController'
    };
})
.directive('leftNavigation', function() {
    return {
        restrict: 'E',
        templateUrl: '/app/navigation/templates/left-navigation.html',
        controller: 'LeftNavController'
    };
});
