define(['angular', 'deviceManagement'], function(angular) {
    'use strict';
    angular.module('mps.deviceManagement')
    .directive('deviceInformation', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/device_management/templates/device-information.html',
            controller: 'DeviceInformationController' 
        };
    })
    .directive('orderList', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/device_management/templates/order-list.html',
            controller: 'DeviceOrderController' 
        };
    })
    .directive('requestList', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/device_management/templates/request-list.html',
            controller: 'DeviceRequestController' 
        };
    })
    .directive('devicePageCount', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/device_management/templates/device-page-count.html',
            controller: 'DevicePageCountsController' 
        };
    })
    .directive('deviceTabs', function() {
        return {
	            restrict: 'A',
	            templateUrl: '/app/device_management/templates/device-tabs.html',
	            controller: 'DeviceManagementController',
	            link: function(scope, el, attr){
	                require(['lxk.fef'], function() {
	                var $ = require('jquery'),
	                    sets = $(el).find("[data-js=tab]");
	                sets.each(function(i,set){
	                    $(set).set({
	                    });
	                });            
	            });
        	} 
        };
    });
});
