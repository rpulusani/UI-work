define(['angular', 'dashboard', 'googlecharting'], function(angular) {
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
    'Reports',
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
        HATEAOSConfig,
        Reports
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
            },
            buildFleetAvailabilityChart = function(data) {
                var d = {};

                for (var i = 0; i < data.stat.length; i++) {
                    d[data.stat[i].label] = data.stat[i].value;
                }

                $scope.chartObject.fleetAvailability = {};
                $scope.chartObject.fleetAvailability.type = "ColumnChart";
                $scope.chartObject.fleetAvailability.options = angular.copy($scope.chartOptions.columnChartOptions);
                $scope.chartObject.fleetAvailability.options.vAxis = { format: '#.#\'%\'', ticks: [0, 50, 100] };
                $scope.chartObject.fleetAvailability.dataPoint = d.fleetAvailability;

                $scope.chartObject.fleetAvailability.data = {
                    "cols": [
                        {id: "t", label: "Fleet Availability", type: "string"},
                        {id: "s", label: "Percent", type: "number" },
                        {role: "style", type: "string"}
                    ],
                    "rows": [
                        {c: [
                            {v: 'TEST' },
                            //{v: $translate.instant($scope.configure.report.kpi.translate.fleetAvailability) },
                            {v: d.fleetAvailability },
                            {v: "#00ad21" }
                        ]}
                    ]};
            },
            buildCharts = function() {
                var report;

                for (var i = 0; i < $scope.visualizations.length; i++) {
                    report = Reports.createItem($scope.visualizations[i]);

                    report.stats.params.page = null;
                    report.stats.params.size = null;

                    (function(report) {
                        report.links.stats({
                            embeddedName: 'stats',
                        }).then(function(serverResponse) {

                            if (report.stats.data[0]) {
                                switch (report.id) {
                                    /* Fleet Availability */
                                    case 'fleet-availability':
                                        buildFleetAvailabilityChart(report.stats.data[0]);
                                        break;
                                    default:
                                }
                            }
                        });
                    }(report));
                }
            };

            $scope.chartObject = {};
            $scope.chartOptions = {};
            $scope.chartOptions.columnChartOptions = {
                backgroundColor: '#fff',
                fontName: 'tpHero',
                height: 300,
                legend: {
                    position: 'none'
                },
                title: '',
                titlePosition: 'none',
                bar: {
                    groupWidth: '30%'
                }
            };

            // Device search
            $scope.searchFunctionDef = function(searchVals) {
                $location.path('/device_management').search({
                    search: searchVals.search,
                    searchOn: searchVals.searchOn
                });
            };

            $scope.hideDashboardNotification = function(){
                $rootScope.showDashboardNotification = false;
            };

            // Calls to setup action bar
            getSROpenCnt();
            getSROrderCnt();
            getSRMADCCnt();
        

            Reports.getPage().then(function() {
                $scope.finder = Reports.finder;
                $scope.visualizations = [];
                $scope.reports = [];

                var tmp = Reports.data;
                console.log(123);
                for (var i = 0; i < tmp.length; i++) {

                    if (tmp[i]._links.stats !== undefined) {
                        $scope.visualizations.push(tmp[i]);
                    }

                    if (tmp[i]._links.results !== undefined) {
                        $scope.reports.push(tmp[i]);
                    }
                }

                buildCharts();
            }, function(reason) {
                NREUM.noticeError('Grid Load Failed for ' + Reports.serviceName +  ' reason: ' + reason);
            });
        });
    }]);
});
