define(['angular', 'dashboard', 'chart'], function(angular) {
    'use strict';
    angular.module('mps.dashboard')
    .controller('DashboardController', ['$scope', '$location',
        function($scope, $location) {
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
        }
    ]);
});
