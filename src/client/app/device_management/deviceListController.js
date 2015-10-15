define(['angular', 'deviceManagement', 'deviceManagement.deviceFactory'], function(angular) {
    'use strict';
    angular.module('mps.deviceManagement')
    .controller('DeviceListController', ['$scope', '$location', 'grid', 'Devices', '$rootScope',
        function($scope, $location, Grid, Devices, $rootScope) {
            $rootScope.currentAccount = '1-21AYVOT';
            $rootScope.currentRowList = [];

            $scope.goToCreate = function() {
                $location.path('/service_requests/devices/new');
            };

            $scope.gridOptions = {};
            $scope.gridOptions.onRegisterApi = Grid.getGridActions($rootScope, Devices);
            Devices.getList().then(function() {
                Grid.display(Devices, $scope);
            }, function(reason) {
                NREUM.noticeError('Grid Load Failed for ' + Devices.serviceName +  ' reason: ' + reason);
            });
        }
    ]);
});
