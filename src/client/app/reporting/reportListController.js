define(['angular', 'report', 'utility.grid', 'pdfmake'], function(angular) {
    'use strict';
    angular.module('mps.report')
    .controller('ReportListController', ['$scope', '$location', 'grid', 'Reports', '$rootScope',
        'PersonalizationServiceFactory', '$filter',
        function($scope, $location, Grid, Reports, $rootScope, Personalize, $filter) {
            var personal = new Personalize($location.url(), $rootScope.idpUser.id),
            params;

            // if we have an item switch to a column set that shares its id
            if (!Reports.item) {
                $location.path(Reports.route);
            } else {
                $scope.category = Reports.item;

                // if this report has an associated eventType from the finder form add these
                // parameters to the next call.
                if (Reports.finder.eventType) {
                    params = [{
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

                // Setting up the grid
                $scope.gridOptions = {};
                $scope.gridOptions.onRegisterApi = Grid.getGridActions($rootScope, Reports, personal);
                $scope.gridOptions.enableGridMenu = true;
                $scope.gridOptions.enableSelectAll = false;
                $scope.gridOptions.enableRowSelection = false;
                $scope.exporterPdfOrientation =  'landscape';
                $scope.exporterPdfPageSize = 'TABLOID';
                $scope.gridOptions.showBookmarkColumn = false;

                Reports.item.links.results({
                    serviceName: 'results',
                    embeddedName: 'reportData',
                    columns: Reports.item.id,
                    columnsDefs: Reports.columnsDefs
                }).then(function(res) {
                    console.log('123');
                    Grid.display(Reports.item.results, $scope, personal);
                }, function(reason) {
                    NREUM.noticeError('Grid Load Failed for ' + Reports.serviceName +  ' reason: ' + reason);
                });
            }
        }
    ]);
});
