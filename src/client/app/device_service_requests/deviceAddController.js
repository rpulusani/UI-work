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
    '$translate',
    'TombstoneService',
    '$timeout',
    'tombstoneWaitTimeout',
    'SecurityHelper',
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
        HATEAOSConfig,
        $translate,
        Tombstone,
        $timeout,
        tombstoneWaitTimeout,
        SecurityHelper) {

        $scope.isLoading = false;

        SRHelper.addMethods(Devices, $scope, $rootScope);
        $scope.setTransactionAccount('DeviceAdd', Devices);
        new SecurityHelper($rootScope).redirectCheck($rootScope.addDevice);

        function configureReviewTemplate(){
                    $scope.configure.actions.translate.submit = 'REQUEST_MAN.REQUEST_DEVICE_REGISTER_REVIEW.TXT_SUBMIT_REGISTRATION_REQUEST';
                $scope.updateSRObjectForSubmit();
                $scope.configure.actions.submit = function(){
                  if(!$scope.isLoading) {
                    $scope.isLoading = true;

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
                      if(DeviceServiceRequest.item._links['tombstone']) {
                        $location.search('tab', null);
                        $timeout(function(){
                          DeviceServiceRequest.getAdditional(DeviceServiceRequest.item, Tombstone, 'tombstone', true).then(function(){
                          if(Tombstone.item && Tombstone.item.siebelId) {
                            ServiceRequest.item.requestNumber = Tombstone.item.siebelId;
                            $location.path(DeviceServiceRequest.route + '/add/receipt/notqueued');
                          } else {
                            ServiceRequest.item = DeviceServiceRequest.item;
                            //Reviewed with Kris - uncertain why this is here
                            //$rootScope.newDevice = $scope.device;
                            //$rootScope.newSr = $scope.sr;
                            $location.path(DeviceServiceRequest.route + '/add/receipt/queued');
                          }
                        });
                      }, tombstoneWaitTimeout);
                      }
                    }, function(reason){
                        NREUM.noticeError('Failed to create SR because: ' + reason);
                    });
                  }
                };
            }

            function configureReceiptTemplate() {
              if($routeParams.queued === 'queued') {
                $scope.configure.header.translate.h1="QUEUE.RECEIPT.TXT_TITLE";
                $scope.configure.header.translate.h1Values = {
                    'type': $translate.instant('SERVICE_REQUEST_COMMON.TYPES.' + DeviceServiceRequest.item.type)
                };
                $scope.configure.header.translate.body = "QUEUE.RECEIPT.TXT_PARA";
                $scope.configure.header.translate.bodyValues= {
                    'srHours': 24
                };
                $scope.configure.header.translate.readMore = undefined;
                $scope.configure.header.translate.action="QUEUE.RECEIPT.TXT_ACTION";
                $scope.configure.header.translate.actionValues = {
                    actionLink: Devices.route,
                    actionName: $translate.instant('DEVICE_MAN.MANAGE_DEVICES.TXT_MANAGE_DEVICES')
                };
                $scope.configure.receipt = {
                    translate:{
                        title:"QUEUE.COMMON.TXT_GENERIC_SERVICE_REQUEST_TITLE",
                        titleValues: {'srNumber': $translate.instant('QUEUE.RECEIPT.TXT_GENERATING_REQUEST') }
                    }
                };
                $scope.configure.queued = true;
              } else {
                    $scope.configure.header.translate.h1 = "REQUEST_MAN.REQUEST_DEVICE_REGISTER_SUBMITTED.TXT_REGISTER_DEVICE_SUBMITTED";
                    $scope.configure.header.translate.body = "REQUEST_MAN.COMMON.TXT_REQUEST_SUBMITTED";
                $scope.configure.header.translate.bodyValues= {
                        'refId': FormatterService.getFormattedSRNumber($scope.sr),
                    'srNumber': FormatterService.getFormattedSRNumber($scope.sr),
                    'srHours': 24,
                    'deviceManagementUrl': '/service_requests/devices/new',
                };
                $scope.configure.receipt = {
                    translate: {
                            title:"REQUEST_MAN.REQUEST_DEVICE_REGISTER_SUBMITTED.TXT_REGISTER_DEVICE_DETAILS",
                        titleValues: {'srNumber': FormatterService.getFormattedSRNumber($scope.sr) }
                    }
                };
                $scope.configure.contact.show.primaryAction = false;
              }
            }

            function configureTemplates() {
                $scope.configure = {
                    header: {
                        translate: {
                                h1: 'REQUEST_MAN.REQUEST_DEVICE_REGISTER.TXT_REGISTER_DEVICE',
                                body: 'REQUEST_MAN.REQUEST_DEVICE_REGISTER.TXT_REGISTER_DEVICE_PAR',
                                readMore: 'REQUEST_MAN.REQUEST_DEVICE_REGISTER.LNK_LEARN_MORE'
                        },
                        readMoreUrl: '/service_requests/learn_more',
                        showCancelBtn: false
                    },
                    device: {
                        information:{
                            translate: {
                                    title: 'REQUEST_MAN.COMMON.TXT_DEVICE_INFO',
                                    serialNumber: 'REQUEST_MAN.COMMON.TXT_SERIAL_NUMBER',
                                    partNumber: 'REQUEST_MAN.COMMON.TXT_PART_NUMBER',
                                    product: 'REQUEST_MAN.REQUEST_DEVICE_REGISTER.TXT_PRODUCT_NUMBER',
                                    ipAddress: 'REQUEST_MAN.COMMON.TXT_IP_ADDR',
                                    hostName: 'REQUEST_MAN.COMMON.TXT_HOSTNAME',
                                    costCenter: 'REQUEST_MAN.COMMON.TXT_DEVICE_COST_CENTER',
                                    chl: 'REQUEST_MAN.REQUEST_DEVICE_UPDATE_SUBMITTED.TXT_CHL',
                                    customerDeviceTag: 'REQUEST_MAN.COMMON.TXT_DEVICE_TAG',
                                    installAddress: 'REQUEST_MAN.COMMON.TXT_INSTALL_ADDRESS',
                                    linkMakeChangesTxt: 'REQUEST_MAN.REQUEST_DEVICE_REGISTER_REVIEW.TXT_MAKE_CHANGES'
                            },
                            linkMakeChanges: '/service_requests/devices/new'

                        },
                        pageCount:{
                            translate: {
                                    title: 'REQUEST_MAN.COMMON.TXT_PAGE_COUNTS'
                            },
                            source: 'add'
                        },
                        contact: {
                            translate:{
                                    title:'REQUEST_MAN.COMMON.TXT_SUPPLIES_CONTACT'
                            }
                        }
                    },
                    detail: {
                        translate: {
                                title: 'REQUEST_MAN.COMMON.TXT_REQUEST_ADDL_DETAILS',
                                referenceId: 'REQUEST_MAN.COMMON.TXT_REQUEST_CUST_REF_ID',
                                costCenter: 'REQUEST_MAN.COMMON.TXT_REQUEST_COST_CENTER',
                                comments: 'REQUEST_MAN.COMMON.TXT_REQUEST_COMMENTS',
                                attachments: 'REQUEST_MAN.COMMON.TXT_REQUEST_ATTACHMENTS',
                                attachmentMessage:  'REQUEST_MAN.COMMON.TXT_REQUEST_ATTACH_FILE_FORMATS',
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
                                abandonRequest:'REQUEST_MAN.COMMON.BTN_ABANDON_REGISTRATION',
                                submit: 'REQUEST_MAN.REQUEST_DEVICE_REGISTER_REVIEW.TXT_SUBMIT_REGISTRATION_REQUEST'
                        },
                        submit: $scope.goToReview
                    },
                    contact:{
                        translate: {
                                title: 'REQUEST_MAN.COMMON.TXT_REQUEST_CONTACTS',
                                requestedByTitle: 'REQUEST_MAN.COMMON.TXT_REQUEST_CREATED_BY',
                                primaryTitle: 'REQUEST_MAN.COMMON.TXT_REQUEST_CONTACT',
                                changePrimary: 'REQUEST_MAN.REQUEST_DEVICE_UPDATE_REVIEW.LNK_CHANGE_REQUEST_CONTACT'
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
                                currentInstalledAddressTitle: 'REQUEST_MAN.REQUEST_DEVICE_CHANGE_INST_ADDR.TXT_DEVICE_INSTALLED_AT',
                                replaceAddressTitle: 'REQUEST_MAN.REQUEST_DEVICE_CHANGE_INST_ADDR.TXT_REPLACE_INSTALL_ADDR'
                        },
                        sourceAddress: $scope.device.address
                    },
                    devicePicker: {
                        translate: {
                                currentDeviceTitle: 'REQUEST_MAN.REQUEST_SELECT_DEVICE_REMOVAL.TXT_DEVICE_SELECTED_FOR_REMOVAL',
                                replaceDeviceTitle: 'REQUEST_MAN.REQUEST_SELECT_DEVICE_REMOVAL.TXT_DEVICE_DEVICE_FOR_INSTALL',
                                h1: 'REQUEST_MAN.REQUEST_SELECT_DEVICE_REMOVAL.TXT_SELECT_DEVICE_FOR_REMOVAL',
                                body: 'REQUEST_MAN.REQUEST_SELECT_DEVICE_REMOVAL.TXT_SELECT_DEVICE_FOR_REMOVAL_PAR',
                            readMore: '',
                            confirmation:{
                                        abandon:'REQUEST_MAN.REQUEST_SELECT_DEVICE_REMOVAL.BTN_ABANDON_DEVICE_SELECTION',
                                        submit: 'REQUEST_MAN.REQUEST_SELECT_DEVICE_REMOVAL.BTN_APPLY_DEVICE_SELECTION'
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


        if($scope.inTransactionalAccountContext()){
            $scope.goToReview = function() {
                $rootScope.newDevice = $scope.device;
                $location.path(DeviceServiceRequest.route + '/add/review');
                            $scope.setupTemplates(configureTemplates, configureReceiptTemplate, configureReviewTemplate);
            };

            $scope.setModels = function() {
                $scope.$broadcast('searchProductModel');
            };

            var configureSR = function(ServiceRequest){
                ServiceRequest.addRelationship('sourceAddress', $scope.device, 'address');
                ServiceRequest.addAccountRelationship('account');
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
            } else if(ServiceRequest.item && Devices.item){
                $scope.sr = ServiceRequest.item;
                $scope.device = Devices.item;

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

                    Devices.item = $scope.device;

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

                ServiceRequest.addField('attachments', $scope.files_complete);

              //  ServiceRequest.addRelationship('account', $scope.device.requestedByContact, 'account');

                HATEAOSConfig.getCurrentAccount().then(function() {
                    Devices.item = $scope.device;
                    ServiceRequest.item._links.account = {href: $rootScope.currentAccount.href};
                    ServiceRequest.addRelationship('sourceAddress', $scope.device, 'address');
                });
            };

            $scope.setupSR(ServiceRequest, configureSR);
            $scope.setupTemplates(configureTemplates, configureReceiptTemplate, configureReviewTemplate);

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
    }
]);
