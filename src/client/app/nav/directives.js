'use strict';

angular.module('mps.nav')
.directive('navItem', ['RecursionHelper',
    function(RecursionHelper) {
        return {
            restrict: 'A',
            templateUrl: '/app/nav/templates/nav-item.html',
            scope: {
                item: '='
            },
            controller: 'NavItemController',
            compile: function(element){
                return RecursionHelper.compile(element);
            }
        };
    }
])
.directive('leftNav', [
    function() {
        return {
            restrict: 'A',
            templateUrl: '/app/nav/templates/left-nav.html',
            controller: 'NavController',
            scope: {}
        };
    }
])
.directive('footerNav', [
    function() {
        return {
            restrict: 'A',
            templateUrl: '/app/nav/templates/footer-nav.html',
            controller: 'NavController',
            scope: {}
        };
    }
]);
