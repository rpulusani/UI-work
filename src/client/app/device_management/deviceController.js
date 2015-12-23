define(['angular', 'deviceManagement', 'deviceManagement.deviceFactory'], function(angular) {
    'use strict';
    angular.module('mps.deviceManagement')
    .controller('DeviceController', ['$scope',
        '$location',
        'Devices',
        'SecurityHelper',
        'permissionSet',
        function($scope,
            $location,
            Device,
            SecurityHelper,
            permissionSet) {

            var configurePermissions = [
                {
                    name: 'deviceInfoAccess',
                    permission: permissionSet.deviceManagement.view
                },
                {
                    name: 'pageCountAccess',
                    permission: permissionSet.deviceManagement.updatePageCount
                },
                {
                    name: 'serviceHistoryAccess',
                    permission: permissionSet.serviceRequestManagement.viewBreakFix
                },
                {
                    name: 'openOrderAccess',
                    permission: permissionSet.deviceManagement.viewOpenOrders
                }
            ];

            new SecurityHelper($scope).setupPermissionList(configurePermissions);

            $scope.goToReview = function(device) {
                $location.path('/device_management/' + device.id + '/review');
            };
            $scope.currentTab = "deviceInfoTab";
            $scope.isActive = function(tabId){
               return tabId === $scope.currentTab;
            };
            $scope.onClickTb = function(tab){
                $scope.currentTab = tab;
            };
        }
    ]);
});
