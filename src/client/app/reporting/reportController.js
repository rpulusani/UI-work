define(['angular', 'report', 'chart'], function(angular) {
    'use strict';
    angular.module('mps.report')
    .controller('ReportController', ['$scope', '$location', '$rootScope', 'Reports', 'grid', '$http', 'serviceUrl',
        function($scope, $location, $rootScope, Reports, Grid, $http, serviceUrl) {
            $scope.finder = Reports.finder;
            $scope.categories = Reports.data;
            $scope.category = Reports.item;

            if (Reports.data.length === 0 || !Reports.data) {
                Reports.getPage().then(function() {
                   $scope.categories = Reports.data;
                });
            } else {
                $scope.categories = Reports.data;
            }

            $scope.goToFinder = function(report) {
                Reports.setItem(report);

                if (Reports.item.eventTypes) {
                    $location.path(Reports.route + '/' + Reports.item.id + '/find');
                } else {
                    $scope.runReport(report);
                }
            };

            $scope.runReport = function(report) {
                Reports.finder = $scope.finder;
                $location.path(Reports.route + '/results');
            };
        }
    ]);
});
