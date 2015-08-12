angular.module('mps.common')
.directive('topNavigation', function() {
    return {
        restrict: 'E',
        templateUrl: '/app/common/templates/top-navigation.html',
        controller: 'NavigationController'
    };
})
.directive('leftNavigation', function() {
    return {
        restrict: 'E',
        templateUrl: '/js/common/templates/left-navigation.html',
        controller: 'NavigationController'
    };
});
