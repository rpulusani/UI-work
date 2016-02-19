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
    '$translate',
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
        Reports,
        $translate
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

                $scope.fleetPeriod = data.stat[0].period;
                
                $scope.chartObject.fleetAvailability.data = {
                    "cols": [
                        {id: "t", label: $translate.instant("REPORTING.FLEET_AVAILABILITY"), type: "string"},
                        {id: "s", label: $translate.instant("LABEL.PERCENT"), type: "number" },
                        {role: "style", type: "string"}
                    ],
                    "rows": [
                        {c: [
                            {v: '' },
                            {v: d.fleetAvailability },
                            {v: "#00ad21" }
                        ]}
                    ]};
            },
            buildResponseTimeChart = function(data) {
                var d = {};

                for (var i = 0; i < data.stat.length; i++) {
                    d[data.stat[i].label] = data.stat[i].value;
                }

                $scope.chartObject.responseTime = {};
                $scope.chartObject.responseTime.type = "ColumnChart";
                $scope.chartObject.responseTime.options = angular.copy($scope.chartOptions.columnChartOptions);
                $scope.chartObject.responseTime.options.vAxis = { format: '#.#\'%\'', ticks: [0, 50, 100] };
                $scope.chartObject.responseTime.dataPoint = d.responseTime;

                $scope.responsePeriod = data.stat[0].period;

                $scope.chartObject.responseTime.data = {
                    "cols": [
                        {id: "t", label: "Response Time", type: "string"},
                        {id: "s", label: $translate.instant("LABEL.PERCENT"), type: "number" },
                        {role: "style", type: "string"}
                    ],
                    "rows": [
                        {c: [
                            {v: '' },
                            {v: d.responseTime },
                            {v: "#1c64b4" }
                        ]}
                    ]};
            },
            buildConsumablesChart = function(data) {
                var d = {};

                for (var i = 0; i < data.stat.length; i++) {
                    d[data.stat[i].label] = data.stat[i].value;
                }

                $scope.chartObject.consumables = {};
                $scope.chartObject.consumables.type = "ColumnChart";
                $scope.chartObject.consumables.options = angular.copy($scope.chartOptions.columnChartOptions);
                $scope.chartObject.consumables.options.vAxis = { format: '#.#\'%\'', ticks: [0, 50, 100] };
                $scope.chartObject.consumables.dataPoint = d.consumables;

                $scope.consumablesPeriod= data.stat[0].period;

                $scope.chartObject.consumables.data = {
                    "cols": [
                        {id: "t", label: $translate.instant("REPORTING.FLEET_AVAILABILITY"), type: "string"},
                        {id: "s", label: $translate.instant("LABEL.PERCENT"), type: "number" },
                        {role: "style", type: "string"}
                    ],
                    "rows": [
                        {c: [
                            {v: '' },
                            {v: d.consumables },
                            {v: "#faa519" }
                        ]}
                    ]};
            },
            buildAssetRegisterChart = function(data) {
                var total = 0;

                for (var i = 0; i < data.stat.length; i++) {
                    total += data.stat[i].value;
                }

                $scope.chartObject.assetRegister = {};
                $scope.chartObject.assetRegister.type = 'PieChart';
                $scope.chartObject.assetRegister.options = angular.copy($scope.chartOptions.pieChartOptions);
                $scope.chartObject.assetRegister.options.slices = [{color: '#00ad21'}];
                $scope.chartObject.assetRegister.options.fontSize = 36;
                $scope.chartObject.assetRegister.dataPoint = total;

                $scope.assetPeriod = data.stat[0].period;

                $scope.chartObject.assetRegister.data = {
                    "cols": [
                        {id: "t", label: "Assets", type: "string"},
                        {id: "s", label: "Count", type: "number"}
                    ],
                    "rows": [
                        {c: [
                            {v: ''},
                            {v: total }
                        ]}
                    ]};

            },
            buildPagesBilledChart = function(data) {
                var d = {};

                for (var i = 0; i < data.stat.length; i++) {
                    d[data.stat[i].label] = data.stat[i].value;
                }

                $scope.chartObject.pagesBilled = {};
                $scope.chartObject.pagesBilled.type = "PieChart";
                $scope.chartObject.pagesBilled.options = angular.copy($scope.chartOptions.pieChartOptions);
                $scope.chartObject.pagesBilled.options.slices = [{color: '#7e7e85'}, {color: '#faa519'}];
                $scope.chartObject.pagesBilled.options.pieHole = 0.4;
                $scope.chartObject.pagesBilled.dataPoint = d.pagesBilledTotal;

                $scope.chartObject.pagesBilled.data = {
                    "cols": [
                        {id: "t", label: "Pages Billed", type: "string"},
                        {id: "s", label: "Count", type: "number"}
                    ],
                    "rows": [
                        {c: [
                            {v: '' },
                            {v: d.pagesBilledMono }
                        ]},
                        {c: [
                            {v: '' },
                            {v: d.pagesBilledColor }
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
                                    case 'response-time':
                                        buildResponseTimeChart(report.stats.data[0]);
                                        break;
                                    /* Consumables */
                                    case 'consumables':
                                        buildConsumablesChart(report.stats.data[0]);
                                        break;
                                    /* Asset Register */
                                    case 'mp9058sp':
                                        buildAssetRegisterChart(report.stats.data[0]);
                                        break;
                                    /* Pages Billed */
                                    case 'pb0001':
                                        buildPagesBilledChart(report.stats.data[0]);
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
            $scope.chartOptions.pieChartOptions = {
                backgroundColor: '#fff',
                height: 250,
                enableInteractivity: true,
                fontName: 'tpHero',
                legend: {
                    position: 'none'
                },
                pieSliceText: 'value',
                title: '',
                titlePosition: 'none',
                tooltip: {
                    textStyle: {fontSize: 14}
                }
            };

            $scope.chartOptions.columnChartOptions = {
                backgroundColor: '#fff',
                gridLines: {
                    count: 4
                },
                fontName: 'tpHero',
                height: 300,
                legend: {
                    position: 'none'
                },
                bar: {
                    groupWidth: '35%'
                },
                tooltip: {
                    textStyle: {fontSize: 14}
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
                var i = 0, 
                tmp = Reports.data;

                $scope.finder = Reports.finder;
                $scope.visualizations = [];
                $scope.reports = [];

                for (i = 0; i < tmp.length; i++) {
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
