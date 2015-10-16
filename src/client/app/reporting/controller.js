define(['angular', 'report', 'utility.gridService'], function(angular) {
    'use strict';
    angular.module('mps.report')
    .controller('ReportController', ['$scope', '$location', '$routeParams', 'History', 'Report',  'gridService', '$rootScope', '$q',
        function($scope, $location, $routeParams, History, Report, GridService, $rootScope, $q) {
            $scope.reports = Report.reports;
            $scope.groups = Report.groups;
            $scope.categories = Report.categories;
            $scope.catagory = "";
            $scope.categoryDesc = "";

            $rootScope.currentAccount = '1-11JNK1L';
            $rootScope.currentRowList = [];

            $scope.toRunReport = false;
            $scope.back = function() {
                History.back();
            };

            $scope.cancel = function(){
                redirect_to_list();
            };

            var redirect_to_list = function() {
                $location.path('/reporting');
            };

            $scope.reportByCategory = function(definitionId) {
                Report.getByDefinitionId(definitionId, function() {
                    $scope.reports = Report.reports;
                });
            };

            $scope.goToReportByCategory = function(definitionId) {
                $location.path('/reporting/' + definitionId + '/view');
            };

            $scope.goToRun = function() {
                $scope.toRunReport = true;
            };

            $scope.runReport = function(definitionId) {
                var fd = new FormData(document.getElementsByName('newReport')[0]);
                Report.save(fd, function(report) {
                    Report.reports = [];
                    $scope.reports = Report.reports;
                    $scope.toRunReport = false;
                    //redirect_to_list();
                    //TODO:
                    //$rootScope.category = Report.category;
                    $location.path('/reporting/view');
                });
            };

            $scope.removeReport = function(id) {
                Report.removeById(id, function() {
                    if (Report.reports.length === 0) {
                        $scope.reports = [];
                    }
                });
            };

            if (Report.groups.length === 0) {
                Report.query(function() {
                    $scope.groups = Report.groups;
                });
            }

            if (Report.categories.length === 0) {
                Report.getCategoryList(function() {
                    $scope.categories = Report.categories;
                });
            }

            if ($routeParams.definitionId) {
                Report.getByDefinitionId($routeParams.definitionId, function() {
                    $scope.reports = Report.reports;
                });
                Report.getById($routeParams.definitionId, function() {
                    $scope.category = Report.category;
                });
                $scope.currentDate = new Date();
            }

            /* grid configuration */
            $scope.gridOptions =  {
                enableGridMenu: true,
                enableSelectAll: true,
                exporterCsvFilename: 'mp9073.csv',
                /*
                exporterPdfDefaultStyle: {fontSize: 9},
                exporterPdfTableStyle: {margin: [30, 30, 30, 30]},
                exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
                exporterPdfHeader: { text: "My Header", style: 'headerStyle' },
                /*
                exporterPdfFooter: function ( currentPage, pageCount ) {
                    return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
                },


                exporterPdfCustomFormatter: function ( docDefinition ) {
                    docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
                    docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
                    return docDefinition;
                },
                */
                exporterPdfOrientation: 'portrait',
                exporterPdfPageSize: 'LETTER',
                exporterPdfMaxGridWidth: 500,
                exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
            };

            $scope.gridOptions.onRegisterApi = GridService.getGridActions($rootScope, Report);
            GridService.getGridOptions(Report, '').then(
                function(options){
                    $scope.gridOptions = options;
                    $scope.pagination = GridService.pagination(Report, $rootScope);
                    $scope.itemsPerPage = Report.getPersonalizedConfiguration('itemsPerPage');
                    var params =[
                        {
                            name: 'size',
                            value: $scope.itemsPerPage
                        },
                        {
                            page: 'page',
                            value: 0
                        }
                    ];

                    Report.resource(params).then(
                        function(response){
                            $scope.gridOptions.data = Report.getList();
                        }
                    );
                },
                function(reason){
                     NREUM.noticeError('Grid Load Failed: ' + reason);
                }
            );
        }
    ]);
});
