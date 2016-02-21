define(['angular',
    'deviceServiceRequest',
    'deviceManagement.deviceFactory',
    'utility.formatters'],
    function(angular) {
    'use strict';
    angular.module('mps.serviceRequestDevices')
    .controller('DeviceUpdateController', ['$scope',
        '$location',
        '$routeParams',
        '$rootScope',
        'ServiceRequestService',
        'FormatterService',
        'BlankCheck',
        'DeviceServiceRequest',
        'Devices',
        'Contacts',
        'UserService',
        'SRControllerHelperService',
        'SecurityHelper',
        'permissionSet',
        '$translate',
        'TombstoneService',
        '$timeout',
        'tombstoneWaitTimeout',
        function($scope,
            $location,
            $routeParams,
            $rootScope,
            ServiceRequest,
            FormatterService,
            BlankCheck,
            DeviceServiceRequest,
            Devices,
            Contacts,
            Users,
            SRHelper,
            SecurityHelper,
            permissionSet,
            $translate,
            Tombstone,
            $timeout,
            tombstoneWaitTimeout
            ) {

              $scope.isLoading = false;

            var configurePermissions = [
                {
                    name: 'moveMADCAccess',
                    permission: permissionSet.serviceRequestManagement.moveMADC
                }
            ];

            new SecurityHelper($scope).setupPermissionList(configurePermissions);

            $scope.returnedForm = false;

            SRHelper.addMethods(Devices, $scope, $rootScope);
            ServiceRequest.reset();

            $scope.goToReview = function() {
                $location.path(DeviceServiceRequest.route + '/update/' + $scope.device.id + '/review');
            };

            $scope.revertAddress = function() {
                $scope.device.addressSelected = false;
                $scope.device.updatedInstallAddress = $scope.device.currentInstalledAddress;
                $scope.formattedDeviceAddress = FormatterService.formatAddresswoPhysicalLocation($scope.device.updatedInstallAddress);
                ServiceRequest.addRelationship('destinationAddress', $scope.device, 'address');
            };

            var configureSR = function(ServiceRequest){
                ServiceRequest.addRelationship('account', $scope.device);
                ServiceRequest.addRelationship('asset', $scope.device, 'self');
                ServiceRequest.addRelationship('sourceAddress', $scope.device, 'address');
            };

            if (Devices.item === null) {
                $scope.redirectToList();
            } else if($rootScope.selectedContact
                    && $rootScope.returnPickerObject
                    && $rootScope.selectionId === Devices.item.id){
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
                Devices.item = $scope.device;
                $scope.resetContactPicker();
            } else if($rootScope.selectedAddress
                    && $rootScope.returnPickerObjectAddress
                    && $rootScope.selectionId === Devices.item.id){
                $scope.device = $rootScope.returnPickerObjectAddress;
                $scope.sr = $rootScope.returnPickerSRObjectAddress;
                if(BlankCheck.isNull($scope.device.addressSelected) || $scope.device.addressSelected) {
                    $scope.device.addressSelected = true;
                    ServiceRequest.addRelationship('destinationAddress', $rootScope.selectedAddress, 'self');
                    $scope.device.updatedInstallAddress = angular.copy($rootScope.selectedAddress);
                    $scope.setupPhysicalLocations($scope.device.updatedInstallAddress,
                                                    $scope.device.physicalLocation1,
                                                    $scope.device.physicalLocation2,
                                                    $scope.device.physicalLocation3);
                }
                Devices.item = $scope.device;
                $scope.resetAddressPicker();
            } else {
                $scope.device = Devices.item;
                if (BlankCheck.isNull($scope.device.chl)) {
                    $scope.device.chl = {};
                }
                if (!BlankCheck.isNull($scope.device.address.item) && BlankCheck.isNull($scope.device.currentInstalledAddress)) {
                    $scope.device.currentInstalledAddress = $scope.device.address.item;
                    $scope.setupPhysicalLocations($scope.device.currentInstalledAddress,
                                                $scope.device.physicalLocation1,
                                                $scope.device.physicalLocation2,
                                                $scope.device.physicalLocation3);
                    $scope.device.updatedInstallAddress = $scope.device.currentInstalledAddress;
                }

                if (!BlankCheck.isNull($scope.device.contact.item) && BlankCheck.isNull($scope.device.deviceContact)) {
                    $scope.device.deviceContact = $scope.device.contact.item;
                }

                if (BlankCheck.isNullOrWhiteSpace($scope.device.lexmarkMoveDevice)) {
                    $scope.device.lexmarkMoveDevice = false;
                }
            }

            $scope.setupSR(ServiceRequest, configureSR);
            $scope.setupTemplates(configureTemplates, configureReceiptTemplate, configureReviewTemplate, ServiceRequest);
            $scope.getRequestor(ServiceRequest, Contacts);

            var updateSRObjectForSubmit = function() {
                if ($scope.device.lexmarkMoveDevice === 'true') {
                    ServiceRequest.addField('type', 'MADC_MOVE');
                } else {
                    ServiceRequest.addField('type', 'DATA_ASSET_CHANGE');
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
                if ($scope.device.chl && $scope.device.chl.id) {
                    assetInfo.customerHierarchyLevel = $scope.device.chl.id;
                }

                ServiceRequest.addField('assetInfo', assetInfo);
                ServiceRequest.addField('attachments', $scope.files_complete);
            };

            function configureReviewTemplate(){
                $scope.configure.actions.translate.submit = 'DEVICE_SERVICE_REQUEST.SUBMIT_DEVICE_REQUEST';
                $scope.configure.actions.submit = function(){
                  if(!$scope.isLoading) {
                    $scope.isLoading = true;

                    updateSRObjectForSubmit();
                    var deferred = DeviceServiceRequest.post({
                        item:  $scope.sr
                    });

                    deferred.then(function(result) {
                      if(DeviceServiceRequest.item._links['tombstone']) {
                        $location.search('tab', null);
                        $timeout(function(){
                          DeviceServiceRequest.getAdditional(DeviceServiceRequest.item, Tombstone, 'tombstone', true).then(function(){
                            if(Tombstone.item && Tombstone.item.siebelId) {
                                ServiceRequest.item.requestNumber = Tombstone.item.siebelId;
                                $location.path(DeviceServiceRequest.route + '/update/' + $scope.device.id + '/receipt/notqueued');
                            } else {
                              ServiceRequest.item = DeviceServiceRequest.item;
                              $location.path(DeviceServiceRequest.route + '/update/' + $scope.device.id + '/receipt/queued');
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
                $scope.configure.header.translate.h1 = "DEVICE_SERVICE_REQUEST.UPDATE_DEVICE_REQUEST_SUBMITTED";
                $scope.configure.header.translate.body = "DEVICE_SERVICE_REQUEST.UPDATE_DEVICE_SUBMIT_HEADER_BODY";
                $scope.configure.header.translate.bodyValues= {
                    'srNumber': FormatterService.getFormattedSRNumber($scope.sr),
                    'srHours': 24,
                    'deviceManagementUrl': 'device_management/',
                };
                $scope.configure.receipt = {
                    translate: {
                        title:"DEVICE_SERVICE_REQUEST.UPDATE_DEVICE_DETAIL",
                        titleValues: {'srNumber': FormatterService.getFormattedSRNumber($scope.sr) }
                    }
                };
                $scope.configure.contact.show.primaryAction = false;
                $scope.configure.device.information.translate.linkMakeChangesTxt = undefined;
              }
            }

            function configureTemplates() {
                $scope.configure = {
                    header: {
                        translate: {
                            h1: 'DEVICE_SERVICE_REQUEST.UPDATE_DEVICE',
                            body: 'MESSAGE.LIPSUM',
                            readMore: 'Learn more about requests'
                        },
                        readMoreUrl: '/service_requests/learn_more',
                        showCancelBtn: false
                    },
                    device: {
                        information:{
                            translate: {
                                title: 'DEVICE_SERVICE_REQUEST.REQUESTED_UPDATE_TO_DEVICE',
                                move: 'DEVICE_SERVICE_REQUEST.LEXMARK_MOVE_DEVICE',
                                serialNumber: 'DEVICE_MGT.SERIAL_NO',
                                partNumber: 'DEVICE_MGT.PART_NUMBER',
                                product: 'DEVICE_SERVICE_REQUEST.PRODUCT_NUMBER',
                                ipAddress: 'DEVICE_MGT.IP_ADDRESS',
                                hostName: 'DEVICE_MGT.HOST_NAME',
                                costCenter: 'DEVICE_SERVICE_REQUEST.DEVICE_COST_CENTER',
                                chl: 'DEVICE_MGT.CHL',
                                customerDeviceTag: 'DEVICE_MGT.CUSTOMER_DEVICE_TAG',
                                installAddress: 'DEVICE_MGT.INSTALL_ADDRESS',
                                contact: 'DEVICE_SERVICE_REQUEST.DEVICE_CONTACT'
                            }
                        }
                    },
                    contact: {
                        translate: {
                            title: 'SERVICE_REQUEST.CONTACT_INFORMATION',
                            requestedByTitle: 'SERVICE_REQUEST.REQUEST_CREATED_BY',
                            primaryTitle: 'SERVICE_REQUEST.PRIMARY_CONTACT',
                            changePrimary: 'SERVICE_REQUEST.CHANGE_PRIMARY_CONTACT'
                        },
                        show: {
                            primaryAction : true
                        },
                        pickerObject: $scope.device,
                        source: 'DeviceUpdate'
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
                            abandonRequest:'DEVICE_SERVICE_REQUEST.DISCARD_DEVICE_CHANGES',
                            submit: 'LABEL.REVIEW_SUBMIT'
                        },
                        submit: $scope.goToReview
                    },
                    modal: {
                        translate: {
                            abandonTitle: 'SERVICE_REQUEST.TITLE_ABANDON_MODAL',
                            abandondBody: 'SERVICE_REQUEST.BODY_ABANDON_MODAL',
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
                        sourceAddress: function(){
                            if(updatedInstallAddress){
                                return $scope.device.updatedInstallAddress;
                            }else{
                                return {};
                            }
                        }
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
                if (!BlankCheck.isNull($scope.device.currentInstalledAddress)) {
                    $scope.formattedCurrentAddress = FormatterService.formatAddress($scope.device.currentInstalledAddress);
                }

                if (!BlankCheck.isNull($scope.device.updatedInstallAddress)) {
                    $scope.formattedDeviceAddress = FormatterService.formatAddresswoPhysicalLocation($scope.device.updatedInstallAddress);
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

                if (!BlankCheck.isNull($scope.device.lexmarkMoveDevice)) {
                    $scope.formattedMoveDevice = FormatterService.formatYesNo($scope.device.lexmarkMoveDevice);
                }
            };

            $scope.formatReceiptData(formatAdditionalData);
        }
    ]);
});
