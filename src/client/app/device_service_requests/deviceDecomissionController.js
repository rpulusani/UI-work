define(['angular', 'deviceServiceRequest', 'deviceManagement.deviceFactory'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestDevices')
    .controller('DeviceDecomissionController', ['$scope', '$location', '$translate', 'Devices',
        'ServiceRequestService', 'FormatterService', 'BlankCheck', 'DeviceServiceRequest',
        function($scope, $location, $translate, Devices, ServiceRequestService, FormatterService, BlankCheck, DeviceServiceRequest){

            var redirect_to_list = function() {
                $location.path(Devices.route + '/');
            };
             
            if (Devices.item === null) {
                redirect_to_list();
            } else {
                $scope.device = Devices.item;
                $scope.installAddress = Devices.item._embeddedItems['address'];
                $scope.primaryContact = Devices.item._embeddedItems['primaryContact'];

                if (BlankCheck.isNullOrWhiteSpace($scope.device.lexmarkPickupDevice)) {
                    $scope.device.lexmarkPickupDevice = false;
                }

                if (BlankCheck.isNullOrWhiteSpace($scope.device.devicePageCountQuestion)) {
                    $scope.device.devicePageCountQuestion = false;
                }
            }

            $scope.goToReview = function() {
                $location.path(DeviceServiceRequest.route + '/decomission/' + $scope.device.id + '/review');
            };


            if (!BlankCheck.isNull($scope.installAddress)) {
                $scope.formattedAddress = FormatterService.formatAddress($scope.installAddress);
            };

            if (!BlankCheck.isNull($scope.primaryContact)) {
                $scope.formattedContact = FormatterService.formatPrimaryContact($scope.primaryContact);
            };

            if (!BlankCheck.isNullOrWhiteSpace($scope.device.lexmarkPickupDevice)) {
                $scope.formattedPickupDevice = FormatterService.formatYesNo($scope.device.lexmarkPickupDevice);
            };
        }
    ]);
});

