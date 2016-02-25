define(['angular','serviceRequest', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.orders')
    .controller('OrderActionButtonsController', [
        '$rootScope',
        '$scope',
        '$location',
        'OrderRequest',
        'BlankCheck',
        'Devices',
        'SRControllerHelperService',
        function(
            $rootScope,
            $scope,
            $location,
            Orders,
            BlankCheck,
            Devices,
            SRHelper
        ){
             SRHelper.addMethods(Devices, $scope, $rootScope);

           if($rootScope.selectedDevice &&
                $rootScope.returnPickerObjectDevice){
                    $scope.device = $rootScope.returnPickerObjectDevice;
                    $scope.sr = $rootScope.returnPickerSRObjectDevice;
                    if(BlankCheck.isNull($scope.device.isDeviceSelected) || $scope.device.isDeviceSelected) {
                        $scope.device.isDeviceSelected = true;
                        $scope.resetDevicePicker();
                        Orders.reset();
                        Orders.item = null;
                        $location.search('tab', 'orderTab');
                        $location.path(Devices.route + "/" + $scope.device.item.id + '/review');
                    }
            }else{
                $scope.device = {};
                Orders.reset();
                $scope.setupSR(Orders, function(){});
            }

            $scope.goToSuppliesDeviceCreate = function(){
                Orders.newMessage();
                Orders.tempSpace = {};
                Devices.item = {};
                $location.search('tab', 'orderTab');
                $scope.goToDevicePicker('DeviceInformation', Devices.item, '/device_management/{{id}}/review');
            };
            $scope.goToHardwareCreate = function(){
                Orders.newMessage();
                Orders.tempSpace = {};
                $location.path(Orders.route + '/catalog/hardware');
            };
            $scope.goToReturnSuppliesCreate = function(){
                Orders.newMessage();
                Orders.tempSpace = {};
                $location.path(Orders.route + '/supply/return/review');
            };
            $scope.goToSuppliesCatalogCreate = function(){
                Orders.newMessage();
                Orders.tempSpace = {};
                $location.path(Orders.route + '/catalog/supplies');
            };
        }
    ]);
});
