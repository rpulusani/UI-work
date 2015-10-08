define(['angular', 'deviceServiceRequest'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestDevices')
    .controller('DeviceAddController', ['$scope', '$location', '$routeParams', '$rootScope',
        function($scope, $location, $routeParams, $rootScope) {
            
            $scope.device = {};
            $scope.device.selectedDevice = {};
            $scope.device.selectedContact = {};
            
            /* Remove this varibale after real call and getting the list of products
               based on serial number */
            $scope.productNumbers = [{id: 1, name: 'Product 1'}, {id: 2, name: 'Product 2'}, {id: 3, name: 'Product 3'}];

            if ($rootScope.newDevice !== undefined && $routeParams.return) {
                $scope.device = $rootScope.newDevice;
            }

            if ($rootScope.currentRowList !== undefined && $rootScope.currentRowList.length === 1) {
                if($rootScope.currentRowList[0].entity.serialNumber !== undefined) {
                    $scope.device.selectedDevice = $rootScope.currentRowList[0].entity;
                } else {
                    $scope.device.selectedContact = $rootScope.currentRowList[0].entity;
                }
            }

            $scope.goToBrowse = function(device) {
                $rootScope.newDevice = device;
                $location.path('/device_management/pick_device');
            };

            $scope.goToContactPicker = function(device) {
                $rootScope.newDevice = device;
                $location.path('/service_requests/devices/pick_contact');
            };

            $scope.isDeviceSelected = function(){
                if ($rootScope.currentRowList !== undefined && $rootScope.currentRowList.length === 1) {
                    return true;
                } else {
                    return false;
                }
            };
        }
    ]);
});
