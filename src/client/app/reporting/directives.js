define(['angular', 'report'], function(angular) {
    'use strict';
    angular.module('mps.report')
    .directive('reportHardwareOrders', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/reporting/templates/finder-hw0008.html',
            controller: 'ReportFinderController'
        };
    })
    .directive('reportHardwareInstallationRequests', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/reporting/templates/finder-hw0015.html',
            controller: 'ReportFinderController'
        };
    })
    .directive('reportConsumablesOrders', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/reporting/templates/finder-mp0021.html',
            controller: 'ReportFinderController'
        };
    })
    .directive('reportMadc', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/reporting/templates/finder-mp9073.html',
            controller: 'ReportFinderController'
        };
    })
    .directive('reportMissingMeterReads', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/reporting/templates/finder-mp0075.html',
            controller: 'ReportFinderController'
        };
    });
});
