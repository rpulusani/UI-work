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
            $scope.security = SecurityService;
            $scope.permissions = permissionSet;
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
