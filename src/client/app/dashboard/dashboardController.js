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
'Notifications',
'FormatterService',
'BlankCheck',
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
    $translate,
    Notifications,
    FormatterService,
    BlankCheck
) {
	
		$scope.filteredNotifications = [];
		
		Notifications.get({
			params:{
				sort : 'order',
				page : 0,
				size : 1000
			}			
		}).then(function(res){			
			$scope.filteredNotifications = [];
			var i = 0,
			currentTime = new Date().getTime(),
			startTime,endTime;
			for(;i<Notifications.data.length;i++){
				
				if (Notifications.data[i].startDate !== null && Notifications.data[i].endDate !== null){
					startTime = new Date(Notifications.data[i].startDate).getTime();
					endTime = new Date(Notifications.data[i].endDate).getTime();
					
					if(startTime <= currentTime && endTime >= currentTime){
						$scope.filteredNotifications.push(Notifications.data[i]);
					}
				}				
			}
			if($scope.filteredNotifications.length === 0){
				$scope.hideDashboardNotification();
			}
			
		});
        var personal = new Personalize($location.url(),$rootScope.idpUser.id),
        filterSearchService = new FilterSearchService(Devices, $scope, $rootScope, personal),
        /* The 'bar' at the top of the homepage with SR counts */
        getSROpenCnt = function() {
            ServiceRequests.get({
                preventDefaultParams: BlankCheck.isNull($rootScope.currentAccount)? true : false,
                params: {
                        status:  ['SUBMITTED', 'IN_PROCESS', 'SHIPPED'],
                        'type': 'BREAK_FIX'
                }
            }).then(function(res) {
                $scope.srOpenCnt = ServiceRequests.page.totalElements;

                getSRCompletedCnt();
            });
            },
        getSRCompletedCnt = function() {
            ServiceRequests.get({
                preventDefaultParams: BlankCheck.isNull($rootScope.currentAccount)? true : false,
                params: {
                        status:  ['COMPLETED'],
                        'type': 'BREAK_FIX'
                }
            }).then(function(res) {
                $scope.srCompletedCnt = {total: ServiceRequests.page.totalElements};
            });
        },
        getSROrderCnt = function() {
            var options = {
                preventDefaultParams: BlankCheck.isNull($rootScope.currentAccount)? true : false,
                params: {
                    status:  ['SHIPPED','IN_PROCESS','SUBMITTED'],
                    type: 'ORDERS_ALL'
                }
            };

            if ($rootScope.viewSupplyOrderAccess && !$rootScope.viewHardwareOrderAccess) {
                options.params.type = 'SUPPLIES_ORDERS_ALL'
            } else if (!$rootScope.viewSupplyOrderAccess && $rootScope.viewHardwareOrderAccess) {
                options.params.type = 'HARDWARE_ORDERS_ALL';
            }
            $scope.orderCompleteType = options.params.type;
            Orders.get(options).then(function(res) {
                $scope.srOrderCnt = Orders.page.totalElements;
                getOrderCompletedCnt();
            });
        },
        getOrderCompletedCnt = function() {
            var options = {
                preventDefaultParams: BlankCheck.isNull($rootScope.currentAccount)? true : false,
                params: {
                        status:  ['COMPLETED'],
                        type: 'ORDERS_ALL'
                }
            };
            if ($rootScope.viewSupplyOrderAccess && !$rootScope.viewHardwareOrderAccess) {
                options.params.type = 'SUPPLIES_ORDERS_ALL'
            } else if (!$rootScope.viewSupplyOrderAccess && $rootScope.viewHardwareOrderAccess) {
                options.params.type = 'HARDWARE_ORDER';
            }

            Orders.get(options).then(function(res) {
                $scope.srOrderCompletedCnt = {total: Orders.page.totalElements};
            });
        },
        getSRMADCCnt = function() {
            ServiceRequests.get({
                preventDefaultParams: BlankCheck.isNull($rootScope.currentAccount)? true : false,
                params: {
                    type: [
                        'MADC_ALL','DATA_ASSET_ALL'
                    ],
                        status:  ['SHIPPED','IN_PROCESS','SUBMITTED']
                }
            }).then(function(res) {
                $scope.srMADCCnt = ServiceRequests.page.totalElements;

                getMADCCompletedCnt();
            });
        },
        getMADCCompletedCnt = function() {
            ServiceRequests.get({
                preventDefaultParams: BlankCheck.isNull($rootScope.currentAccount)? true : false,
                params: {
                    type: [
                        'MADC_ALL','DATA_ASSET_ALL'
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
                    {id: "s", label: $translate.instant("LABEL.COMMON.PERCENT"), type: "number" },
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
                    {id: "s", label: $translate.instant("LABEL.COMMON.PERCENT"), type: "number" },
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
                    {id: "s", label: $translate.instant("LABEL.COMMON.PERCENT"), type: "number" },
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
                        {v: $translate.instant('REPORTING.ASSET_COUNT')},
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
            $scope.chartObject.pagesBilled.options.height = 300;
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
                        {v: $translate.instant($translate.instant('REPORTING.MONO'))},
                        {v: d.pagesBilledMono }
                    ]},
                    {c: [
                        {v: $translate.instant($translate.instant('REPORTING.COLOR'))},
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
                            height: 300,
                             enableInteractivity: true,
                             fontSize: 36,
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

        $scope.goToRespectiveOpenGrid = function(tab,filter,filteron,type,path){
            var param = {
                tab: tab
            }
            $rootScope.searchParamsFromHome = {
                filterSelectric :{
                    filter: filter,
                    doSearch: true
                },
                queryParam: {
                    filteron : filteron,
                    type : type,
                    doQuery : true
                }
            };
            $location.path(path).search(param);
        }

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

        setTimeout(function() {
            
                getSROpenCnt();
                getSROrderCnt();
                getSRMADCCnt();
            
        }, 1500);


        Reports.getPage().then(function() {
        var i = 0,
            tmp = Reports.data;
        	$scope.finder = Reports.finder;
            $scope.visualizations = [];
            $scope.reports = [];

            for (i = 0; i < tmp.length; i++) {
            	if(tmp[i].id === 'fleet-availability' ||
            	   tmp[i].id === 'response-time' ||
            	   tmp[i].id === 'consumables' || 
            	   tmp[i].id === 'mp9058sp' ||
            	   tmp[i].id === 'pb0001'){
            		
            		 if (tmp[i]._links.stats !== undefined) {
                         $scope.visualizations.push(tmp[i]);
                     }

                     if (tmp[i]._links.results !== undefined) {
                         $scope.reports.push(tmp[i]);
                     }
            	}
            		
               
            }

            buildCharts();
        }, function(reason) {
            NREUM.noticeError('Grid Load Failed for ' + Reports.serviceName +  ' reason: ' + reason);
        });
   
}]).filter('dateRangeFormat',function(){
    return function(text){
        if (text) {
            var splitArr = text.split('/');
            var year = Number(splitArr[0].trim());
            var month = Number(splitArr[1].trim());
            var isLeapYear = (year%4 === 0)?true:false;
            var dateRange = '';
            var monthArr = ['January','February','March','April','May','June','July','August','September','October','November','December'];
            switch(month){
                case 1:             
                case 3:
                case 5:
                case 7:
                case 8:
                case 10:
                case 12:
                    dateRange = ' 1 - 31 ';
                    break;
                case 2: 
                    dateRange = (isLeapYear)?'1 - 29':'1 - 28';
                    break;
                case 4:
                case 6:
                case 9:
                case 11:
                    dateRange = '1 - 30';
                    break;
            }
            return monthArr[month-1] + ' ' + dateRange + ', ' + year;
        }
    }
});
