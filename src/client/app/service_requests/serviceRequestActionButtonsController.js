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
                                replaceDeviceTitle: 'SERVICE_REQUEST.SERVICE_REQUEST_PICKER_SELECTED',
                                h1: 'SERVICE_REQUEST.SERVICE_REQUEST_DEVICE',
                                body: 'MESSAGE.LIPSUM',
                                readMore: '',
                                confirmation:{
                                    abandon:'SERVICE_REQUEST.ABANDON_SERVICE_REQUEST',
                                    submit: 'DEVICE_MGT.REQUEST_SERVICE_DEVICE'
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
                $location.search('tab', 'orderTab');
                Devices.item = {};
                $scope.goToDevicePicker('DeviceServiceRequestDevice', Devices.item, 'device_management/' + Devices.item.id + '/review');
            };
        }
    ]);
});
