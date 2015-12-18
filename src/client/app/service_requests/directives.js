define(['angular', 'serviceRequest'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequests')
    .directive('primaryRequestContact', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/service_requests/templates/primary-request-contact.html'
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
    .directive('srDeviceUpdate', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/service_requests/templates/device-update.html'
        };
    })
    .directive('srDeviceNetworkConfig', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/service_requests/templates/device-network-config.html'
        };
    })
    .directive('srDeviceBilling', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/service_requests/templates/device-billing.html'
        };
    })
    .directive('additionalRequestInfo', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/service_requests/templates/additional-request-info.html'
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
    .directive('serviceRequestTabs', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/service_requests/templates/service-request-tabs.html',
            controller: 'ServiceRequestController',
            link: function(scope, el, attr){
                require(['lxk.fef'], function() {
                    var $ = require('jquery'),
                        sets = $(el).find("[data-js=tab], [data-js=accordion], [data-js=set]");
                    sets.each(function(i,set){
                        $(set).set({});
                    });
                });
            }
        };
    });
});
