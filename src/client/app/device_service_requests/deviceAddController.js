define(['angular', 
    'deviceServiceRequest', 
    'deviceManagement.deviceFactory',
    'utility.formatters'], 
    function(angular) {
    'use strict';
    angular.module('mps.serviceRequestDevices')
    .controller('DeviceAddController', ['$scope', 
        '$location', 
        '$filter', 
        '$routeParams', 
        '$rootScope', 
        'ServiceRequestService', 
        'FormatterService',
        'BlankCheck',
        'DeviceServiceRequest',
        'Devices',
        'imageService',
        'Contacts',
        'ProductModel',
        'SRControllerHelperService',
        'HATEAOSConfig',
        function($scope, 
            $location, 
            $filter, 
            $routeParams, 
            $rootScope,
            ServiceRequest,
            FormatterService,
            BlankCheck,
            DeviceServiceRequest, 
            Devices,
            ImageService,
            Contacts,
            ProductModel,
            SRHelper,
            HATEAOSConfig) {

            SRHelper.addMethods(Devices, $scope, $rootScope);

            $scope.goToReview = function() {
                $rootScope.newDevice = $scope.device;
                $location.path(DeviceServiceRequest.route + '/add/review');
            };

            $scope.setModels = function() {
                $scope.$broadcast('searchProductModel');
            }

            var configureSR = function(ServiceRequest){
                ServiceRequest.addRelationship('sourceAddress', $scope.device, 'address');
            };

            $scope.$on('searchProductModel', function(evt){
                if($scope.device && $scope.device.serialNumber) {
                    var options = {
                        updateParams: false,
                        params:{
                            serialNumber: $scope.device.serialNumber
                        }
                    };
                    ProductModel.get(options).then(function(){
                        if (ProductModel && ProductModel.item 
                            && ProductModel.item._embedded && ProductModel.item._embedded.models) {
                            $scope.productNumbers = [];
                            var modelList = ProductModel.item._embedded.models;
                            for(var i=0; i<modelList.length; i++) {
                                var tempModel = {};
                                tempModel.productNo = modelList[i].productModel;
                                $scope.productNumbers.push(tempModel);
                            }
                        }
                    });
                }
            });

            if ($rootScope.selectedContact 
                    && $rootScope.returnPickerObject){
                $scope.device = $rootScope.returnPickerObject;
                $scope.sr = $rootScope.returnPickerSRObject;
                if ($rootScope.currentSelected) {
                    if ($rootScope.currentSelected === 'updateRequestContact') {
                        ServiceRequest.addRelationship('primaryContact', $rootScope.selectedContact, 'self');
                        $scope.device.primaryContact = angular.copy($rootScope.selectedContact);
                    } else if ($rootScope.currentSelected === 'updateDeviceContact') {
                        ServiceRequest.addRelationship('contact', $rootScope.selectedContact, 'self');
                        $scope.device.deviceContact = angular.copy($rootScope.selectedContact);
                    }
                }
                $scope.resetContactPicker();
            } else if($rootScope.selectedAddress
                    && $rootScope.returnPickerObjectAddress){
                $scope.device = $rootScope.returnPickerObjectAddress;
                $scope.sr = $rootScope.returnPickerSRObjectAddress;
                if(BlankCheck.isNull($scope.device.addressSelected) || $scope.device.addressSelected) {
                        
                    if ($scope.device.isDeviceSelected && $scope.device.isDeviceSelected === true) {
                        $scope.device.isDeviceSelected = false;
                    }

                    $scope.device.addressSelected = true;

                    ServiceRequest.addRelationship('sourceAddress', $rootScope.selectedAddress, 'self');
                    $scope.device.address = $rootScope.selectedAddress;
                }
                $scope.resetAddressPicker();
            } else if($rootScope.selectedDevice
                    && $rootScope.returnPickerObjectDevice){
                $scope.device = $rootScope.returnPickerObjectDevice;
                $scope.sr = $rootScope.returnPickerSRObjectDevice;
                if(BlankCheck.isNull($scope.device.isDeviceSelected) || $scope.device.isDeviceSelected) {
                    $scope.device.isDeviceSelected = true;

                    ServiceRequest.addRelationship('asset', $rootScope.selectedDevice, 'self');
                    $scope.device.selectedDevice = $rootScope.selectedDevice;
                    if ($scope.device.selectedDevice.partNumber) {
                        ImageService.getPartMediumImageUrl($scope.device.selectedDevice.partNumber).then(function(url){
                            $scope.device.selectedDevice.medImage = url;
                        }, function(reason){
                             NREUM.noticeError('Image url was not found reason: ' + reason);
                        });
                    }
                    Devices.setItem($scope.device.selectedDevice);
                    var options = {
                        params:{
                            embed:'contact'
                        }
                    };
                    Devices.item.get(options).then(function() {
                        $scope.device.selectedDevice.contact = Devices.item.contact.item;
                        $scope.formattedSelectedDeviceContact = FormatterService.formatContact($scope.device.selectedDevice.contact);
                    });

                    $scope.resetDevicePicker();
                }
            } else {
                $scope.device = {};
                $scope.device.address = {};
                $scope.device.selectedDevice = {};
                $scope.device.lexmarkDeviceQuestion = 'true';
                $scope.productNumbers = [];
                if ($rootScope.newDevice) {
                    $scope.device = $rootScope.newDevice;
                    $rootScope.newDevice = undefined;
                } else {
                    $scope.getRequestor(ServiceRequest, Contacts);
                }
            }

            
            $scope.setupSR(ServiceRequest, configureSR);
            $scope.setupTemplates(configureTemplates, configureReceiptTemplate, configureReviewTemplate);

            function configureTemplates() {
                $scope.configure = {
                    header: {
                        translate: {
                            h1: 'DEVICE_SERVICE_REQUEST.ADD',
                            body: 'MESSAGE.LIPSUM',
                            readMore: 'Learn more about requests'
                        },
                        readMoreUrl: '#'
                    },
                    device: {
                        information:{
                            translate: {
                                title: 'DEVICE_MGT.DEVICE_INFO',
                                serialNumber: 'DEVICE_MGT.SERIAL_NO',
                                partNumber: 'DEVICE_MGT.PART_NUMBER',
                                ipAddress: 'DEVICE_MGT.IP_ADDRESS',
                                installAddress: 'DEVICE_MGT.INSTALL_ADDRESS'
                            }
                        },
                        pageCount:{
                            translate: {
                                title: 'DEVICE_SERVICE_REQUEST.DEVICE_PAGE_COUNTS'
                            },
                            source: 'add'
                        }
                    },
                    detail: {
                        translate: {
                            title: 'DEVICE_SERVICE_REQUEST.ADDITIONAL_REQUEST_DETAILS',
                            referenceId: 'SERVICE_REQUEST.INTERNAL_REFERENCE_ID',
                            costCenter: 'SERVICE_REQUEST.REQUEST_COST_CENTER',
                            comments: 'LABEL.COMMENTS',
                            attachments: 'LABEL.ATTACHMENTS',
                            attachmentMessage: 'MESSAGE.ATTACHMENT',
                            fileList: ['.csv', '.xls', '.xlsx', '.vsd', '.doc', '.docx', '.ppt', '.pptx', '.pdf', '.zip'].join(', ')
                        },
                        show: {
                            referenceId: true,
                            costCenter: true,
                            comments: true,
                            attachements: true
                        }
                    },
                    actions: {
                        translate: {
                            abandonRequest:'DEVICE_SERVICE_REQUEST.ABANDON',
                            submit: 'LABEL.REVIEW_SUBMIT'
                        },
                        submit: $scope.goToReview
                    },
                    contact:{
                        translate: {
                            title: 'SERVICE_REQUEST.CONTACT_INFORMATION',
                            requestedByTitle: 'SERVICE_REQUEST.REQUEST_CREATED_BY',
                            primaryTitle: 'SERVICE_REQUEST.PRIMARY_CONTACT',
                            changePrimary: 'SERVICE_REQUEST.CHANGE_PRIMARY_CONTACT'
                        },
                        show:{
                            primaryAction : true
                        },
                        source: 'DeviceAdd'
                    },
                    modal: {
                        translate: {
                            abandonTitle: 'SERVICE_REQUEST.TITLE_ABANDON_MODAL',
                            abandonBody: 'SERVICE_REQUEST.BODY_ABANDON_MODAL',
                            abandonCancel:'SERVICE_REQUEST.ABANDON_MODAL_CANCEL',
                            abandonConfirm: 'SERVICE_REQUEST.ABANDON_MODAL_CONFIRM'
                        },
                        returnPath: Devices.route + '/'
                    },
                    contactPicker: {
                        translate: {
                            replaceContactTitle: 'CONTACT.REPLACE_CONTACT'
                        }
                    },
                    addressPicker: {
                        translate: {
                            currentInstalledAddressTitle: 'DEVICE_SERVICE_REQUEST.CURRENTLY_INSTALLED_AT',
                            replaceAddressTitle: 'DEVICE_SERVICE_REQUEST.REPLACE_ADDRESS_WITH'
                        },
                        sourceAddress: $scope.device.address
                    },
                    devicePicker: {
                        translate: {
                            currentDeviceTitle: 'DEVICE_SERVICE_REQUEST.DEVICE_SELECTED_FOR_REMOVAL',
                            replaceDeviceTitle: 'DEVICE_SERVICE_REQUEST.REPLACE_DEVICE_WITH'
                        }
                    }
                };
            }

            function configureReceiptTemplate() {
                $scope.configure.header.translate.h1 = "DEVICE_SERVICE_REQUEST.ADD_DEVICE_REQUEST_SUBMITTED";
                $scope.configure.header.translate.body = "DEVICE_SERVICE_REQUEST.UPDATE_DEVICE_SUBMIT_HEADER_BODY";
                $scope.configure.header.translate.bodyValues= {
                    'srNumber': FormatterService.getFormattedSRNumber($scope.sr),
                    'srHours': 24,
                    'deviceManagementUrl': 'device_management/',
                };
                $scope.configure.receipt = {
                    translate: {
                        title:"DEVICE_SERVICE_REQUEST.ADD_DEVICE_DETAIL",
                        titleValues: {'srNumber': FormatterService.getFormattedSRNumber($scope.sr) }
                    }
                };
                $scope.configure.contact.show.primaryAction = false;
            }

            var updateSRObjectForSubmit = function() {
                if ($scope.device.deviceDeInstallQuestion === 'true') {
                    ServiceRequest.addField('type', 'MADC_INSTALL_AND_DECOMMISSION');
                } else if ($scope.device.deviceInstallQuestion === 'true') {
                    ServiceRequest.addField('type', 'MADC_INSTALL');
                } else {
                    ServiceRequest.addField('type', 'DATA_ASSET_REGISTER');
                }
                var assetInfo = {
                    ipAddress: $scope.device.ipAddress,
                    hostName: $scope.device.hostName,
                    assetTag: $scope.device.assetTag,
                    costCenter: $scope.device.costCenter,
                    physicalLocation1: $scope.device.physicalLocation1,
                    physicalLocation2: $scope.device.physicalLocation2,
                    physicalLocation3: $scope.device.physicalLocation3
                };
                var meterReads = [];
                for (var countObj in $scope.device.newCount) {
                    var meterRead = {};
                    meterRead.type = countObj;
                    meterRead.value = $scope.device.newCount[countObj];
                    meterReads.push(meterRead);
                }
                for (var dateObj in $scope.device.newDate) {
                    for (var i=0; i<meterReads.length; i++) {
                        if(meterReads[i].type && meterReads[i].type === dateObj) {
                            meterReads[i].updateDate = FormatterService.formatDateForPost($scope.device.newDate[dateObj]);
                        }
                    }
                }             
                ServiceRequest.addField('meterReads', meterReads);
                ServiceRequest.addField('assetInfo', assetInfo);
                ServiceRequest.addField('requestChangeDate', FormatterService.formatDateForPost($scope.device.deviceInstallDate)); 
                ServiceRequest.addRelationship('account', $scope.device.requestedByContact, 'account');
            };

            function configureReviewTemplate(){
                $scope.configure.actions.translate.submit = 'DEVICE_SERVICE_REQUEST.SUBMIT_DEVICE_REQUEST';
                $scope.configure.actions.submit = function(){
                    updateSRObjectForSubmit();
                    if (!BlankCheck.checkNotBlank(ServiceRequest.item.postURL)) {
                        HATEAOSConfig.getApi(ServiceRequest.serviceName).then(function(api) {
                            ServiceRequest.item.postURL = api.url;
                        });
                    }
                    var deferred = DeviceServiceRequest.post({
                        item:  $scope.sr
                    });

                    deferred.then(function(result){
                        ServiceRequest.item = DeviceServiceRequest.item;
                        $location.path(DeviceServiceRequest.route + '/add/receipt');
                    }, function(reason){
                        NREUM.noticeError('Failed to create SR because: ' + reason);
                    });

                };
            }

            var formatAdditionalData = function() {
                if (!BlankCheck.isNull($scope.device.address)) {
                    $scope.formattedAddress = FormatterService.formatAddress($scope.device.address);
                }

                if (!BlankCheck.isNull($scope.device.primaryContact)) {
                    $scope.formattedPrimaryContact = FormatterService.formatContact($scope.device.primaryContact);
                }

                if (!BlankCheck.isNull($scope.device.deviceContact)) {
                    $scope.formattedDeviceContact = FormatterService.formatContact($scope.device.deviceContact);
                }

                if (!BlankCheck.isNull($scope.device.requestedByContact)) {
                    $scope.requestedByContactFormatted = FormatterService.formatContact($scope.device.requestedByContact);
                }
            };
            
            $scope.formatReceiptData(formatAdditionalData);
        }
    ]);
});
