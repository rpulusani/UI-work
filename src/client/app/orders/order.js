define(['angular'], function(angular) {
    'use strict';
    angular.module('mps.orders', ['mps.utility']).config(['$routeProvider',
    function($routeProvider) {
        $routeProvider
        .when('/orders', {
            templateUrl: '/app/orders/templates/order-dashboard.html',
            controller: 'OrderTabController',
            activeItem: '/orders'
        })
        .when('/orders/create_asset_supplies', {
            templateUrl: '/app/orders/templates/create-asset-supplies.html',
            activeItem: '/orders'
        })
        .when('/orders/create_hardware', {
            templateUrl: '/app/orders/templates/create-hardware.html',
            activeItem: '/orders'
        })
        .when('/orders/create_catalog_supplies', {
            templateUrl: '/app/orders/templates/create-catalog-supplies.html',
            activeItem: '/orders'
        });
    }]);
});