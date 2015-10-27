define(['angular', 'report', 'utility.grid', 'pdfmake'], function(angular) {
    'use strict';
    angular.module('mps.report')
    .controller('ReportListController', ['$scope', '$location', 'grid', 'Reports', '$rootScope',
        'PersonalizationServiceFactory', '$filter',
        function($scope, $location, Grid, Reports, $rootScope, Personalize, $filter) {
            var personal = new Personalize($location.url(), $rootScope.idpUser.id);

            if (!Reports.category) {
                $location.path(Reports.route);
            }

            $scope.category = Reports.category;
            $scope.gridOptions = {};
            $scope.gridOptions.onRegisterApi = Grid.getGridActions($rootScope, Reports, personal);
            $scope.gridOptions.enableGridMenu = true;
            $scope.gridOptions.enableSelectAll = false;
            $scope.gridOptions.enableRowSelection = false;
            $scope.exporterPdfOrientation =  'landscape';
            $scope.exporterPdfPageSize = 'TABLOID';
            $scope.gridOptions.showBookmarkColumn = false;

            $scope.additionalParams = [
                {
                    name: 'eventType',
                    value: $rootScope.finder ? $rootScope.finder.eventType : ""
                },
                {
                    name: 'eventDateFrom',
                    value:  $rootScope.finder? $filter('date')($rootScope.finder.dateFrom, "yyyy-MM-dd") : ""
                },
                {
                    name: 'eventDateTo',
                    value: $rootScope.finder ? $filter('date')($rootScope.finder.dateTo, "yyyy-MM-dd") : ""
                }
            ];

            Reports.getPage(0, 20,$scope.additionalParams).then(function() {
                Grid.display(Reports, $scope, personal);
            }, function(reason) {
                NREUM.noticeError('Grid Load Failed for ' + Reports.serviceName +  ' reason: ' + reason);
            });

        }

    ]);
});
