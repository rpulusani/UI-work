define(['angular', 'report', 'chart'], function(angular) {
    'use strict';
    angular.module('mps.report')
    .controller('ReportController', ['$scope', '$location', '$rootScope', 'Reports', 'grid', '$http', 'serviceUrl',
        function($scope, $location, $rootScope, Reports, Grid, $http, serviceUrl) {
            $scope.finder = Reports.finder;
            $scope.categories = Reports.categories;
            $scope.category = Reports.category;

            Reports.columns = 'fullSet';

            // Dummy Chart Data

            // end point /devicecount
            $scope.madcEvents = [{
                value: 300,
                color:'#F7464A',
                highlight: '#FF5A5E',
                label: 'Shipped'
            },
            {
                value: 50,
                color: '#46BFBD',
                highlight: '#5AD3D1',
                label: 'Installed'
            },
            {
                value: 100,
                color: '#FDB45C',
                highlight: '#FFC870',
                label: 'Stored'
            }];

            $scope.devicecount = function() {
                $http.get(serviceUrl + "reports/devicecount/?accountId=1-1L9SRP&accountLevel=L5").success(function(res) {
                    console.log("res", res);
                    $scope.madcEvents[0].value = res.dataSet[0].data[0];
                    $scope.madcEvents[1].value = res.dataSet[0].data[1];
                    $scope.madcEvents[2].value = res.dataSet[0].data[2];
                    console.log($scope.madcEvents);
                });
            };

            $scope.devicecount();

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

            $scope.runReport = function(category) {
                console.log("runReport", category);
                /*
                  Report.get(category, '').then(function(){
                });
                */
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
