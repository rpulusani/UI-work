define(['angular', 'report', 'utility.grid', 'pdfmake'], function(angular) {
    'use strict';
    angular.module('mps.report')
    .controller('ReportListController', ['$scope', '$location', 'grid', 'Reports', '$rootScope',
        'PersonalizationServiceFactory', '$filter',
        function($scope, $location, Grid, Reports, $rootScope, Personalize, $filter) {
            var personal = new Personalize($location.url(), $rootScope.idpUser.id);

            if ($rootScope.currentUser.item) {
                Reports.reportParams = [{
                        name: 'accountId',
                        value: $rootScope.currentUser.item.accounts[0].accountId
                    }, {
                        name: 'accountLevel',
                        value: $rootScope.currentUser.item.accounts[0].level
                    }, {
                        name: 'eventType',
                        value: Reports.finder ? Reports.finder.eventType : ''
                    }, {
                        name: 'eventDateFrom',
                        value:  Reports.finder ? $filter('date')(Reports.finder.dateFrom, 'yyyy-MM-dd') : ''
                    }, {
                        name: 'eventDateTo',
                        value: Reports.finder ? $filter('date')(Reports.finder.dateTo, 'yyyy-MM-dd') : ''
                }];
            }

            if (!Reports.item) {
                $location.path(Reports.route);
            }

            $scope.category = Reports.item;
            $scope.gridOptions = {};
            $scope.gridOptions.onRegisterApi = Grid.getGridActions($rootScope, Reports, personal);
            $scope.gridOptions.enableGridMenu = true;
            $scope.gridOptions.enableSelectAll = false;
            $scope.gridOptions.enableRowSelection = false;
            $scope.exporterPdfOrientation =  'landscape';
            $scope.exporterPdfPageSize = 'TABLOID';
            $scope.gridOptions.showBookmarkColumn = false;

            if (Reports.item) {
                Reports.columns = 'columns_' + Reports.item.id;
            }

            Reports.getReport().then(function() {
                Reports.gridData = 'results';
                Grid.display(Reports, $scope, personal);
            }, function(reason) {
                NREUM.noticeError('Grid Load Failed for ' + Reports.serviceName +  ' reason: ' + reason);
            });
        }
    ]);
});
