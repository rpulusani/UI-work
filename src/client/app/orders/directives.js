define(['angular', 'order'], function(angular) {
    'use strict';
    angular.module('mps.orders')
    .directive('allOrderTab', function(){
        return {
            restrict: 'A',
            templateUrl : '/app/orders/templates/tabs/all-order-tab.html',
            controller: 'OrderListController'
        };
    })
    .directive('deviceOrderTab', function(){
        return {
            restrict: 'A',
            templateUrl : '/app/orders/templates/tabs/device-order-tab.html',
            controller: 'DeviceOrderListController'
        };
    })
    .directive('openOrderSummary', function(){
        return {
            restrict: 'A',
            templateUrl : '/app/orders/templates/open-order-summary.html'
        };
    })
    .directive('returnOrderAddress', function(){
        return {
            restrict: 'A',
            templateUrl : '/app/orders/templates/return-order-address.html'
        };
    })
    .directive('orderReturnDetails', function(){
        return {
            restrict: 'A',
            templateUrl : '/app/orders/templates/order-return-details.html'
        };
    })
    .directive('orderReceipt', function(){
        return {
            restrict: 'A',
            templateUrl : '/app/orders/templates/ship-to-bill-to-receipt.html'
        };
    })
    .directive('supplyOrderTab', function(){
        return {
            restrict: 'A',
            templateUrl : '/app/orders/templates/tabs/supply-order-tab.html',
            controller: 'SupplyOrderListController'
        };
    })
    .directive('catalog', function(){
        return {
            restrict: 'A',
            templateUrl : '/app/orders/templates/catalog.html'
        };
    })
    .directive('returnSupply', function(){
        return {
            restrict: 'A',
            templateUrl : '/app/orders/templates/return-supply.html'
        };
    })
    .directive('orderShipToBillToDetails', function(){
        return{
            restrict: 'A',
            templateUrl: '/app/orders/templates/ship-to-bill-to.html'
        };
    })
    .directive('orderAccountDetails', function(){
        return{
            restrict: 'A',
            templateUrl: '/app/orders/templates/account-details.html'
        };
    })
    .directive('orderPoNumber', function(){
        return{
            restrict: 'A',
            templateUrl: '/app/orders/templates/po-number.html'
        };
    })
    .directive('orderAccountDetials', function(){
        return{
            restrict: 'A',
            templateUrl: '/app/orders/templates/order-account-details.html'
        };
    })
    .directive('orderContent', function(){
        return {
            restrict: 'A',
            templateUrl: '/app/orders/templates/order-contents.html',
            scope:{
                columnDef: '=',
                editable:"@",
                submitAction:"=",
                datasource:"=",
                configure: "=",
                hideSubmit: "="
            },
            compile: function(element, attrs){
                if(!attrs.editable) {
                    attrs.editable = false;
                }
                if(!attrs.hideSubmit) {
                    attrs.hideSubmit = false;
                }
            },
            controller: 'OrderContentsController'
        };
    })
    .directive('orderActionButtons', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/orders/templates/order-action-buttons.html',
            controller:'OrderActionButtonsController'
        };
    })
    .directive('orderTabs', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/orders/templates/order-tabs.html',
            controller: 'OrderTabController',
            link: function(scope, el, attr){
                require(['lxk.fef'], function() {
                    var $ = require('jquery'),
                         sets = $(el).find("[data-js=tab], [data-js=set], [data-js=accordion]");
                    sets.each(function(i,set){
                        $(set).set({});
                    });
                });
            }
        };
    });
});
