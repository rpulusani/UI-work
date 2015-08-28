'use strict';
angular.module('mps.report', []).config(['$routeProvider', 
    function ($routeProvider) {
        $routeProvider
        .when('/reporting', {
            templateUrl: '/app/reporting/templates/reporting-home.html',
            controller: 'ReportController'
        })
        .when('/reporting/:definitionId/run', {
            templateUrl: '/app/reporting/templates/run-report.html',
            controller: 'ReportController'
        })
        .when('/reporting/:definitionId/view', {
            templateUrl: '/app/reporting/templates/view.html',
            controller: 'ReportController'
        });
    }
]);
