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
                        sets = $(el).find("[data-js=tab]");
                    sets.each(function(i,set){
                        $(set).set({});
                    });
                });
            }
        };
    });
});
