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
    .directive('supplyOrderTab', function(){
        return {
            restrict: 'A',
            templateUrl : '/app/orders/templates/tabs/supply-order-tab.html',
            controller: 'SupplyOrderListController'
        };
    })
    .directive('orderContent', function(){
        return {
            restrict: 'A',
            templateUrl: '/app/orders/templates/order-contents.html',
            scope:{
                columnDef: '=',
                editable:"=",
                submitAction:"=",
                datasource:"="
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
