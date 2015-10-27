define(['angular', 'deviceServiceRequest', 'deviceManagement.deviceFactory'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestDevices')
    .controller('DeviceDecomissionController', ['$scope', '$location', '$translate', 'Devices',
        'ServiceRequestService', 'FormatterService', 'DeviceServiceRequest',
        function($scope, $location, $translate, Devices, ServiceRequestService, FormatterService, DeviceServiceRequest){

            var redirect_to_list = function() {
                $location.path(Devices.route + '/');
            };
             
            if (Devices.item === null) {
                redirect_to_list();
            } else {
                $scope.device = Devices.item;
                $scope.installAddress = Devices.item._embeddedItems['address'];
                $scope.primaryContact = Devices.item._embeddedItems['primaryContact'];

                $scope.device.lexmarkPickupDevice = false;
                $scope.device.devicePageCountQuestion = false;
            }

            $scope.goToReview = function() {
                $location.path(DeviceServiceRequest.route + '/decomission/' + $scope.device.id + '/review');
            };


            if ($scope.installAddress !== null && $scope.installAddress !== undefined) {
                $scope.formattedAddress = FormatterService.formatAddress($scope.installAddress);
            }

            if ($scope.primaryContact !== null && $scope.primaryContact !== undefined) {
                $scope.formattedContact = FormatterService.formatPrimaryContact($scope.primaryContact);
            }
        }
    ]);
});

