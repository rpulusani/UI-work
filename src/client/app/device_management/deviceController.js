define(['angular', 'deviceManagement', 'deviceManagement.deviceFactory'], function(angular) {
    'use strict';
    angular.module('mps.deviceManagement')
    .controller('DeviceController', ['$scope',
        '$location',
        'Devices',
        'SecurityService',
        'permissionSet',
        function($scope,
            $location,
            Device,
            SecurityService,
            permissionSet) {
            $scope.security = new SecurityService();
            $scope.pageCountAccess = false;
            $scope.serviceHistoryAccess = false;
            $scope.openOrderAccess = false;
            $scope.deviceInfoAccess = false;
            $scope.security.isAllowed(permissionSet.deviceManagement.updatePageCount).then(function(passed){
                $scope.pageCountAccess  = passed;
            });
            $scope.security.isAllowed(permissionSet.deviceManagement.viewSRHistory).then(function(passed){
                $scope.serviceHistoryAccess = passed;
            });
            $scope.security.isAllowed(permissionSet.deviceManagement.viewOpenOrders).then(function(passed){
                $scope.openOrderAccess = passed;
            });
            $scope.security.isAllowed(permissionSet.deviceManagement.view).then(function(passed){
                $scope.deviceInfoAccess = passed;
            });

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
