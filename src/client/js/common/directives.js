angular.module('mps.common')
.directive('topNavigation', function() {
    return {
        restrict: 'E',
        templateUrl: '/js/common/templates/top-navigation.html',
        controller: 'TopNavigationController'
    };
});
