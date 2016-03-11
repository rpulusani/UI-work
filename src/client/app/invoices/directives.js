

angular.module('mps.invoice')
.directive('invoiceList', function() {
    return {
        restrict: 'A',
            scope: {
                status: '@'
            },
            controller: 'InvoiceListController',
            templateUrl: '/app/invoices/templates/invoice-list.html'
    };
})
.directive('invoiceTabs', function() {
    return {
        restrict: 'A',
        templateUrl: '/app/invoices/templates/invoice-tabs.html',
        controller: 'InvoiceController',
        link: function(scope, el, attr){
            var $ = require('jquery');
            var sets = $(el).find("[data-js=tab], [data-js=set], [data-js=accordion]");
            sets.each(function(i,set){
                $(set).set({});
            });
        }
    };
});

