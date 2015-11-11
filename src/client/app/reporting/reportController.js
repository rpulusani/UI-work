define(['angular', 'report', 'chart', 'form'], function(angular) {
    'use strict';
    angular.module('mps.report')
    .controller('ReportController', ['$scope', '$location', '$rootScope', 'Reports', 'grid',
        function($scope, $location, $rootScope, Reports, Grid) {
            $scope.finder = Reports.finder;
            $scope.categories = Reports.categories;
            $scope.category = Reports.category;

            // Dummy Chart Data
            $scope.madcEvents = [{
                value: 300,
                color:'#F7464A',
                highlight: '#FF5A5E',
                label: 'Red'
            },
            {
                value: 50,
                color: '#46BFBD',
                highlight: '#5AD3D1',
                label: 'Green'
            },
            {
                value: 100,
                color: '#FDB45C',
                highlight: '#FFC870',
                label: 'Yellow'
            }];
            $scope.barChartSample = {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                    {
                      label: 'My First dataset',
                      fillColor: 'rgba(0,173,22,0.5)',
                      strokeColor: 'rgba(0,173,22,0.5)',
                      highlightFill: 'rgba(0,173,22,0.75)',
                      highlightStroke: 'rgba(0,173,22,1)',
                      data: [65, 59, 80, 81, 56, 55, 40]
                    },
                    {
                      label: 'My Second dataset',
                      fillColor: 'rgba(0,97,222,0.5)',
                      strokeColor: 'rgba(0,97,222,0.5)',
                      highlightFill: 'rgba(0,97,222,0.75)',
                      highlightStroke: 'rgba(0,97,222,1)',
                      data: [28, 48, 40, 19, 86, 27, 90]
                    }
                ]
            };

            if (!Reports.category) {
                Reports.getTypes().then(function() {
                   $scope.categories = Reports.categories;
                });
            } else {
                $scope.categories = Reports.categories;
            }

            $scope.goToFinder = function(category) {
                Reports.category = category;
                $location.path(Reports.route + '/' + Reports.category.id + '/find');
            };

            $scope.runReport = function() {
                if ($scope.finder.dateFrom && $scope.finder.dateTo) {
                    $rootScope.finder = $scope.finder;
                    $location.path(Reports.route + '/results');
                } else {
                    $location.path(Reports.route + '/' + Reports.category.id + '/find');
                }
            };
        }
    ]);
});
