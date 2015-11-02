define(['angular', 'deviceServiceRequest', 'deviceManagement.deviceFactory','utility.formatters'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestDevices')
    .controller('DeviceUpdateController', ['$scope', '$location', '$filter', '$routeParams', '$rootScope', 'FormatterService',
        'DeviceServiceRequest', 'Devices',
        function($scope, $location, $filter, $routeParams, $rootScope, Format, DeviceServiceRequest, Devices) {
            
            if (Devices.item === null) {
                redirect_to_list();
            } else {
                $scope.device = Devices.item;
                $scope.currentInstallAddress = Devices.item._embeddedItems['address'];
                $scope.updatedInstallAddress = Devices.item._embeddedItems['address'];
                $scope.primaryContact = Devices.item._embeddedItems['primaryContact'];
            }
            
            
            // if ($rootScope.newDevice !== undefined && $routeParams.return) {
            //     $scope.device = $rootScope.newDevice;
            // } 
            

            // if ($rootScope.currentRowList !== undefined && $rootScope.currentRowList.length >= 1 
            //     && $routeParams.return && $routeParams.return !== 'discard') {
            //     if ($rootScope.currentRowList[$rootScope.currentRowList.length - 1].entity.serialNumber !== undefined) {
            //         console.log("inside device condition");
            //         $scope.device.selectedDevice = $rootScope.currentRowList[$rootScope.currentRowList.length - 1].entity;
            //     } else {
            //         if ($rootScope.currentSelected) {
            //             switch($rootScope.currentSelected){
            //                 case 'deviceContact':
            //                     $scope.device.selectedContact = $rootScope.currentRowList[$rootScope.currentRowList.length - 1].entity;
            //                 break;
            //                 case 'requestPrimaryContact':
            //                     $scope.device.requestPrimaryContact = $rootScope.currentRowList[$rootScope.currentRowList.length - 1].entity;
            //                 break;
            //                 case 'requestSecondaryContact':
            //                     $scope.device.requestSecondaryContact = $rootScope.currentRowList[$rootScope.currentRowList.length - 1].entity;
            //                 break;
            //             }
            //         }
                    
            //     }
            // }

            // $scope.goToBrowse = function(device) {
            //     $rootScope.newDevice = device;
            //     $location.path('/device_management/pick_device');
            // };

            // $scope.goToReview = function() {
            //     $scope.isReview = true;
            // };

            // $scope.goToAdd = function() {
            //     $scope.isReview = false;
            // };

            // $scope.goToSubmit = function() {
            //     $scope.isSubmitted = true;
            // };

            // $scope.goToCreate = function() {
            //     $location.path('/service_requests/devices/new');
            // };

            $scope.goToContactPicker = function(device,currentSelected) {
                $rootScope.currentSelected = currentSelected;
                $rootScope.newDevice = device;
                $location.path('/service_requests/devices/pick_contact');
            };

            // $scope.isDeviceSelected = function(){
            //     if ($rootScope.currentRowList !== undefined && $rootScope.currentRowList.length >= 1 
            //         && $routeParams.return && $routeParams.return !== 'discard') {
            //         return true;
            //     } else {
            //         return false;
            //     }
            // };

            // if ($scope.device.address) {
            //     $scope.installAddress = Format.formatAddress($scope.device.address);
            // }

            if ($scope.primaryContact) {
                $scope.primaryContact = Format.formatContact($scope.primaryContact);
            }
        }
    ]);
});
