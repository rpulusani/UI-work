define(['angular'], function(angular) {
    'use strict';
    angular.module('mps.carrier', []).config(['$routeProvider',
    function($routeProvider) {
        $routeProvider
        .when('/carrier', {
            templateUrl: '/app/carrier/templates/view.html',
            controller: 'CarrierListController',
            activeItem: '/carrier'
        })
        .when('/carrier/new', {
            templateUrl: '/app/carrier/templates/new.html',
            controller: 'CarrierAddController',
            activeItem: '/carrier'
        })
        .when('/carrier/review', {
            templateUrl: '/app/carrier/templates/review.html',
            controller: 'CarrierAddController',
            activeItem: '/carrier'
        });
    }]);
});
