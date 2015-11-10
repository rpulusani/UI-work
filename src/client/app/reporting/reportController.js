define(['angular', 'report', 'chart'], function(angular) {
    'use strict';
    angular.module('mps.report')
    .controller('ReportController', ['$scope', '$location', '$rootScope', 'Reports', 'grid', '$http', 'serviceUrl',
        function($scope, $location, $rootScope, Reports, Grid, $http, serviceUrl) {
            $scope.finder = Reports.finder;
            $scope.categories = Reports.data;
            $scope.category = Reports.item;

            // Dummy Chart Data

            // end point /devicecount
            $scope.madcEvents = [{
                value: 300,
                color:'#F7464A',
                highlight: '#FF5A5E',
                label: 'Shipped'
            }, {
                value: 50,
                color: '#46BFBD',
                highlight: '#5AD3D1',
                label: 'Installed'
            }, {
                value: 100,
                color: '#FDB45C',
                highlight: '#FFC870',
                label: 'Stored'
            }];

            $scope.barChartSample = {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [{
                    label: 'My First dataset',
                    fillColor: 'rgba(0,173,22,0.5)',
                    strokeColor: 'rgba(0,173,22,0.5)',
                    highlightFill: 'rgba(0,173,22,0.75)',
                    highlightStroke: 'rgba(0,173,22,1)',
                    data: [65, 59, 80, 81, 56, 55, 40]
                }, {
                    label: 'My Second dataset',
                    fillColor: 'rgba(0,97,222,0.5)',
                    strokeColor: 'rgba(0,97,222,0.5)',
                    highlightFill: 'rgba(0,97,222,0.75)',
                    highlightStroke: 'rgba(0,97,222,1)',
                    data: [28, 48, 40, 19, 86, 27, 90]
                }]
            };

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
