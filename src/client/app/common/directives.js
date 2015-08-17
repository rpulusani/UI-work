angular.module('mps.common')
.directive('topNavigation', function() {
    return {
        restrict: 'A',
        templateUrl: '/app/common/templates/top-navigation.html',
        controller: 'NavigationController'
    };
})
.directive('leftNavigation', function() {
    return {
        restrict: 'A',
        templateUrl: '/app/common/templates/left-navigation.html',
        controller: 'NavigationController'
    };
});
