define(['angular', 'report', 'library', 'googlecharting'], function(angular) {
    'use strict';
    angular.module('mps.report')
    .controller('ReportController', ['$scope', '$location', '$translate', 'Reports', 'Documents', 'grid', '$rootScope', 'PersonalizationServiceFactory',
        function($scope, $location, $translate, Reports, Documents, GridService, $rootScope, Personalize) {

            $scope.chartObject = {};
            $scope.chartData = {};
            $scope.chartOptions = {};

            function configureTemplates() {
                $scope.configure = {
                    header: {
                        translate: {
                            h1: 'REPORTING.TITLE',
                            body: 'MESSAGE.LIPSUM',
                        },
                    },
                    report: {
                        kpi: {
                            translate: {
                                h2: 'REPORTING.KEY_PERFORMANCE_INDICATORS',
                                fleetAvailability: 'REPORTING.FLEET_AVAILABILITY',
                                responseTime: 'REPORTING.RESPONSE_TIME',
                                consumables: 'REPORTING.CONSUMABLES'
                            },
                        },
                        charts: {
                            translate: {
                                h2: 'REPORTING.CHARTS',
                                noDataAvailable: 'LABEL.ZERO_RECORDS',
                                assetCount: 'REPORTING.ASSET_COUNT',
                                madcEvents: 'REPORTING.MADC_EVENTS',
                                meterReads: 'REPORTING.METER_READS',
                                consumablesOrders: 'REPORTING.CONSUMABLES_ORDERS',
                                hardwareOrders: 'REPORTING.HARDWARE_ORDERS',
                                billedPages: 'REPORTING.BILLED_PAGES',
                                moves: 'REPORTING.MOVES',
                                additions: 'REPORTING.ADDITIONS',
                                ipChanges: 'REPORTING.IP_CHANGES',
                                decommissions: 'REPORTING.DECOMMISSIONS',
                                swaps: 'REPORTING.SWAPS',
                                allReads: 'REPORTING.ALL_READS',
                                missedReads: 'REPORTING.MISSED_READS',
                                successfulReads: 'REPORTING.SUCCESSFUL_READS',
                                successfulReadsPercent: 'REPORTING.SUCCESSFUL_READS_PERCENT',
                                missedReadsPercent: 'REPORTING.MISSED_READS_PERCENT',
                                autoCount: 'REPORTING.AUTO_COUNT',
                                manualCount: 'REPORTING.MANUAL_COUNT',
                                consumablesOrdersOpen: 'LABEL.OPEN',
                                consumablesOrdersShipped: 'REPORTING.SHIPPED_LAST_THIRTY_DAYS',
                                hardwareOrdersOpen: 'LABEL.OPEN',
                                hardwareOrdersShipped: 'REPORTING.SHIPPED_LAST_THIRTY_DAYS',
                                billedPagesColor: 'REPORTING.COLOR_PAGES_COUNT',
                                billedPagesMono: 'REPORTING.MONO_PAGES_COUNT',
                                pagesBilledColor: 'REPORTING.COLOR',
                                pagesBilledMono: 'REPORTING.MONO',
                            },
                        },
                        grids: {
                            standard: {
                                translate: {
                                    h2: 'REPORTING.STANDARD_REPORTS_COUNT',
                                    fieldReportName: 'REPORTING.NAME'
                                }
                            },
                            other: {
                                translate: {
                                    h2: 'REPORTING.OTHER_REPORTS',
                                    fieldCreated: 'LABEL.CREATED',
                                    fieldTaggedAs: 'LABEL.TAGGED_AS',
                                    fieldFile: 'LABEL.FILE'
                                }
                            }
                        }
                    }
                };
            };

            function configureChartOptions() {
                $scope.chartOptions.pieChartOptions = {
                    backgroundColor: '#eff0f6',
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
                        text: 'percentage',
                        textStyle: {fontSize: 14}
                    }
                };
                $scope.chartOptions.columnChartOptions = {
                    backgroundColor: '#eff0f6',
                    fontName: 'tpHero',
                    legend: {
                        position: 'none'
                    },
                    title: '',
                    titlePosition: 'none',
                     tooltip: {
                        textStyle: {fontSize: 14}
                    }
                };
            }

            configureTemplates();
            configureChartOptions();

            var buildFleetAvailabilityChart = function(data) {
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
                            {v: $translate.instant($scope.configure.report.kpi.translate.fleetAvailability) },
                            {v: d.fleetAvailability },
                            {v: "#00ad21" }
                        ]}
                    ]};
            };

            var buildResponseTimeChart = function(data) {
                var d = {};

                for (var i = 0; i < data.stat.length; i++) {
                    d[data.stat[i].label] = data.stat[i].value;
                }

                $scope.chartObject.responseTime = {};
                $scope.chartObject.responseTime.type = "ColumnChart";
                $scope.chartObject.responseTime.options = angular.copy($scope.chartOptions.columnChartOptions);
                $scope.chartObject.responseTime.options.vAxis = { format: '#.#\'%\'', ticks: [0, 50, 100] };
                $scope.chartObject.responseTime.dataPoint = d.responseTime;

                $scope.chartObject.responseTime.data = {
                    "cols": [
                        {id: "t", label: "Response Time", type: "string"},
                        {id: "s", label: "Percent", type: "number" },
                        {role: "style", type: "string"}
                    ],
                    "rows": [
                        {c: [
                            {v: $translate.instant($scope.configure.report.kpi.translate.responseTime) },
                            {v: d.responseTime },
                            {v: "#1c64b4" }
                        ]}
                    ]};
            };

            var buildConsumablesChart = function(data) {
                var d = {};

                for (var i = 0; i < data.stat.length; i++) {
                    d[data.stat[i].label] = data.stat[i].value;
                }

                $scope.chartObject.consumables = {};
                $scope.chartObject.consumables.type = "ColumnChart";
                $scope.chartObject.consumables.options = angular.copy($scope.chartOptions.columnChartOptions);
                $scope.chartObject.consumables.options.vAxis = { format: '#.#\'%\'', ticks: [0, 50, 100] };
                $scope.chartObject.consumables.dataPoint = d.consumables;

                $scope.chartObject.consumables.data = {
                    "cols": [
                        {id: "t", label: "Fleet Availability", type: "string"},
                        {id: "s", label: "Percent", type: "number" },
                        {role: "style", type: "string"}
                    ],
                    "rows": [
                        {c: [
                            {v: $translate.instant($scope.configure.report.kpi.translate.consumables) },
                            {v: d.consumables },
                            {v: "#faa519" }
                        ]}
                    ]};
            };

            var buildAssetRegisterChart = function(data) {
                var total = 0;

                for (var i = 0; i < data.stat.length; i++) {
                    total += data.stat[i].value;
                }

                $scope.chartObject.assetRegister = {};
                $scope.chartObject.assetRegister.type = "PieChart";
                $scope.chartObject.assetRegister.options = angular.copy($scope.chartOptions.pieChartOptions);
                $scope.chartObject.assetRegister.options.height = 300;
                $scope.chartObject.assetRegister.options.slices = [{color: '#00ad21'}];
                //$scope.chartObject.assetRegister.options.fontSize = 36;
                $scope.chartObject.assetRegister.dataPoint = total;

                $scope.chartObject.assetRegister.data = {
                    "cols": [
                        {id: "t", label: "Assets", type: "string"},
                        {id: "s", label: "Count", type: "number"}
                    ],
                    "rows": [
                        {c: [
                            {v: $translate.instant($scope.configure.report.charts.translate.assetCount) },
                            {v: total }
                        ]}
                    ]};

            };

            var buildMADCChart = function(data) {
                var d = {};

                for (var i = 0; i < data.stat.length; i++) {
                    d[data.stat[i].label] = data.stat[i].value;
                }

                $scope.chartObject.madc = {};
                $scope.chartObject.madc.type = "ColumnChart";
                $scope.chartObject.madc.options = angular.copy($scope.chartOptions.columnChartOptions);
                $scope.chartObject.madc.dataPoint = d.moves + d.additions + d.ipChanges + d.decommissions + d.swaps;

                $scope.chartObject.madc.data = {
                    "cols": [
                        {id: "t", label: "MADC", type: "string"},
                        {id: "s", label: "Month", type: "number" },
                        {role: "style", type: "string"}
                    ],
                    "rows": [
                        {c: [
                            {v: $translate.instant($scope.configure.report.charts.translate.moves) },
                            {v: d.moves },
                            {v: "#00ad21" }
                        ]},
                        {c: [
                            {v: $translate.instant($scope.configure.report.charts.translate.additions) },
                            {v: d.additions },
                            {v: "#faa519" }
                        ]},
                        {c: [
                            {v: $translate.instant($scope.configure.report.charts.translate.ipChanges) },
                            {v: d.ipChanges },
                            {v: "#1c64b4" }
                        ]},
                        {c: [
                            {v: $translate.instant($scope.configure.report.charts.translate.decommissions) },
                            {v: d.decommissions },
                            {v: "#884fad" }
                        ]},
                        {c: [
                            {v: $translate.instant($scope.configure.report.charts.translate.swaps) },
                            {v: d.swaps },
                            {v: "#006446" }
                        ]}
                    ]};
                };

            var buildMissingMeterReadsChart = function(data) {
                var d = {};

                for (var i = 0; i < data.stat.length; i++) {
                    d[data.stat[i].label] = data.stat[i].value;
                }

                $scope.chartObject.missingMeterReadsAll = {};
                $scope.chartObject.missingMeterReadsAll.type = "PieChart";
                $scope.chartObject.missingMeterReadsAll.options = angular.copy($scope.chartOptions.pieChartOptions);
                $scope.chartObject.missingMeterReadsAll.options.slices = [{color: '#00ad21'}, {color: '#7e7e85'}];
                $scope.chartObject.missingMeterReadsAll.options.pieHole = 0.4;
                $scope.chartObject.missingMeterReadsAll.dataPoint = d.allSuccessful + d.allMissed;

                $scope.chartObject.missingMeterReadsAll.data = {
                    "cols": [
                        {id: "t", label: "Missing Meter Reads", type: "string"},
                        {id: "s", label: "Count", type: "number"}
                    ],
                    "rows": [
                        {c: [
                            {v: $translate.instant($scope.configure.report.charts.translate.successfulReads) },
                            {v: d.allSuccessful }
                        ]},
                        {c: [
                            {v: $translate.instant($scope.configure.report.charts.translate.missedReads) },
                            {v: d.allMissed }
                        ]}
                    ]};

                $scope.chartObject.missingMeterReadsMissed = {};
                $scope.chartObject.missingMeterReadsMissed.type = "PieChart";
                $scope.chartObject.missingMeterReadsMissed.options = angular.copy($scope.chartOptions.pieChartOptions);
                $scope.chartObject.missingMeterReadsMissed.options.slices = [{color: '#7e7e85'}, {color: '#000'}];
                $scope.chartObject.missingMeterReadsMissed.options.pieHole = 0.4;
                $scope.chartObject.missingMeterReadsMissed.dataPoint = d.automatedMmr + d.manualMmr;

                $scope.chartObject.missingMeterReadsMissed.data = {
                    "cols": [
                        {id: "t", label: "Missing Meter Reads", type: "string"},
                        {id: "s", label: "Count", type: "number"}
                    ],
                    "rows": [
                        {c: [
                            {v: $translate.instant($scope.configure.report.charts.translate.autoCount, {autoCount: d.allAssets}) },
                            {v: d.automatedMmr }
                        ]},
                        {c: [
                            {v: $translate.instant($scope.configure.report.charts.translate.manualCount, {manualCount: d.allAssets}) },
                            {v: d.manualMmr }
                        ]}
                    ]};
            };

            var buildConsumablesOrdersChart = function(data) {
                var d = {};

                for (var i = 0; i < data.stat.length; i++) {
                    d[data.stat[i].label] = data.stat[i].value;
                }

                $scope.chartObject.consumablesOrdersOpen = {};
                $scope.chartObject.consumablesOrdersOpen.type = "PieChart";
                $scope.chartObject.consumablesOrdersOpen.options = angular.copy($scope.chartOptions.pieChartOptions);
                $scope.chartObject.consumablesOrdersOpen.options.slices = [{color: '#00ad21'}];
                //$scope.chartObject.consumablesOrdersOpen.options.fontSize = 36;
                $scope.chartObject.consumablesOrdersOpen.dataPoint = d.Open;

                $scope.chartObject.consumablesOrdersOpen.data = {
                    "cols": [
                        {id: "t", label: "Consumables Orders", type: "string"},
                        {id: "s", label: "Count", type: "number"}
                    ],
                    "rows": [
                        {c: [
                            {v: $translate.instant($scope.configure.report.charts.translate.consumablesOrdersOpen) },
                            {v: d.Open }
                        ]}
                    ]};

                $scope.chartObject.consumablesOrdersShipped = {};
                $scope.chartObject.consumablesOrdersShipped.type = "PieChart";
                $scope.chartObject.consumablesOrdersShipped.options = angular.copy($scope.chartOptions.pieChartOptions);
                $scope.chartObject.consumablesOrdersShipped.options.slices = [{color: '#7e7e85'}];
                //$scope.chartObject.consumablesOrdersShipped.options.fontSize = 36;
                $scope.chartObject.consumablesOrdersShipped.dataPoint = d.Shipped;

                $scope.chartObject.consumablesOrdersShipped.data = {
                    "cols": [
                        {id: "t", label: "Consumables Orders", type: "string"},
                        {id: "s", label: "Count", type: "number"}
                    ],
                    "rows": [
                        {c: [
                            {v: $translate.instant($scope.configure.report.charts.translate.consumableOrdersShipped) },
                            {v: d.Shipped }
                        ]}
                    ]};
            };

            var buildHardwareOrdersChart = function(data) {
                var d = {};

                for (var i = 0; i < data.stat.length; i++) {
                    d[data.stat[i].label] = data.stat[i].value;
                }

                $scope.chartObject.hardwareOrdersOpen = {};
                $scope.chartObject.hardwareOrdersOpen.type = "PieChart";
                $scope.chartObject.hardwareOrdersOpen.options = angular.copy($scope.chartOptions.pieChartOptions);
                $scope.chartObject.hardwareOrdersOpen.options.slices = [{color: '#00ad21'}];
                //$scope.chartObject.hardwareOrdersOpen.options.fontSize = 36;
                $scope.chartObject.hardwareOrdersOpen.dataPoint = d.Open;

                $scope.chartObject.hardwareOrdersOpen.data = {
                    "cols": [
                        {id: "t", label: "Hadware Orders", type: "string"},
                        {id: "s", label: "Count", type: "number"}
                    ],
                    "rows": [
                        {c: [
                            {v: $translate.instant($scope.configure.report.charts.translate.hardwareOrdersOpen) },
                            {v: d.Open }
                        ]}
                    ]};

                $scope.chartObject.hardwareOrdersShipped = {};
                $scope.chartObject.hardwareOrdersShipped.type = "PieChart";
                $scope.chartObject.hardwareOrdersShipped.options = angular.copy($scope.chartOptions.pieChartOptions);
                $scope.chartObject.hardwareOrdersShipped.options.slices = [{color: '#7e7e85'}];
                //$scope.chartObject.hardwareOrdersShipped.options.fontSize = 36;
                $scope.chartObject.hardwareOrdersShipped.dataPoint = d.Shipped;

                $scope.chartObject.hardwareOrdersShipped.data = {
                    "cols": [
                        {id: "t", label: "Hardware Orders", type: "string"},
                        {id: "s", label: "Count", type: "number"}
                    ],
                    "rows": [
                        {c: [
                            {v: $translate.instant($scope.configure.report.charts.translate.hardwareOrdersShipped) },
                            {v: d.Shipped }
                        ]}
                    ]};
            };

            var buildPagesBilledChart = function(data) {
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
                            {v: $translate.instant($scope.configure.report.charts.translate.pagesBilledMono) },
                            {v: d.pagesBilledMono }
                        ]},
                        {c: [
                            {v: $translate.instant($scope.configure.report.charts.translate.pagesBilledColor) },
                            {v: d.pagesBilledColor }
                        ]}
                    ]};

            };

            var buildCharts = function() {
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
                                        /* Response Time */
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
                                        /* MADC */
                                        case 'mp9073':
                                            buildMADCChart(report.stats.data[0]);
                                            break;
                                        /* Missing Meter Reads */
                                        case 'mp0075':
                                            buildMissingMeterReadsChart(report.stats.data[0]);
                                            break;
                                        /* Consumables Orders */
                                        case 'mp0021':
                                            buildConsumablesOrdersChart(report.stats.data[0]);
                                            break;
                                        /* Hardware Orders */
                                        case 'hw0008':
                                            buildHardwareOrdersChart(report.stats.data[0]);
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
            },
            personal = new Personalize($location.url(), $rootScope.idpUser.id),
            Grid = new GridService();

            Reports.get({
                preventDefaultParams: true,
                params: {
                    page: 1,
                    size: 20
                }
            }).then(function() {
                var tmp = Reports.data,
                i = 0;

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

            $scope.gridOptions = {};
            $scope.gridOptions.onRegisterApi = Grid.getGridActions($rootScope, Documents, personal);
            $scope.gridOptions.showBookmarkColumn = false;

            Documents.columns = Documents.columnDefs['otherReports'];
            Documents.get({
                params: {
                    page: 0,
                    size: 20,
                    tag: 'reports'
                }
            }).then(function() {
                Grid.display(Documents, $scope, personal);
            });

            $scope.goToDocumentView = function(documentItem) {
                Documents.setItem(documentItem);

                $location.path(Documents.route + '/' + documentItem.id + '/view');
            };

            $scope.goToFinder = function(report) {
                Reports.setItem(report);

                $location.path(Reports.route + '/' + Reports.item.id + '/results');
            };

            $scope.goToFinderById = function(reportId) {
                for (var i = 0; i < $scope.reports.length; i++) {
                    if ($scope.reports[i].id === reportId) {
                        $scope.goToFinder($scope.reports[i]);
                    }
                }
            };
        }
    ]);
});
