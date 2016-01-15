define([
    'angular'
], function(angular){

    'use strict';

    var nav = angular.module('mps.nav', []).config(['$routeProvider', function ($routeProvider) {
        $routeProvider
        .when('/faq', {
            templateUrl: '/app/nav/templates/faq.html'
        });
    }]);
    
    nav.filter();

    return nav;
});
