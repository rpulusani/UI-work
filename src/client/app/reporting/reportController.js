define(['angular', 'report', 'chart'], function(angular) {
    'use strict';
    angular.module('mps.report')
    .controller('ReportController', ['$scope', '$location', '$translate', 'Reports', 'grid',
        function($scope, $location, $translate, Reports, Grid) {

            $scope.chartData = {};

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
                                consumableOrdersOpen: 'LABEL.OPEN',
                                consumableOrdersShipped: 'REPORTING.SHIPPED_LAST_THIRTY_DAYS',
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
                    }],
                };
            };

            configureTemplates();
            configureFauxCharts();

            var buildAssetRegisterChart = function(data) {
                var total = 0;

                for (var i = 0; i < data.stat.length; i++) {
                    total += data.stat[i].value;
                }

                $scope.chartData.assetRegister = [{
                    value: total,
                    color: '#00ad21',
                    label: $translate.instant($scope.configure.report.charts.translate.assetCount)
                }];
            };

            var buildConsumablesOrdersChart = function(data) {
                var d = {};

                for (var i = 0; i < data.stat.length; i++) {
                    d[data.stat[i].label] = data.stat[i].value;
                }

                $scope.chartData.consumableOrdersOpen = [{
                    value: d.Open,
                    color: '#00ad21',
                    label: $translate.instant($scope.configure.report.charts.translate.consumableOrdersOpen)
                }];

                $scope.chartData.consumableOrdersShipped = [{
                    value: d.Shipped,
                    color: '#7e7e85',
                    label: $translate.instant($scope.configure.report.charts.translate.consumableOrdersShipped)
                }];
            };

            var buildHardwareOrdersChart = function(data) {
                var d = {};

                for (var i = 0; i < data.stat.length; i++) {
                    d[data.stat[i].label] = data.stat[i].value;
                }

                $scope.chartData.hardwareOrdersOpen = [{
                    value: d.Open,
                    color: '#00ad21',
                    label: $translate.instant($scope.configure.report.charts.translate.hardwareOrdersOpen)
                }];

                $scope.chartData.hardwareOrdersShipped = [{
                    value: d.Shipped,
                    color: '#7e7e85',
                    label: $translate.instant($scope.configure.report.charts.translate.hardwareOrdersShipped)
                }];

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
                Reports.getPage({
                    params: {
                        page: 1,
                        hello: 'world'
                    }
                }).then(function() {
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

            $scope.runReport = function(report) {
                Reports.finder = $scope.finder;
                
                Reports.setItem(report);
                
               $location.path(Reports.route + '/results');
            };
        }
    ]);
});
