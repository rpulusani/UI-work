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
        .when('/orders/pick_contact/:source', {
            templateUrl: '/app/orders/templates/contact-picker.html',
            controller: 'ContactPickerController',
            activeItem: '/orders'
        })
        .when('/orders/pick_address_bill_to/:source', {
            templateUrl: '/app/orders/templates/bill-to-picker.html',
            controller: 'AddressBillToPickerController',
            activeItem: '/orders'
        })
        .when('/orders/pick_address_ship_to/:source', {
            templateUrl: '/app/orders/templates/ship-to-picker.html',
            controller: 'AddressShipToPickerController',
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
        .when('/orders/purchase/review', {
                templateUrl: '/app/service_requests/templates/review.html',
                controller: 'OrderPurchaseController',
                activeItem: '/orders'
        })
        .when('/orders/purchase/receipt', {
                templateUrl: '/app/service_requests/templates/receipt.html',
                controller: 'OrderPurchaseController',
                activeItem: '/orders'
        })
        .when('/orders/create_catalog_supplies', {
            templateUrl: '/app/orders/templates/create-catalog-supplies.html',
            activeItem: '/orders'
        });
    }]);
});
