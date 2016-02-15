define(['angular', 'dashboard'], function(angular) {
    'use strict';
    angular.module('mps.dashboard')
    .controller('DashboardController', [
        '$scope',
        '$location',
        '$rootScope',
        'Devices',
        'ServiceRequestService',
        'UserService',
        'FilterSearchService',
        'PersonalizationServiceFactory',
        'HATEAOSConfig',
    function(
        $scope,
        $location,
        $rootScope,
        Devices,
        ServiceRequests,
        Users,
        FilterSearchService,
        Personalize,
        HATEAOSConfig
    ) {
        var personal = new Personalize($location.url(),$rootScope.idpUser.id),
        filterSearchService = new FilterSearchService(Devices, $scope, $rootScope, personal);

        $scope.searchFunctionDef = function(searchVals) {
            $location.path('/device_management?searchOn=' + searchVals.searchOn + '&search=' + searchVals.search);
        };

        /* The 'bar' at the top of the homepage with SR counts */
        $scope.getSROpenCnt = function() {
            ServiceRequests.get({
                preventDefaultParams: true,
                params: {
                    accountId: $rootScope.currentAccount.accountId,
                    accountLevel: $rootScope.currentAccount.accountLevel,
                    status:  ['submitted', 'in_progress']
                }
            }).then(function(res) {
                console.log(ServiceRequests.data); 
                
                $scope.srOpenCnt = 30;
                
                return res;
            });
        };

        HATEAOSConfig.getCurrentAccount().then(function() {
            $scope.getSROpenCnt();
        });

          $scope.getSRClosedCnt = function() {
            $scope.srClosedCnt = 10;
          };

          $scope.getSROrderCnt = function() {

          };

          $scope.getSRMadcCnt = function() {

          };

          $scope.hideDashboardNotification = function(){
            $rootScope.showDashboardNotification = false;
          };

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
