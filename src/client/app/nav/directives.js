



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
]);

