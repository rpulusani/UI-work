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
        'OrderRequest',
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
        Orders,
        HATEAOSConfig
    ) {
        HATEAOSConfig.getCurrentAccount().then(function() {
            var personal = new Personalize($location.url(),$rootScope.idpUser.id),
            filterSearchService = new FilterSearchService(Devices, $scope, $rootScope, personal),
            /* The 'bar' at the top of the homepage with SR counts */
            getSROpenCnt = function() {
                ServiceRequests.get({
                    preventDefaultParams: true,
                    params: {
                        accountId: $rootScope.currentAccount.accountId,
                        accountLevel: $rootScope.currentAccount.accountLevel,
                        status:  ['SUBMITTED', 'IN_PROCESS', 'SHIPPED']
                    }
                }).then(function(res) {
                    $scope.srOpenCnt = ServiceRequests.page.totalElements;
                    
                    getSRCompletedCnt();
                });
            }, 
            getSRCompletedCnt = function() {
                ServiceRequests.get({
                    preventDefaultParams: true,
                    params: {
                        accountId: $rootScope.currentAccount.accountId,
                        accountLevel: $rootScope.currentAccount.accountLevel,
                        status:  ['COMPLETED']
                    }
                }).then(function(res) {
                    $scope.srCompletedCnt = {total: ServiceRequests.page.totalElements};
                });
            },
            getSROrderCnt = function() {
                Orders.get({
                    preventDefaultParams: true,
                    params: {
                        accountId: $rootScope.currentAccount.accountId,
                        accountLevel: $rootScope.currentAccount.accountLevel,
                        status:  ['SUBMITTED']
                    }
                }).then(function(res) {
                    $scope.srOrderCnt = Orders.page.totalElements;
                    getOrderCompletedCnt();
                });
            },
            getOrderCompletedCnt = function() {
                Orders.get({
                    preventDefaultParams: true,
                    params: {
                        accountId: $rootScope.currentAccount.accountId,
                        accountLevel: $rootScope.currentAccount.accountLevel,
                        status:  ['COMPLETED']
                    }
                }).then(function(res) {
                    $scope.srOrderCompletedCnt = {total: Orders.page.totalElements};
                });
            },
            getSRMADCCnt = function() {
                ServiceRequests.get({
                    preventDefaultParams: true,
                    params: {
                        accountId: $rootScope.currentAccount.accountId,
                        accountLevel: $rootScope.currentAccount.accountLevel,
                        type: [
                            'MADC_ALL'
                        ],
                        status:  ['SUBMITTED']
                    }
                }).then(function(res) {
                    $scope.srMADCCnt = ServiceRequests.page.totalElements;

                    getMADCCompletedCnt();
                });
            },
            getMADCCompletedCnt = function() {
                ServiceRequests.get({
                    preventDefaultParams: true,
                    params: {
                        accountId: $rootScope.currentAccount.accountId,
                        accountLevel: $rootScope.currentAccount.accountLevel,
                        type: [
                            'MADC_ALL'
                        ],
                        status:  ['COMPLETED']
                    }
                }).then(function(res) {
                    $scope.srMADCCompletedCnt = {total: ServiceRequests.page.totalElements};
                });
            };

            $scope.searchFunctionDef = function(searchVals) {
                $location.path('/device_management');
            };

            $scope.hideDashboardNotification = function(){
                $rootScope.showDashboardNotification = false;
            };

            // Dummy Chart Data
            $scope.columnChartObject = {};
            $scope.columnChartObject.type = 'ColumnChart';
            $scope.columnChartObject.options = {
              'title': 'MADC Events'
            };

            $scope.columnChartObject.data = {'cols': [
                  {id: 't', label: 'MADC', type: 'string'},
                  {id: 's', label: 'Month', type: 'number'}
              ], 'rows': [
                  {c: [
                      {v: 'January'},
                      {v: 65}
                  ]},
                  {c: [
                      {v: 'February'},
                      {v: 59}
                  ]},
                  {c: [
                      {v: 'March'},
                      {v: 80}
                  ]},
                  {c: [
                      {v: 'April'},
                      {v: 81}
                  ]},
                  {c: [
                      {v: 'May'},
                      {v: 56}
                  ]},
                  {c: [
                      {v: 'June'},
                      {v: 55}
                  ]},
                  {c: [
                      {v: 'July'},
                      {v: 40}
                  ]},
            ]};

            // Calls to setup action bar
            getSROpenCnt();
            getSROrderCnt();
            getSRMADCCnt();
        });
    }]);
});
