define(['angular', 'deviceServiceRequest', 'utility.formatUtility'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestDevices')
    .controller('DeviceAddController', ['$scope', '$location', '$filter', '$routeParams', '$rootScope', 'Format',
        function($scope, $location, $filter, $routeParams, $rootScope, Format) {
            
            $scope.device = {};
            $scope.device.selectedDevice = {};
            $scope.device.selectedContact = {};
            $scope.device.lexmarkDeviceQuestion = 'true';
            $scope.isSubmitted = false;
            $scope.isReview = false;
            $scope.isPrimarySelected = false;
            $scope.isSecondarySelected = false;
            $scope.currentDate = $filter('date')(new Date(), "MM/dd/yyyy");
            
            /* Remove this varibale after real call and getting the list of products
               based on serial number */
            $scope.productNumbers = [{id: 1, name: 'Product 1'}, {id: 2, name: 'Product 2'}, {id: 3, name: 'Product 3'}];

            if ($rootScope.newDevice !== undefined && $routeParams.return) {
                $scope.device = $rootScope.newDevice;
            } 
            

            if ($rootScope.currentRowList !== undefined && $rootScope.currentRowList.length >= 1 
                && $routeParams.return && $routeParams.return !== 'discard') {
                if ($rootScope.currentRowList[$rootScope.currentRowList.length - 1].entity.serialNumber !== undefined) {
                    $scope.device.selectedDevice = $rootScope.currentRowList[$rootScope.currentRowList.length - 1].entity;
                } else {
                    if ($rootScope.currentSelected) {
                        switch($rootScope.currentSelected){
                            case 'deviceContact':
                                $scope.device.selectedContact = $rootScope.currentRowList[$rootScope.currentRowList.length - 1].entity;
                            break;
                            case 'requestPrimaryContact':
                                $scope.device.requestPrimaryContact = $rootScope.currentRowList[$rootScope.currentRowList.length - 1].entity;
                            break;
                            case 'requestSecondaryContact':
                                $scope.device.requestSecondaryContact = $rootScope.currentRowList[$rootScope.currentRowList.length - 1].entity;
                            break;
                        }
                    }
                    
                }
            }

            $scope.goToBrowse = function(device) {
                $rootScope.newDevice = device;
                $location.path('/device_management/pick_device');
            };

            $scope.goToReview = function() {
                $scope.isReview = true;
            };

            $scope.goToAdd = function() {
                $scope.isReview = false;
            };

            $scope.goToSubmit = function() {
                $scope.isSubmitted = true;
            };

            $scope.goToCreate = function() {
                $location.path('/service_requests/devices/new');
            };

            $scope.goToContactPicker = function(device,currentSelected) {
                $rootScope.currentSelected = currentSelected;
                $rootScope.newDevice = device;
                $location.path('/service_requests/devices/pick_contact');
            };

            $scope.isDeviceSelected = function(){
                if ($rootScope.currentRowList !== undefined && $rootScope.currentRowList.length === 1 && $routeParams.return) {
                    return true;
                } else {
                    return false;
                }
            };

            if ($scope.device.address) {
                $scope.installAddress = Format.formatAddress($scope.device.address);
            }

            if ($scope.device.selectedContact) {
                $scope.devicePrimaryContact = Format.formatContact($scope.device.selectedContact);
                $scope.isReview = false;
            }

            if ($scope.device.requestPrimaryContact) {
                $scope.requestPrimaryContact = Format.formatContact($scope.device.requestPrimaryContact);
                $scope.isPrimarySelected = true;
                $scope.isReview = true;
            }

            if ($scope.device.requestSecondaryContact) {
                $scope.requestSecondaryContact = Format.formatContact($scope.device.requestSecondaryContact);
                $scope.isSecondarySelected = true;
                $scope.isReview = true;
            }
        }
    ]);
});
