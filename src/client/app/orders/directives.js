angular.module('mps.orders')
.directive('allOrderTab', function(){
    return {
        restrict: 'A',
        templateUrl : '/app/orders/templates/tabs/all-order-tab.html',
        scope:{},
        controller: 'OrderListController'
    };
})
.directive('deviceOrderTab', function(){
    return {
        restrict: 'A',
        templateUrl : '/app/orders/templates/tabs/device-order-tab.html',
        scope:{},
        controller: 'DeviceOrderListController'
    };
})
.directive('openOrderSummary', function(){
    return {
        restrict: 'A',
        templateUrl : '/app/orders/templates/open-order-summary.html',
        scope:{
            configure: "="          
        },
        controller: 'DeviceOrderHistoryController'
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
        scope:{},
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
    .directive('shipTo', function(){
        return{
            restrict: 'A',
            templateUrl: '/app/orders/templates/ship-to.html'
        };
    })
.directive('orderShipToBillToDetails', function(){
    return{
        restrict: 'A',
        templateUrl: '/app/orders/templates/ship-to-bill-to.html'
        };
    })
    .directive('orderShipInstallDetails', function(){
        return{
            restrict: 'A',
            templateUrl: '/app/orders/templates/ship-to-install.html'
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
            taxable:"=",
            ordernbr:"=",
            submitAction:"=",
            datasource:"=",
            configure: "=",
            hideSubmit: "=",
            maxServiceQuantity: "=",
            maxSuppliesQuantity: "=",
            taxLoading: '='
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
.directive('alertTaxCalulating',function(){
	return{
		restrict: 'A',
		template: '<div class="alert alert--info" ng-if="calculatingTax">'+
        		  '<icon class="alert__icon icon icon--small icon--ui icon--info"></icon>'+
                  '<div class="alert__body">'+
                  '<span>Calculating Tax</span></div></div>'
	}
	
})
.directive('orderContentTable', function(){
    return {
        restrict: 'A',
        templateUrl: '/app/orders/templates/order-contents-table.html',
        scope:{
            items: '=',
            tax: '='
        },
        controller:'OrderContentTableController'
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

            var $ = require('jquery'),
                 sets = $(el).find("[data-js=tab], [data-js=set], [data-js=accordion]");
            sets.each(function(i,set){
                $(set).set({});
            });
        }
    };
});

