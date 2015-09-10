'use strict';
angular.module('mps.deviceManagement')
.controller('DeviceManagementController', ['$scope', '$location', '$routeParams', 'History', 'Device',
    function($scope, $location, $routeParams, History, Device) {
        $scope.devices = Device.devices;
        $scope.device = Device.device;
        $scope.formattedAddress = '';

        $scope.primaryContact = {
            address: {},
            name: '',
            phoneNumber: '',
            emailAddress: ''
        };

        $scope.installAddress = {
            storeFrontName: '',
            addressLine1: '',
            addressLine2: '',
            country: '',
            city: '',
            state: '',
            postalCode: '',
            building: '',
            floor: '',
            office: '' 
        };

        $scope.loadTestData = function() {
            $scope.installAddress.storeFrontName = 'Lexmark International Inc';
            $scope.installAddress.addressLine1 = '740 W. New Circle Rd.';
            $scope.installAddress.country = 'United States';
            $scope.installAddress.city = 'Lexington';
            $scope.installAddress.state = 'KY';
            $scope.installAddress.postalCode = '40511';
            $scope.installAddress.building = 'Bldg1';
            $scope.installAddress.floor = 'floor2';
            $scope.installAddress.office = 'office3';
            $scope.primaryContact.name = 'John Public';
            $scope.primaryContact.phoneNumber = '9992882222';
            $scope.primaryContact.emailAddress = 'jpublic@lexmark.com';
            $scope.primaryContact.address = $scope.installAddress;
        };

        $scope.formatAddress = function() {
            if($scope.installAddress!== undefined && $scope.installAddress !== null){
                $scope.formattedAddress = $scope.installAddress.storeFrontName + '\n' + 
                                          $scope.installAddress.addressLine1 + ', ' +
                                          $scope.installAddress.city + ', ' + 
                                          $scope.installAddress.state + ' ' +
                                          $scope.installAddress.postalCode + '\n';
                if($scope.installAddress.building!== undefined && $scope.installAddress.building !== null){
                    $scope.formattedAddress = $scope.formattedAddress + $scope.installAddress.building;
                }
                if($scope.installAddress.floor!== undefined && $scope.installAddress.floor !== null){
                    $scope.formattedAddress = $scope.formattedAddress + ', ' + $scope.installAddress.floor;
                }
                if($scope.installAddress.office!== undefined && $scope.installAddress.office !== null){
                     $scope.formattedAddress = $scope.formattedAddress + ', ' + $scope.installAddress.office + '\n';
                }
                $scope.formattedAddress = $scope.formattedAddress + $scope.installAddress.country;
            }
        };

        $scope.goToRead = function(id) {
            Device.getById(id, function() {
                $scope.device = Device.device;
                $location.path('/device_management/' + id + '/review');
            });
        };

        if (Device.devices.length === 0) {
            Device.query(function() {
                $scope.devices = Device.devices;
            });
        }

        if ($routeParams.id) {
           Device.getById($routeParams.id, function() {
                $scope.device = Device.device;
            });
        }

        $scope.loadTestData();
        $scope.formatAddress();
    }
]);
