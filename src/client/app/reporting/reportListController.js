define(['angular', 'report', 'utility.grid', 'pdfmake'], function(angular) {
    'use strict';
    angular.module('mps.report')
    .controller('ReportListController', ['$scope', '$location', 'grid', 'Reports', '$rootScope',
        'PersonalizationServiceFactory',
        function($scope, $location, Grid, Reports, $rootScope, Personalize) {
            var personal = new Personalize($location.url(), $rootScope.idpUser.id);

            $rootScope.currentRowList = [];

            $scope.gridOptions = {};
            $scope.gridOptions.onRegisterApi = Grid.getGridActions($rootScope, Reports, personal);

            Reports.getPage().then(function() {
                console.log(Reports.data);
                //Grid.display(Reports, $scope, personal);
            }, function(reason) {
                NREUM.noticeError('Grid Load Failed for ' + Reports.serviceName +  ' reason: ' + reason);
            });
        }
    ]);
});
