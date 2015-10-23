define(['angular', 'deviceManagement', 'utility.blankCheckUtility', 'deviceManagement.deviceFactory'], function(angular) {
    'use strict';
    angular.module('mps.deviceManagement')
    .controller('DeviceInformationController', ['$scope', '$location', '$routeParams', 'BlankCheck', 'Devices',
        'DeviceServiceRequest','FormatterService',
        function($scope, $location, $routeParams, BlankCheck, Devices, DeviceServiceRequest, FormatterService) {

             var redirect_to_list = function() {
               $location.path(Devices.route + '/');
             };


            if (Devices.item === null) {
                redirect_to_list();
            } else {
                $scope.device = Devices.item;
                $scope.installAddress = $scope.device._embeddedItems['address'];
                $scope.primaryContact = $scope.device._embeddedItems['primaryContact'];
            }

            if($scope.device !== null && $scope.device !== undefined){
                 $scope.device.installDate = new Date($scope.device.installDate);
            }
            if($scope.installAddress !== null && $scope.installAddress !== undefined){
                $scope.formattedAddress = FormatterService.formatAddress($scope.installAddress);
            }
            if($scope.primaryContact !== null && $scope.primaryContact !== undefined){
                    $scope.primaryContact.formattedName = FormatterService.getFullName($scope.primaryContact.firstName,
                        $scope.primaryContact.lastName, $scope.primaryContact.middleName);
                    $scope.primaryContact.formattedworkPhone =
                         FormatterService.getPhoneFormat($scope.primaryContact.workPhone);
            }


            $scope.btnRequestService = function(device) {
                $location.path(DeviceServiceRequest.route + "/" + device.id + '/review');
            };

        }
    ]);
});
