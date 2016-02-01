define([
    'angular'
], function(angular){

    'use strict';

    var nav = angular.module('mps.nav', []).config(['$routeProvider', function ($routeProvider) {
        $routeProvider
        .when('/faq', {
            templateUrl: '/app/nav/templates/faq.html'
        })
        .when('/help', {
            templateUrl: '/app/nav/templates/help.html'
        });
    }]);
    
    nav.filter();

    return nav;
});
