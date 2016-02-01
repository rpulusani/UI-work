define(['angular', 'invoice'], function(angular) {
    'use strict';
    angular.module('mps.invoice')
    .directive('invoiceList', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/invoices/templates/invoice-list.html',
            controller: 'InvoiceListController'
        };
    })
    .directive('invoiceTabs', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/invoices/templates/invoice-tabs.html',
            controller: 'InvoiceController',
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
