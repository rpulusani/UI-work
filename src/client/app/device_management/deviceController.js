'use strict';
angular.module('mps.deviceManagement')
.controller('DeviceController', ['$scope',
    '$location',
    'Devices',
    'SecurityHelper',
    '$routeParams',
    '$rootScope',
    function($scope,
        $location,
        Device,
        SecurityHelper,
        $routeParams,
        $rootScope
        ) {

        $scope.isActive = function(tabId){
           return tabId === $rootScope.currentDeviceTab;
        };
        $scope.onClickTb = function(tab){
            $rootScope.currentDeviceTab = tab;
            $location.search('tab', tab);
        };
        var tabId = $location.search().tab;
        if(tabId){
            $rootScope.currentDeviceTab = tabId;
            $scope.isActive(tabId);
        }else{
            $scope.isActive('deviceInfoTab');
        }
    }
]);
