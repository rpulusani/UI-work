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
                 Reports.columns = Reports.item.id;
            }

            // if this report has an associated eventType from the finder form add these
            // parameters to the next call.
            if (Report.finder.eventType) {
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
            
            $scope.category = Reports.item;

            // Setting up the grid
            $scope.gridOptions = {};
            $scope.gridOptions.onRegisterApi = Grid.getGridActions($rootScope, Reports, personal);
            $scope.gridOptions.enableGridMenu = true;
            $scope.gridOptions.enableSelectAll = false;
            $scope.gridOptions.enableRowSelection = false;
            $scope.exporterPdfOrientation =  'landscape';
            $scope.exporterPdfPageSize = 'TABLOID';
            $scope.gridOptions.showBookmarkColumn = false;

            Reports.item.self().then(function(res) {
                console.log('HERE!')
                Grid.display(Reports, $scope, personal);
            }, function(reason) {
                NREUM.noticeError('Grid Load Failed for ' + Reports.serviceName +  ' reason: ' + reason);
            });
        }
    ]);
});
