define(['angular', 'dashboard', 'googlecharting'], function(angular) {
    'use strict';
    angular.module('mps.dashboard')
    .controller('DashboardController', ['$scope',
      '$location',
        function(
          $scope,
          $location
          ) {


            // Dummy Chart Data
            $scope.columnChartObject = {};
            $scope.columnChartObject.type = "ColumnChart";
            $scope.columnChartObject.options = {
              'title': 'MADC Events'
            };

            $scope.columnChartObject.data = {"cols": [
                  {id: "t", label: "MADC", type: "string"},
                  {id: "s", label: "Month", type: "number"}
              ], "rows": [
                  {c: [
                      {v: "January"},
                      {v: 65}
                  ]},
                  {c: [
                      {v: "February"},
                      {v: 59}
                  ]},
                  {c: [
                      {v: "March"},
                      {v: 80}
                  ]},
                  {c: [
                      {v: "April"},
                      {v: 81}
                  ]},
                  {c: [
                      {v: "May"},
                      {v: 56}
                  ]},
                  {c: [
                      {v: "June"},
                      {v: 55}
                  ]},
                  {c: [
                      {v: "July"},
                      {v: 40}
                  ]},
              ]};

        }
    ]);
});
