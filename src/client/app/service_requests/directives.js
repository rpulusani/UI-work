define(['angular', 'serviceRequest'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequests')
    .directive('primaryRequestContact', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/service_requests/templates/primary-request-contact.html'
        };
    })
    .directive('openSr', function(){
        return {
            restrict: 'A',
            templateUrl : '/app/service_requests/templates/open_sr.html',
            controller: 'OpenServiceRequestController',
            scope: {
               configure: "="
            }
        };
    })
    .directive('openBreakFixSummary', function(){
        return {
            restrict: 'A',
            templateUrl : '/app/service_requests/templates/open-service-history-summary.html'
        };
    })
    .directive('deviceSrTab', function(){
        return {
            restrict: 'A',
            templateUrl : '/app/service_requests/templates/tabs/device-sr-tab.html',
            controller: 'ServiceRequestDeviceListController',
            scope: {}
        };
    })
    .directive('breakFixSrTab', function(){
        return {
            restrict: 'A',
            templateUrl : '/app/service_requests/templates/tabs/breakfix-sr-tab.html',
            controller: 'ServiceRequestBreakFixListController'
        };
    })
    .directive('addressSrTab', function(){
        return {
            restrict: 'A',
            templateUrl : '/app/service_requests/templates/tabs/address-sr-tab.html',
            controller: 'ServiceRequestAddressListController'
        };
    })
    .directive('contactSrTab', function(){
        return {
            restrict: 'A',
            templateUrl : '/app/service_requests/templates/tabs/contact-sr-tab.html',
            controller: 'ServiceRequestContactListController'
        };
    })
    .directive('allSrTab', function(){
        return {
            restrict: 'A',
            templateUrl : '/app/service_requests/templates/tabs/all-sr-tab.html',
            controller: 'ServiceRequestListController'
        };
    })
    .directive('srHeader', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/service_requests/templates/sr-header.html'
        };
    })
    .directive('srFormButtons', function() {
        return{
            restrict: 'A',
            templateUrl: '/app/service_requests/templates/sr-form-buttons.html',
            controller: ['$scope', function($scope) {
                $scope.formSubmit = function(submitFn){
                    if(submitFn !== null && submitFn !== undefined){
                        return submitFn();
                    }
                };
            }]
        };
    })
    .directive('requestContacts', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/service_requests/templates/request-contact-information.html'
        };
    })
    .directive('srDeviceInformation', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/service_requests/templates/device-information.html'
        };
    })
    .directive('srDevicePageCounts', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/service_requests/templates/device-page-counts.html'
        };
    })
    .directive('srDeviceRemoval', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/service_requests/templates/device-removal.html'
        };
    })
    .directive('srDeviceServiceDetails', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/service_requests/templates/device-service-request-details.html'
        };
    })
    .directive('srDeviceContact', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/service_requests/templates/device-contact.html'
        };
    })
    .directive('additionalRequestInfo', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/service_requests/templates/additional-request-info.html'
        };
    })
    .directive('srActionButtons', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/service_requests/templates/sr-action-buttons.html',
            controller:'ServiceRequestActionButtonsController'
        };
    })
    .directive('addressUpload', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/service_requests/templates/address-upload.html',
            controller: ['$scope', function($scope) {
                $scope.file_list = ['.csv', '.xls', '.xlsx', '.vsd', '.doc',
                                    '.docx', '.ppt', '.pptx', '.pdf', '.zip'].join(',');
            }]
        };
    })
    .directive('srContact', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/service_requests/templates/contact.html'
        };
    })
    .directive('srAddress', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/service_requests/templates/address.html'
        };
    })
    .directive('srCancel', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/service_requests/templates/cancel-request.html'
        };
    })
    .directive('serviceRequestTabs', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/service_requests/templates/service-request-tabs.html',
            controller: 'ServiceRequestTabController',
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
