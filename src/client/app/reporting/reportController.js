define(['angular', 'report', 'chart'], function(angular) {
    'use strict';
    angular.module('mps.report')
    .controller('ReportController', ['$scope', '$location', '$translate', 'Reports', 'grid',
        function($scope, $location, $translate, Reports, Grid) {

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
                                swaps: 'REPORTING.SWAPS'

                            },
                        },
                        grids: {
                            standard: {
                                translate: {
                                    h2: 'REPORTING.STANDARD_REPORTS',
                                    fieldReportName: 'REPOTING.NAME'
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
                    assetCount: [{
                        value: 1733,
                        color: '#00ad21',
                        label: $translate.instant($scope.configure.report.charts.translate.assetCount)
                    }],
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
                                fillColor: "#f00",
                                strokeColor: "#f01",
                                data: [475, 375, 250, 150, 50]
                            }
                        ]
                    }
                };
            };

            configureTemplates();
            configureFauxCharts();

            var buildCharts = function() {
                var i = 0,
                report;

                 for (i; i < $scope.reports.length; i += 1) {
                    report = Reports.createItem($scope.reports[i]);

                    report.stats.params.page = null;
                    report.stats.params.size = null;

                    // making sure we call only the working stats endpoint. 
                    //should be removed when all are working
                    if (report.id === 'mp9058sp') {
                        (function(report) {
                            report.links.stats({
                                embeddedName: 'stats',
                            }).then(function(serverResponse) {
                                var j = 0,
                                results = [];
                                if (report.stats.data) {
                                    if (report.stats.data[0].stat.length > 0) {
                                        for (j; j < report.stats.data[0].stat.length; j += 1) {
                                            if (j === 0) {
                                                results.push({
                                                    value: report.stats.data[0].stat[j].value, 
                                                    color: '#F7464A', 
                                                    highlight: '#FF5A5E', 
                                                    label: report.stats.data[0].stat[j].label
                                                });
                                            } else if (j === 1) {
                                                results.push({
                                                    value: report.stats.data[0].stat[j].value, 
                                                    color: '#46BFBD', 
                                                    highlight: '#5AD3D1', 
                                                    label: report.stats.data[0].stat[j].label
                                                });
                                            } else {
                                                results.push({
                                                    value: report.stats.data[0].stat[j].value, 
                                                    color: '#FDB45C', 
                                                    highlight: '#FFC870', 
                                                    label: report.stats.data[0].stat[j].label
                                                });
                                            }
                                        }

                                        $scope[report.id] = {};
                                        $scope[report.id].report = report;
                                        $scope[report.id].chart = results;
                                    }
                                }
                            });
                        }(report));
                    }
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
