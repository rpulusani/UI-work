
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
})
.directive('reportPagesBilled', function() {
    return {
        restrict: 'A',
        templateUrl: '/app/reporting/templates/finder-pb0001.html',
        controller: 'ReportFinderController'
    };
})
.directive('reportServiceDetail', function() {
    return {
        restrict: 'A',
        templateUrl: '/app/reporting/templates/finder-sd0101.html',
        controller: 'ReportFinderController'
    };
});

