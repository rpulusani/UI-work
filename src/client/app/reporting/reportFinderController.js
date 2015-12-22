define(['angular', 'report'], function(angular) {
    'use strict';
    angular.module('mps.report')
    .controller('ReportFinderController', ['$scope', '$location', '$translate', 'Reports',
        function($scope, $location, $translate, Reports) {

            $scope.report = Reports.item;
            $scope.finder = Reports.finder;

            $scope.runReport = function(report) {
                Reports.finder = $scope.finder;
                if (Reports.finder.selectType === $translate.instant('LABEL.SELECT')) {
                    Reports.finder.selectType = '';
                }

                Reports.setItem(report);

                $location.path(Reports.route + '/results');
            };

        }
    ]);
});
