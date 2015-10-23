define(['angular', 'deviceServiceRequest', 'deviceManagement.deviceFactory'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestDevices')
    .controller('DeviceDecomissionDeviceController', ['$scope', '$location', '$translate', 'Devices',
        'ServiceRequestService', 'BlankCheck', 'DeviceServiceRequest',
        function($scope, $location, $translate, Devices, ServiceRequestService, BlankCheck, DeviceServiceRequest){

            if (Devices.item === null) {
                redirect_to_list();
            } else {
                $scope.device = Devices.item;
                $scope.installAddress = Devices.item._embeddedItems['address'];
                $scope.primaryContact = Devices.item._embeddedItems['primaryContact'];
            }

            $scope.formattedAddress = '';
            $scope.formattedTitleAddress = '';

            $scope.goToReview = function() {
                $location.path(DeviceServiceRequest.route + '/decomission/' + $scope.device.id + '/review');
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

