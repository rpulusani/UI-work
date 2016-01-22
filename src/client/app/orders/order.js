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
        .when('/orders/learn_more', {
            templateUrl: '/app/orders/templates/learn-more.html',
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
        .when('/orders/device/:id/supplies/new_order/review', {
                templateUrl: '/app/service_requests/templates/review.html',
                controller: 'SupplyOrderListController',
                activeItem: '/orders'
        })
        .when('/orders/create_catalog_supplies', {
            templateUrl: '/app/orders/templates/create-catalog-supplies.html',
            activeItem: '/orders'
        });
    }]);
});
