angular.module('mps.common')
.directive('topNavigation', function() {
    return {
        restrict: 'E',
        templateUrl: '/app/common/templates/top-navigation.html',
        controller: 'TopNavigationController'
    };
});
