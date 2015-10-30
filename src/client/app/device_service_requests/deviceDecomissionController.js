define(['angular', 'deviceServiceRequest', 'deviceManagement.deviceFactory'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestDevices')
    .controller('DeviceDecomissionController', ['$scope', '$rootScope', '$location', '$translate', 'Devices',
        'ServiceRequestService', 'FormatterService', 'BlankCheck', 'DeviceServiceRequest',
        function($scope, $rootScope, $location, $translate, Devices, ServiceRequestService, FormatterService, BlankCheck, DeviceServiceRequest) {

            var redirect_to_list = function() {
                $location.path(Devices.route + '/');
            };
             
            if (Devices.item === null) {
                redirect_to_list();
            } else {
                $scope.device = Devices.item;
                $scope.installAddress = Devices.item._embeddedItems['address'];
                $scope.primaryContact = Devices.item._embeddedItems['primaryContact'];

                if (BlankCheck.isNullOrWhiteSpace($scope.lexmarkPickupDevice)) {
                    $scope.lexmarkPickupDevice = false;
                }

                if (BlankCheck.isNullOrWhiteSpace($scope.pageCountQuestion)) {
                    $scope.pageCountQuestion = false;
                }
            }

            $scope.goToReview = function() {
                $location.path(DeviceServiceRequest.route + '/decomission/' + $scope.device.id + '/review');
            };

            $scope.goToSubmit = function() {

            };

            $scope.createServiceRequestForDevice = function() {
                    DeviceServiceRequest.save();
            };

            if (!BlankCheck.isNull($scope.installAddress)) {
                $scope.formattedDeviceAddress = FormatterService.formatAddress($scope.installAddress);
            };

            if (!BlankCheck.isNull($scope.primaryContact)) {
                $scope.formattedDeviceContact = FormatterService.formatPrimaryContact($scope.primaryContact);
            };

            if (!BlankCheck.isNullOrWhiteSpace($scope.lexmarkPickupDevice)) {
                $scope.formattedPickupDevice = FormatterService.formatYesNo($scope.lexmarkPickupDevice);
            };
        }
    ]);
});

