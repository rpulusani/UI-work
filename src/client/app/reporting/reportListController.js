define(['angular', 'report', 'utility.grid', 'pdfmake'], function(angular) {
    'use strict';
    angular.module('mps.report')
    .controller('ReportListController', ['$scope', '$location', 'grid', 'Reports',
        function($scope, $location, Grid, Reports) {
            if (!Reports.category) {
                $location.path(Reports.route);
            }

            $scope.category = Reports.category;
            $scope.gridOptions = {};

            Reports.getPage().then(function() {
                Grid.display(Reports, $scope);
            }, function(reason) {
                NREUM.noticeError('Grid Load Failed for ' + Reports.serviceName +  ' reason: ' + reason);
            });
        }
    ]);
});
