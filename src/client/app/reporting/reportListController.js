define(['angular', 'report', 'utility.grid', 'pdfmake'], function(angular) {
    'use strict';
    angular.module('mps.report')
    .controller('ReportListController', ['$scope', '$location', 'grid', 'Reports', '$rootScope',
        'PersonalizationServiceFactory', '$filter',
        function($scope, $location, GridService, Reports, $rootScope, Personalize, $filter) {
            var personal = new Personalize($location.url(), $rootScope.idpUser.id);
            var params = {};

            if (Reports.item === null) {
                $location.path(Reports.route);
            } else {
                $scope.report = Reports.item;

                configureTemplates();
                configureFinderType();

                // Setting up the grid
                var Grid = new GridService();
                $scope.gridOptions = {};
                $scope.gridOptions.onRegisterApi = Grid.getGridActions($rootScope, Reports, personal);
                $scope.gridOptions.enableGridMenu = true;
                $scope.gridOptions.exporterMenuPdf = false;
                $scope.gridOptions.exporterCsvFilename = $scope.report.name + '.csv';
                //$scope.exporterPdfOrientation =  'landscape';
                //$scope.exporterPdfPageSize = 'TABLOID';

                Reports.item.links.results({
                    serviceName: 'results',
                    embeddedName: 'reportData',
                    columns: Reports.item.id,
                    columnDefs: Reports.columnDefs,
                    params: params
                }).then(function(res) {
                    Grid.display(Reports.item.results, $scope, personal, false, function() {
                        $scope.$broadcast('setupPrintAndExport', $scope);
                    });
                }, function(reason) {
                    NREUM.noticeError('Grid Load Failed for ' + Reports.serviceName +  ' reason: ' + reason);
                });
            }

            function configureTemplates() {
                $scope.configure = {
                    header: {
                        translate: {
                            h1: 'REPORTING.RUN_TITLE',
                            h1Values: {'report': $scope.report.name },
                            body: 'MESSAGE.LIPSUM',
                        },
                    },
                };
            }

            function configureFinderType() {
                switch ($scope.report.id) {
                    /* Asset Register */
                    case 'mp9058sp':
                        /* NO FILTER */
                        break;
                    /* MADC */
                    case 'mp9073':
                        params = {
                            eventType: Reports.finder ? Reports.finder.selectType : '',
                            eventDateFrom: Reports.finder ? $filter('date')(Reports.finder.dateFrom, 'yyyy-MM-dd') : '',
                            eventDateTo: Reports.finder ? $filter('date')(Reports.finder.dateTo, 'yyyy-MM-dd') : ''
                        };
                        break;
                    /* Missing Meter Reads */
                    case 'mp0075':
                        params = {
                            meterSource: Reports.finder ? Reports.finder.selectType : '',
                            numberOfDays: Reports.finder ? Reports.finder.mmrDays : ''
                        };
                        break;
                    /* Consumables Orders */
                    case 'mp0021':
                        params = {
                            orderType: Reports.finder ? Reports.finder.selectType : '',
                            orderDateFrom: Reports.finder ? $filter('date')(Reports.finder.dateFrom, 'yyyy-MM-dd') : '',
                            orderDateTo: Reports.finder ? $filter('date')(Reports.finder.dateTo, 'yyyy-MM-dd') : ''
                        };
                        break;
                    /* Hardware Orders */
                    case 'hw0008':
                        params = {
                            orderDateFrom: Reports.finder ? $filter('date')(Reports.finder.dateFrom, 'yyyy-MM-dd') : '',
                            orderDateTo: Reports.finder ? $filter('date')(Reports.finder.dateTo, 'yyyy-MM-dd') : ''
                        };
                        break;
                    /* Pages Billed */
                    case 'pb0001':
                        params = {
                            dateFrom: Reports.finder ? $filter('date')(Reports.finder.dateFrom, 'yyyy-MM-dd') : '',
                            dateTo: Reports.finder ? $filter('date')(Reports.finder.dateTo, 'yyyy-MM-dd') : ''
                        };
                        break;
                    /* Hardware Installation Requests */
                    case 'hw0015':
                        params = {
                            dateFrom: Reports.finder ? $filter('date')(Reports.finder.dateFrom, 'yyyy-MM-dd') : '',
                            dateTo: Reports.finder ? $filter('date')(Reports.finder.dateTo, 'yyyy-MM-dd') : ''
                        };
                        break;
                    /* Service Detail Report */
                    case 'sd0101':
                        params = {
                            srStatus: Reports.finder ? Reports.finder.srStatus : '',
                            dateFrom: Reports.finder ? $filter('date')(Reports.finder.dateFrom, 'yyyy-MM-dd') : '',
                            dateTo: Reports.finder ? $filter('date')(Reports.finder.dateTo, 'yyyy-MM-dd') : '',
                            withParts: Reports.finder ? Reports.finder.withParts : '',
                        };
                        break;
                    default:
                        params = null;
                }
            }
        }
    ]);
});
