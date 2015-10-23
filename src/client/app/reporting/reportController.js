define(['angular', 'report', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.report')
    .controller('ReportController', ['$scope', '$location', 'Reports', 'grid',
        function($scope, $location, Reports, Grid) {
            var redirect_to_list = function() {
                $location.path(Reports.route);
            };

            $scope.finder = {};
            $scope.finder.dateFrom = '';
            $scope.finder.dateTo = '';
            $scope.categories = Reports.categories;
            $scope.category = Reports.category;

            $scope.goToReportFinder = function(category) {
                Reports.category = category;
                $location.path(Reports.route + '/' + Reports.category.id + '/view');
            };

            $scope.runReport = function() {
                if ($scope.finder.dateFrom && $scope.finder.dateTo) {
                    $location.path(Reports.route + '/view');
                } else {
                     $location.path(Reports.route + '/' + Reports.category.id + '/view');
                }
            }
        }
    ]);
});
