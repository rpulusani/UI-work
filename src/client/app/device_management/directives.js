
angular.module('mps.deviceManagement')
.directive('deviceInformation', function() {
    return {
        restrict: 'A',
            templateUrl: '/app/device_management/templates/device-information.html'
    };
})
.directive('deviceOverviewNotificaiton', function(){
    return{
        restrict: 'A',
        templateUrl: '/app/device_management/templates/device-overview-notification.html',
        scope: {
            device: "="
        },
        controller: 'DeviceNotificationController'
    };
})
.directive('suppliesAccessoryOrder', function() {
    return {
        restrict: 'A',
        templateUrl: '/app/device_management/templates/order_supply_accessory.html',
        controller: 'OrderSupplyController'
    };
})
.directive('orderList', function() {
    return {
        restrict: 'A',
        templateUrl: '/app/device_management/templates/order-list.html',
        controller: 'DeviceOrderController'
    };
})
.directive('requestBreakFixList', function() {
    return {
        restrict: 'A',
        templateUrl: '/app/device_management/templates/request-break-fix-list.html',
        scope:{},
        controller: 'DeviceRequestBreakFixListController'
    };
})
.directive('devicePageCount', function() {
    return {
        restrict: 'A',
        templateUrl: '/app/device_management/templates/device-page-count.html'
    };
})
.directive('deviceListingTabs', ['$timeout', function($timeout) {
    return {
        restrict: 'A',
        templateUrl: '/app/device_management/templates/device-listing-tabs.html',
        link: function(scope, el, attr){
           var $ = require('jquery'),
                 sets = $(el).find("[data-js=tab], [data-js=set], [data-js=accordion]");
            $timeout(function(){
                sets.each(function(i,set){
                    $(set).set({});
                });
            },0);

        }
    };
}])
.directive('deviceTabs', ['$timeout', function($timeout) {
    return {
        restrict: 'A',
        templateUrl: '/app/device_management/templates/device-tabs.html',
        controller: 'DeviceController',
        link: function(scope, el, attr){
            var $ = require('jquery'),
                 sets = $(el).find("[data-js=tab], [data-js=set], [data-js=accordion]");
            $timeout(function(){
                sets.each(function(i,set){
                    $(set).set({});
                });
        },0);
        }
    };
}]);
