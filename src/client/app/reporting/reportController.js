define(['angular', 'report', 'chart'], function(angular) {
    'use strict';
    angular.module('mps.report')
    .controller('ReportController', ['$scope', '$location', 'Reports', 'grid',
        function($scope, $location, Reports, Grid) {
            $scope.finder = Reports.finder;
            $scope.categories = Reports.data;
            $scope.category = Reports.item;

            if (Reports.data.length === 0 || !Reports.data) {
                Reports.getPage().then(function() {
                    var i = 0,
                    report;

                   $scope.categories = Reports.data;

                    for (i; i < $scope.categories.length; i += 1) {
                        report = Reports.createItem($scope.categories[i]);
                        report.stats.params.page = null;
                        report.stats.params.size = null;

                        (function(report) {
                            report.links.stats({
                                embeddedName: null
                            }).then(function(serverResponse) {

                            });
                        }(report));
                    }
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
