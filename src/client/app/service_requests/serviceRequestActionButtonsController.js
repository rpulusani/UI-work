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
        'BlankCheck',
        'DeviceServiceRequest',
        function(
            $rootScope,
            $scope,
            $location,
            Contacts,
            Addresses,
            ServiceRequest,
            SRHelper,
            Devices,
            BlankCheck,
            DeviceServiceRequest
        ) {
            SRHelper.addMethods(Devices, $scope, $rootScope);

            if($rootScope.selectedDevice &&
                $rootScope.returnPickerObjectDevice){
                    $scope.device = $rootScope.returnPickerObjectDevice;
                    $scope.sr = $rootScope.returnPickerSRObjectDevice;
                    if(BlankCheck.isNull($scope.device.isDeviceSelected) || $scope.device.isDeviceSelected) {
                        $scope.device.isDeviceSelected = true;
                        $scope.resetDevicePicker();
                        ServiceRequest.reset();
                        ServiceRequest.item = null;
                        $location.path(DeviceServiceRequest.route + "/" + $scope.device.item.id + '/view');
                    }
            }else{
                $scope.device = {};
                ServiceRequest.reset();
                $scope.setupSR(ServiceRequest, function(){});
            }

            function configureReviewTemplate(){
            }
            function configureReceiptTemplate(){

            }
            function configureTemplates() {
                $scope.configure = {
                        devicePicker: {
                            singleDeviceSelection: true,
                            readMoreUrl: '',
                            translate: {
                                replaceDeviceTitle: 'REQUEST_MAN.SELECT_DEVICE.TXT_DEVICE_SELECTED_SERVICE',
                                h1: 'REQUEST_MAN.SELECT_DEVICE.TXT_SELECT_DEVICE',
                                body: 'REQUEST_MAN.SELECT_DEVICE.TXT_SELECT_DEVICE_PAR',
                                readMore: '',
                                confirmation:{
                                    abandon:'REQUEST_MAN.COMMON.BTN_ABANDON_SERVICE_REQUEST',
                                    submit: 'REQUEST_MAN.COMMON.BTN_REQUEST_SERVICE'
                                }
                            }

                        }
                    };
            }
            $scope.setupTemplates(configureTemplates, configureReceiptTemplate, configureReviewTemplate);

            $scope.goToContactCreate = function(){
                Contacts.item = {};
                $location.path(Contacts.route + '/new');
            };
            $scope.goToAddressCreate = function(){
                Addresses.item = {};
                $location.path(Addresses.route + '/new');
            };
            $scope.goToServiceCreate = function(){
                //$location.search('tab', 'requestTab');
                Devices.item = {};
                $scope.goToDevicePicker('DeviceServiceRequestDevice', Devices.item, '/service_requests/devices/breakfix');
            };
        }
    ]);
});
