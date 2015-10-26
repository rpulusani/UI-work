'use strict';
angular.module('mps.report', []).config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider
        .when('/reporting', {
            templateUrl: '/app/reporting/templates/view.html',
            controller: 'ReportController'
        })
        .when('/reporting/:definitionId/find', {
            templateUrl: '/app/reporting/templates/search.html',
            controller: 'ReportController'
        })
        .when('/reporting/results', {
            templateUrl: '/app/reporting/templates/results.html',
            controller: 'ReportListController'
        });
    }
]);
