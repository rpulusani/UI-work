angular.module('mps')
.directive('topNavigation', function() {
    return {
        restrict: 'E',
        templateUrl: '/js/common/top-navigation.html',
        controller: 'TopNavigationController'
    };
});
