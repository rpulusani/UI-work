define(['angular', 'report', 'googlecharting'], function(angular) {
    'use strict';
    angular.module('mps.report')
    .controller('ReportController', ['$scope', '$location', '$translate', 'Reports', 'grid', '$rootScope', 'PersonalizationServiceFactory',
        function($scope, $location, $translate, Reports, Grid, $rootScope, Personalize) {

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
                                h2: 'REPORTING.FLEET_AVAILABILITY',
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
                    fontName: 'tpHero',
                    title: '',
                    titlePosition: 'none',
                    pieSliceText: 'value',
                    legend: {
                        position: 'none'
                    }
                };
                $scope.chartOptions.columnChartOptions = {
                    backgroundColor: '#eff0f6',
                    fontName: 'tpHero',
                    title: '',
                    titlePosition: 'none'
                };
            };

            configureTemplates();
            configureChartOptions();

            var buildAssetRegisterChart = function(data) {
                var total = 0;

                for (var i = 0; i < data.stat.length; i++) {
                    total += data.stat[i].value;
                }

                $scope.chartObject.assetRegister = {};
                $scope.chartObject.assetRegister.type = "PieChart";
                $scope.chartObject.assetRegister.options = angular.copy($scope.chartOptions.pieChartOptions);
                $scope.chartObject.assetRegister.options.slices = [{color: '#00ad21'}];
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

                $scope.chartObject.mADC = {};
                $scope.chartObject.mADC.type = "ColumnChart";
                $scope.chartObject.mADC.options = angular.copy($scope.chartOptions.columnChartOptions);
                $scope.chartObject.mADC.dataPoint = 1;

                $scope.chartObject.mADC.data = {
                    "cols": [
                        {id: "t", label: "MADC", type: "string"},
                        {id: "s", label: "Month", type: "number" }
                    ],
                    "rows": [
                        {c: [
                            {v: $translate.instant($scope.configure.report.charts.translate.moves) },
                            {v: d.moves }
                        ]},
                        {c: [
                            {v: $translate.instant($scope.configure.report.charts.translate.additions) },
                            {v: d.additions }
                        ]},
                        {c: [
                            {v: $translate.instant($scope.configure.report.charts.translate.ipChanges) },
                            {v: d.ipChanges }
                        ]},
                        {c: [
                            {v: $translate.instant($scope.configure.report.charts.translate.decommissions) },
                            {v: d.decommissions }
                        ]},
                        {c: [
                            {v: $translate.instant($scope.configure.report.charts.translate.swaps) },
                            {v: d.swaps }
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
                $scope.chartObject.missingMeterReadsAll.dataPoint = 1; 

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
                $scope.chartObject.missingMeterReadsMissed.dataPoint = 1; 

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
                $scope.chartObject.pagesBilled.options.slices = [{color: '#7e7e85'}, {color: '#faa519'}];
                $scope.chartObject.pagesBilled.options.pieHole = 0.4;
                $scope.chartObject.pagesBilled.dataPoint = 1; 

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

                 for (var i = 0; i < $scope.reports.length; i++) {
                    report = Reports.createItem($scope.reports[i]);

                    report.stats.params.page = null;
                    report.stats.params.size = null;

                        (function(report) {
                            report.links.stats({
                                embeddedName: 'stats',
                            }).then(function(serverResponse) {

                                if (report.stats.data[0]) {
                                    switch (report.id) {
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
                                        /* Hardware Installation Requests */
                                        case 'hw0015':
                                            break;
                                        /* Service Detail Report */
                                        case 'sd0101':
                                            break;
                                        default:
                                    }
                                }
                            });
                        }(report));
                    }
            };

            $scope.finder = Reports.finder;
            $scope.reports = Reports.data;
            $scope.report = Reports.item;

            var personal = new Personalize($location.url(),$rootScope.idpUser.id);
            $scope.gridOptions = {};
            $scope.gridOptions.onRegisterApi = Grid.getGridActions($rootScope, Reports, personal);

           if (!$scope.reports.length) {
                Reports.getPage().then(function() {
                    $scope.reports = Reports.data;
                    buildCharts();

                    Grid.display(Reports, $scope, personal);
                }, function(reason) {
                    NREUM.noticeError('Grid Load Failed for ' + Reports.serviceName +  ' reason: ' + reason);
                });
            } else {
                buildCharts();
            }

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
