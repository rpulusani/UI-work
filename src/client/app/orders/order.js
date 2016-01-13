define(['angular'], function(angular) {
    'use strict';
    angular.module('mps.orders', ['mps.utility']).config(['$routeProvider',
    function($routeProvider) {
        $routeProvider
        .when('/orders', {
            templateUrl: '/app/orders/templates/order-dashboard.html',
            controller: 'OrderTabController',
            activeItem: '/orders'
        });
    }]);
});