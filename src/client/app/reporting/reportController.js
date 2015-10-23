define(['angular', 'report', 'utility.grid', 'pdfmake'], function(angular) {
    'use strict';
    angular.module('mps.report')
    .controller('ReportController', ['$scope', '$location', 'Reports', 'grid',
        function($scope, $location, Reports, Grid) {
            var redirect_to_list = function() {
                $location.path(Reports.route);
            };

            $scope.categories = Reports.categories;
            $scope.category = Reports.category;

            $scope.goToReport = function(report) {
                Reports.get(report).then(function() {
                    Reports.category = Reports.item;
                    $location.path(Reports.route + '/' + report.id + '/view');
                });
            };
        }
    ]);
});
