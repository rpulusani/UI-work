define(['angular', 'deviceManagement', 'deviceManagement.deviceFactory'], function(angular) {
    'use strict';
    angular.module('mps.deviceManagement')
    .controller('DeviceController', ['$scope',
        '$location',
        'Devices',
        'SecurityHelper',
        function($scope,
            $location,
            Device,
            SecurityHelper
            ) {

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
