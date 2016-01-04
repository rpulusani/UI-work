define(['angular'], function(angular) {
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
                controller: 'ReportController',
                activeItem: '/reporting'
            })
            .when('/reporting/:reportId/results', {
                templateUrl: '/app/reporting/templates/results.html',
                controller: 'ReportListController',
                activeItem: '/reporting'
            })
            .when('/reporting/results', {
                templateUrl: '/app/reporting/templates/results.html',
                controller: 'ReportListController',
                activeItem: '/reporting'
            });
        }
    ]);
});
