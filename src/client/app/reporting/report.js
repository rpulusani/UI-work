'use strict';
angular.module('mps.report', []).config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider
        .when('/reporting', {
            templateUrl: '/app/reporting/templates/reporting-home.html',
            controller: 'ReportController'
        })
        .when('/reporting/:definitionId/view', {
            templateUrl: '/app/reporting/templates/view.html',
            controller: 'ReportController'
        })
        .when('/reporting/view', {
            templateUrl: '/app/reporting/templates/report-view.html',
            controller: 'ReportListController'
        });;
    }
]);
