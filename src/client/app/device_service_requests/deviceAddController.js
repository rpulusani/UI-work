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
            };

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
                        if (ProductModel && ProductModel.item &&
                                ProductModel.item._embedded && ProductModel.item._embedded.models) {
                            $scope.device.productNumbers = [];
                            var modelList = ProductModel.item._embedded.models;
                            for(var i=0; i<modelList.length; i++) {
                                var tempModel = {};
                                tempModel.productNo = modelList[i].productModel;
                                $scope.device.productNumbers.push(tempModel);
                            }
                        }
                    });
                }
            });

            if ($rootScope.selectedContact &&
                    $rootScope.returnPickerObject){
                $scope.device = $rootScope.returnPickerObject;
                $scope.sr = $rootScope.returnPickerSRObject;
                if ($rootScope.currentSelected) {
                    if ($rootScope.currentSelected === 'updateRequestContact') {
                        ServiceRequest.addRelationship('primaryContact', $rootScope.selectedContact, 'self');
                        $scope.device.primaryContact = angular.copy($rootScope.selectedContact);
                    } else if ($rootScope.currentSelected === 'updateDeviceContact') {
                        ServiceRequest.addRelationship('assetContact', $rootScope.selectedContact, 'self');
                        $scope.device.deviceContact = angular.copy($rootScope.selectedContact);
                    }
                }
                $scope.resetContactPicker();
            } else if($rootScope.selectedAddress &&
                    $rootScope.returnPickerObjectAddress){
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
            } else if($rootScope.selectedDevice &&
                    $rootScope.returnPickerObjectDevice){
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
                $scope.device.chl = {};
                $scope.device.lexmarkDeviceQuestion = 'true';
                $scope.device.productNumbers = [];
                if ($rootScope.newDevice || $rootScope.newSr) {
                    if ($rootScope.newDevice) {
                        $scope.device = $rootScope.newDevice;
                        $rootScope.newDevice = undefined;
                    }
                    if ($rootScope.newSr) {
                        $scope.sr = $rootScope.newSr;
                        $rootScope.newSr = undefined;
                    }
                } else {
                    $scope.getRequestor(ServiceRequest, Contacts);
                }
            }
               $scope.updateSRObjectForSubmit = function() {
                ServiceRequest.item =  $scope.sr;
                if ($scope.device.deviceDeInstallQuestion === 'true') {
                    ServiceRequest.addField('type', 'MADC_INSTALL_AND_DECOMMISSION');
                } else if ($scope.device.deviceInstallQuestion === 'true') {
                    ServiceRequest.addField('type', 'MADC_INSTALL');
                } else {
                    ServiceRequest.addField('type', 'DATA_ASSET_REGISTER');
                }
                var assetInfo = {
                    ipAddress: $scope.device.ipAddress,
                    serialNumber: $scope.device.serialNumber,
                    productModel: $scope.device.productModel,
                    hostName: $scope.device.hostName,
                    assetTag: $scope.device.customerDeviceTag,
                    costCenter: $scope.device.costCenter,
                    physicalLocation1: $scope.device.physicalLocation1,
                    physicalLocation2: $scope.device.physicalLocation2,
                    physicalLocation3: $scope.device.physicalLocation3
                };



                if ($scope.device.chl && $scope.device.chl.id) {
                    assetInfo.customerHierarchyLevel = $scope.device.chl.id;
                }
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
                if (BlankCheck.checkNotBlank($scope.device.deviceInstallDate)) {
                    ServiceRequest.addField('requestChangeDate', FormatterService.formatDateForPost($scope.device.deviceInstallDate));
                }
                ServiceRequest.addRelationship('account', $scope.device.requestedByContact, 'account');
                Devices.item = $scope.device;
            };

            $scope.setupSR(ServiceRequest, configureSR);
            $scope.setupTemplates(configureTemplates, configureReceiptTemplate, configureReviewTemplate);

            function configureReviewTemplate(){
                $scope.configure.actions.translate.submit = 'DEVICE_SERVICE_REQUEST.SUBMIT_DEVICE_REQUEST';
                $scope.updateSRObjectForSubmit();
                $scope.configure.actions.submit = function(){
                    $scope.updateSRObjectForSubmit();
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
                        $rootScope.newDevice = $scope.device;
                        $rootScope.newSr = $scope.sr;
                        $location.path(DeviceServiceRequest.route + '/add/receipt');
                    }, function(reason){
                        NREUM.noticeError('Failed to create SR because: ' + reason);
                    });

                };
            }

            function configureReceiptTemplate() {
                $scope.configure.header.translate.h1 = "DEVICE_SERVICE_REQUEST.ADD_DEVICE_REQUEST_SUBMITTED";
                $scope.configure.header.translate.body = "DEVICE_SERVICE_REQUEST.UPDATE_DEVICE_SUBMIT_HEADER_BODY";
                $scope.configure.header.translate.bodyValues= {
                    'srNumber': FormatterService.getFormattedSRNumber($scope.sr),
                    'srHours': 24,
                    'deviceManagementUrl': '/service_requests/devices/new',
                };
                $scope.configure.receipt = {
                    translate: {
                        title:"DEVICE_SERVICE_REQUEST.ADD_DEVICE_DETAIL",
                        titleValues: {'srNumber': FormatterService.getFormattedSRNumber($scope.sr) }
                    }
                };
                $scope.configure.contact.show.primaryAction = false;
            }

            function configureTemplates() {
                $scope.configure = {
                    header: {
                        translate: {
                            h1: 'DEVICE_SERVICE_REQUEST.ADD',
                            body: 'MESSAGE.LIPSUM',
                            readMore: 'Learn more about requests'
                        },
                        readMoreUrl: '/service_requests/learn_more',
                        showCancelBtn: false
                    },
                    device: {
                        information:{
                            translate: {
                                title: 'DEVICE_MGT.DEVICE_INFO',
                                serialNumber: 'DEVICE_MGT.SERIAL_NO',
                                partNumber: 'DEVICE_MGT.PART_NUMBER',
                                product: 'DEVICE_SERVICE_REQUEST.PRODUCT_NUMBER',
                                ipAddress: 'DEVICE_MGT.IP_ADDRESS',
                                hostName: 'DEVICE_MGT.HOST_NAME',
                                costCenter: 'DEVICE_SERVICE_REQUEST.DEVICE_COST_CENTER',
                                chl: 'DEVICE_MGT.CHL',
                                customerDeviceTag: 'DEVICE_MGT.CUSTOMER_DEVICE_TAG',
                                installAddress: 'DEVICE_MGT.INSTALL_ADDRESS',
                                linkMakeChangesTxt: 'LABEL.MAKE_CHANGES'
                            },
                            linkMakeChanges: '/service_requests/devices/new'

                        },
                        pageCount:{
                            translate: {
                                title: 'DEVICE_SERVICE_REQUEST.DEVICE_PAGE_COUNTS'
                            },
                            source: 'add'
                        },
                        contact: {
                            translate:{
                                title:'DEVICE_SERVICE_REQUEST.DEVICE_CONTACT'
                            }
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
                        pickerObject: $scope.device,
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
                            replaceDeviceTitle: 'DEVICE_SERVICE_REQUEST.REPLACE_DEVICE_WITH',
                            h1: 'DEVICE_MGT.REMOVE_A_DEVICE',
                            body: 'MESSAGE.LIPSUM',
                            readMore: '',
                            confirmation:{
                                    abandon:'DEVICE_MGT.DISCARD_DEVICE_REMOVAL_CHANGES',
                                    submit: 'DEVICE_MGT.CHANGE_DEVICE_TO_BE_REMOVED'
                            }
                        },
                        readMoreUrl: ''
                    },
                    statusList:[
                  {
                    'label':'Submitted',
                    'date': '1/29/2016',
                    'current': true
                  },
                  {
                    'label':'In progress',
                    'date': '',
                    'current': false
                  },
                  {
                    'label':'Completed',
                    'date': '',
                    'current': false
                  }
                ]
                };
            }

            var formatAdditionalData = function() {
                if (!BlankCheck.isNull($scope.device.address)) {
                    $scope.formattedDeviceAddress = FormatterService.formatAddress($scope.device.address);
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
