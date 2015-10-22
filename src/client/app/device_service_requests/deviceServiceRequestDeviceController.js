define(['angular', 'deviceServiceRequest', 'deviceManagement.deviceFactory'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestDevices')
    .controller('DeviceServiceRequestDeviceController', ['$scope', '$location', '$translate', 'Devices',
        'ServiceRequestService', 'BlankCheck', 'DeviceServiceRequest',
        function($scope, $location, $translate, Devices, ServiceRequestService, BlankCheck, DeviceServiceRequest) {

            $scope.device = Devices.item;
            $scope.moveDevice = '';
            $scope.breakfixOption ='';
            $scope.formattedAddress = '';
            $scope.formattedTitleAddress = '';

            $scope.typeOfServiceOptions = [
                { value: 'BREAK_FIX_ONSITE_REPAIR', label: $translate.instant('DEVICE_SERVICE_REQUEST.BREAK_FIX_ONSITE_REPAIR') },
                { value: 'BREAK_FIX_EXCHANGE', label: $translate.instant('DEVICE_SERVICE_REQUEST.BREAK_FIX_EXCHANGE') },
                { value: 'BREAK_FIX_OPTION_EXCHANGE', label: $translate.instant('DEVICE_SERVICE_REQUEST.BREAK_FIX_OPTION_EXCHANGE') },
                { value: 'BREAK_FIX_REPLACEMENT', label: $translate.instant('DEVICE_SERVICE_REQUEST.BREAK_FIX_REPLACEMENT') },
                { value: 'BREAK_FIX_CONSUMABLE_SUPPLY_INSTALL', label: $translate.instant('DEVICE_SERVICE_REQUEST.BREAK_FIX_CONSUMABLE_SUPPLY_INSTALL') },
                { value: 'BREAK_FIX_CONSUMABLE_PART_INSTALL', label: $translate.instant('DEVICE_SERVICE_REQUEST.BREAK_FIX_CONSUMABLE_PART_INSTALL') },
                { value: 'BREAK_FIX_ONSITE_EXCHANGE', label: $translate.instant('DEVICE_SERVICE_REQUEST.BREAK_FIX_ONSITE_EXCHANGE') },
                { value: 'BREAK_FIX_OTHER', label: $translate.instant('DEVICE_SERVICE_REQUEST.BREAK_FIX_OTHER') }
            ];

            $scope.serviceSelected = function(option) {
                if ($scope.breakfixOption === 'BREAK_FIX_ONSITE_EXCHANGE') {
                    $scope.moveDevice = $translate.instant('LABEL.YES');
                }
                else {
                    $scope.moveDevice = $translate.instant('LABEL.NO');
                }
            };

            $scope.goToCreate = function() {
                $location.path(DeviceServiceRequest.route + '/' + $scope.device.id + '/review');
            };

            var installAddress = {
                storeFrontName: 'Lexmark International Inc',
                addressLine1: '740 W. New Circle Rd.',
                addressLine2: '',
                country: 'United States',
                city: 'Lexington',
                state: 'KY',
                postalCode: '40511',
                building: 'Bldg1',
                floor: 'floor2',
                office: 'office3'
            };

            var primaryContact = {
                address: $scope.installAddress,
                name: 'John Public',
                phoneNumber: '9992882222',
                emailAddress: 'jpublic@lexmark.com'
            };

            $scope.formatAddress = function() {
                if (BlankCheck.checkNotNullOrUndefined($scope.installAddress) ) {
                    $scope.formattedAddress = $scope.installAddress.storeFrontName + '\n' +
                                              $scope.installAddress.addressLine1 + ', ' +
                                              $scope.installAddress.city + ', ' +
                                              $scope.installAddress.state + ' ' +
                                              $scope.installAddress.postalCode + '\n';
                    if(BlankCheck.checkNotBlank($scope.installAddress.building)){
                        $scope.formattedAddress = $scope.formattedAddress + $scope.installAddress.building + ', ';
                    }
                    if(BlankCheck.checkNotBlank($scope.installAddress.floor)){
                        $scope.formattedAddress = $scope.formattedAddress + $scope.installAddress.floor + ', ';
                    }
                    if(BlankCheck.checkNotBlank($scope.installAddress.office)){
                         $scope.formattedAddress = $scope.formattedAddress + $scope.installAddress.office + '\n';
                    }
                    $scope.formattedAddress = $scope.formattedAddress + $scope.installAddress.country;
                    $scope.formattedTitleAddress = $scope.installAddress.addressLine1 + ", " +
                                                    $scope.installAddress.city + ", " +
                                                    $scope.installAddress.state + " " +
                                                    $scope.installAddress.postalCode + ", " +
                                                    $scope.installAddress.country;
                }
            };

            $scope.formatAddress();
        } 
    ]);
});

