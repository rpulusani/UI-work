define(['angular','serviceRequest', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestAddresses')
    .controller('ServiceRequestActionButtonsController', [
        '$rootScope',
        '$scope',
        '$location',
        'Contacts',
        'Addresses',
        'ServiceRequestService',
        'SRControllerHelperService',
        'Devices',
        function(
            $rootScope,
            $scope,
            $location,
            Contacts,
            Addresses,
            ServiceRequest,
            SRHelper,
            Devices
        ) {
            SRHelper.addMethods(Devices, $scope, $rootScope);

            $scope.goToContactCreate = function(){
                Contacts.item = {};
                $location.path(Contacts.route + '/new');
            };
            $scope.goToAddressCreate = function(){
                Addresses.item = {};
                $location.path(Addresses.route + '/new');
            };
            $scope.goToServiceCreate = function(){
                $scope.resetDevicePicker();
                $scope.configure = {
                    header: {
                            translate: {
                                h1: 'SERVICE_REQUEST.SERVICE_REQUEST_DEVICE',
                                body: 'MESSAGE.LIPSUM',
                                readMore: ''
                            },
                            readMoreUrl: ''
                    },
                    devicePicker: {
                        translate: {
                            replaceDeviceTitle: 'SERVICE_REQUEST.SERVICE_REQUEST_PICKER_SELECTED'
                        }
                    }
                };

                $scope.setupSR(ServiceRequest, function(){

                });
                if ($rootScope.newSr) {
                        $scope.sr = $rootScope.newSr;
                        $rootScope.newSr = undefined;
                }
                $scope.goToDevicePicker('ServiceRequestActionButtons', Devices);
                /*
                ServiceRequest.reset();
                $location.path(DeviceServiceRequest.route + "/" + device.id + '/view');*/
            };
        }
    ]);
});
