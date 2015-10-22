define(['angular', 'report', 'utility.grid', 'pdfmake'], function(angular) {
    'use strict';
    angular.module('mps.report')
    .controller('ReportController', ['$scope', '$location', '$routeParams', 'History', 'Report',  'ReportGroup', '$rootScope', '$q',
        '$filter', 'serviceUrl', 'UrlHelper', 'grid','PersonalizationServiceFactory',
        function($scope, $location, $routeParams, History, Report, ReportGroup, $rootScope, $q, $filter, serviceUrl, UrlHelper, Grid, Personalize) {

            var personal = new Personalize($location.url(), $rootScope.idpUser.id);

            var redirect_to_list = function() {
                $location.path('/reporting');
            };

            $scope.templateUrl = UrlHelper.report_template('view');

            $scope.reports = ReportGroup.reports;
            $scope.categories = ReportGroup.categories;
            $scope.catagory = "";

            $rootScope.currentAccount = '1-11JNK1L';
            $rootScope.currentRowList = [];

            $scope.toRunReport = false;
            $scope.back = function() {
                History.back();
            };

            $scope.cancel = function(){
                redirect_to_list();
            };

            $scope.reportByCategory = function(definitionId) {
                ReportGroup.getByDefinitionId(definitionId, function() {
                    $scope.reports = Report.reports;
                });
            };

            $scope.goToReportByCategory = function(definitionId) {
                $rootScope.reportParams = {};
                $rootScope.reportParams.eventTypes = ['Remove - Account', 'MC', 'Installs', 'Manual Swaps'];
                $location.path('/reporting/' + definitionId + '/view');
            };

            $scope.goToRun = function() {
                $scope.toRunReport = true;
            };

            $scope.runReport = function(reportParams) {
                $scope.toRunReport = false;
                $location.path('/reporting/view');
            };

            $scope.removeReport = function(id) {
                ReportGroup.removeById(id, function() {
                    if (ReportGroup.reports.length === 0) {
                        $scope.reports = [];
                    }
                });
            };

            if (ReportGroup.categories.length === 0) {
                ReportGroup.getCategoryList(function() {
                    $scope.categories = ReportGroup.categories;
                });
            }

            if ($routeParams.definitionId) {
                ReportGroup.getByDefinitionId($routeParams.definitionId, function() {
                    $scope.reports = ReportGroup.reports;
                });
                ReportGroup.getById($routeParams.definitionId, function() {
                    $scope.category = ReportGroup.category;
                });
                $scope.currentDate = new Date();
            }

            /* grid configuration */
            $scope.gridOptions =  {
                enableGridMenu: true,
                enableSelectAll: false,
                enableRowSelection: false,
                exporterCsvFilename: 'mp9073.csv',
                exporterPdfDefaultStyle: {fontSize: 9},
                exporterPdfTableStyle: {margin: [30, 30, 30, 30]},
                exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
                exporterPdfHeader: { text: "MADC (MP9073)", style: 'headerStyle' },
                exporterPdfFooter: function ( currentPage, pageCount ) {
                    return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
                },
                exporterPdfCustomFormatter: function ( docDefinition ) {
                    docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
                    docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
                    return docDefinition;
                },
                exporterPdfOrientation: 'landscape',
                exporterPdfPageSize: 'TABLOID',
                exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
            };

            $scope.gridOptions.onRegisterApi = Grid.getGridActions($rootScope, Report);

            $scope.additionalParams = [
                {
                    name: 'accountId',
                    value: '1-11JNK1L'
                },
                {
                    name: 'eventType',
                    value: $rootScope.reportParams ? $rootScope.reportParams.eventType : ""
                },
                {
                    name: 'eventDateFrom',
                    value:  $rootScope.reportParams? $filter('date')($rootScope.reportParams.eventDateFrom, "yyyy-MM-dd") : ""
                },
                {
                    name: 'eventDateTo',
                    value: $rootScope.reportParams ? $filter('date')($rootScope.reportParams.eventDateTo, "yyyy-MM-dd") : ""
                }
            ];

            Report.getPage(0,20,$scope.additionalParams).then(function() {
                Grid.display(Report, $scope, personal);
            }, function(reason) {
                NREUM.noticeError('Grid Load Failed for ' + UserService.serviceName +  ' reason: ' + reason);
            });

        }

    ]);
});
