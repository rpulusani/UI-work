define(['angular', 'report', 'googlecharting'], function(angular) {
    'use strict';
    angular.module('mps.report')
    .controller('ReportController', ['$scope', '$location', '$translate', 'Reports', 'grid',
        function($scope, $location, $translate, Reports, Grid) {

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
                                successfulReadsPercent: 'REPORTING.SUCCESSFUL_READS_PERCENT',
                                missedReadsPercent: 'REPORTING.MISSED_READS_PERCENT',
                                autoCount: 'REPORTING.AUTO_COUNT',
                                manualCount: 'REPORTING.MANUAL_COUNT',
                                consumablesOrdersOpen: 'LABEL.OPEN',
                                consumablesOrdersShipped: 'REPORTING.SHIPPED_LAST_THIRTY_DAYS',
                                hardwareOrdersOpen: 'LABEL.OPEN',
                                hardwareOrdersShipped: 'REPORTING.SHIPPED_LAST_THIRTY_DAYS',
                                billedPagesColor: 'REPORTING.COLOR_PAGES_COUNT',
                                billedPagesMono: 'REPORTING.MONO_PAGES_COUNT'
                            },
                        },
                        grids: {
                            standard: {
                                translate: {
                                    h2: 'REPORTING.STANDARD_REPORTS',
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

            function configureFauxCharts() {
                $scope.fauxCharts = {
                    madcEvents: {
                        labels: [
                            $translate.instant($scope.configure.report.charts.translate.moves),
                            $translate.instant($scope.configure.report.charts.translate.additions),
                            $translate.instant($scope.configure.report.charts.translate.ipChanges),
                            $translate.instant($scope.configure.report.charts.translate.decommissions),
                            $translate.instant($scope.configure.report.charts.translate.swaps)
                            ],
                        datasets: [
                            {
                                fillColor: "#00ad21",
                                strokeColor: "#00ad21",
                                data: [475, 375, 250, 150, 50]
                            }
                        ]
                    },
                    meterReadsAll: [{
                        value: 97,
                        color: '#00ad21',
                        label: $translate.instant($scope.configure.report.charts.translate.successfulReadsPercent, { successPercent: 97 })
                    },
                    {
                        value: 3,
                        color: '#00ad21',
                        label: $translate.instant($scope.configure.report.charts.translate.missedReadsPercent, { missedPercent: 3, assetCount: 254 })
                    }],
                    meterReadsMissed: [{
                        value: 1,
                        color: '#00ad21',
                        label: $translate.instant($scope.configure.report.charts.translate.autoCount, { autoCount: 1 })
                    },
                    {
                        value: 253,
                        color: '#00ad21',
                        label: $translate.instant($scope.configure.report.charts.translate.manualCount, { manualCount: 253 })
                    }],
                    billedPages: [{
                        value: 10652,
                        color: '#faa519',
                        label: $translate.instant($scope.configure.report.charts.translate.billedPagesColor, { autoCount: 10652 })
                    },
                    {
                        value: 311941,
                        color: '#7e7e85',
                        label: $translate.instant($scope.configure.report.charts.translate.billedPagesMono, { manualCount: 311941 })
                    }]
                };
            };

            function configureChartOptions() {
                $scope.chartOptions.pieChartOptions = {
                    backgroundColor: '#eff0f6',
                    enableInteractivity: true,
                    title: '',
                    titlePosition: 'none',
                    pieSliceText: 'value',
                    legend: {
                        position: 'none'
                    }
                };
            };

            configureTemplates();
            configureFauxCharts();
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
                $scope.chartObject.assetRegister.optSize = total;

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

            var buildMissingMeterReadsChart = function(data) {
                var d = {};

                // iterate over array, zero is missed, one is all.
                for (var i = 0; i < data.length; i++) {
                    d[i] = {};

                    for (var j = 0; j < data[i].stat.length; j++) {
                        d[i][data[i].stat[j].label] = data[i].stat[j].value;
                    }
                    console.log(d[i]);
                }
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
                $scope.chartObject.consumablesOrdersOpen.optSize = d.Open; 

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
                $scope.chartObject.consumablesOrdersShipped.optSize = d.Shipped;

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
                $scope.chartObject.hardwareOrdersOpen.optSize = d.Open;

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
                $scope.chartObject.hardwareOrdersShipped.optSize = d.Shipped;

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
                                            break;
                                        /* Missing Meter Reads */
                                        case 'mp0075':
                                            buildMissingMeterReadsChart(report.stats.data);
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

            if (!$scope.reports.length) {
                Reports.getPage().then(function() {
                   $scope.reports = Reports.data;

                    buildCharts();
                });
            } else {
                buildCharts();
            }

            $scope.goToFinder = function(report) {
                Reports.setItem(report);

                if (Reports.item.name === 'MADC') {
                    $location.path(Reports.route + '/' + Reports.item.id + '/find');
                } else {
                    $scope.runReport(report);
                }
            };

            $scope.goToFinderById = function(reportId) {
                for (var i = 0; i < $scope.reports.length; i++) {
                    if ($scope.reports[i].id === reportId) {
                        $scope.goToFinder($scope.reports[i]);
                    }
                }
            };

            $scope.runReport = function(report) {
                Reports.finder = $scope.finder;
                
                Reports.setItem(report);
                
               $location.path(Reports.route + '/results');
            };
        }
    ]);
});
