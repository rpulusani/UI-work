define([
    'nav',
    'nav.navController'
], function(nav){

    'use strict';

    nav
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
});
