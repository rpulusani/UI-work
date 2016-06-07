



 angular.module('mps.nav')
.directive('leftNav', [
    function() {
        return {
            restrict: 'A',
            templateUrl: '/app/nav/templates/left-nav.html',
            controller: 'NavController',
        };
    }
])
.directive('footerNav', [
    function() {
        return {
            restrict: 'A',
            templateUrl: '/app/nav/templates/footer-nav.html',
            controller: 'NavController',
        };
    }
])
.directive('highlightPage',['$location',function(location){
    return {
        restrict: 'A',
        link: function($scope, element, $attrs) {
            var elementPath = $attrs.href;
            $scope.$location = location;
            $scope.$watch('$location.path()', function(locationPath) {
                if(locationPath !== elementPath)
                    $(element).blur();
                else
                    $(element).focus();   
            });
        }
    };
}]);

