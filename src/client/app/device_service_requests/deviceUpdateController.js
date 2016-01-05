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
            permissionSet
            ) {

            var configurePermissions = [
                {
                    name: 'moveMADCAccess',
                    permission: permissionSet.serviceRequestManagement.moveMADC
                }
            ];

            new SecurityHelper($scope).setupPermissionList(configurePermissions);

            $scope.returnedForm = false;

            SRHelper.addMethods(Devices, $scope, $rootScope);

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
            };
            
            function configureReviewTemplate(){
                $scope.configure.actions.translate.submit = 'DEVICE_SERVICE_REQUEST.SUBMIT_DEVICE_REQUEST';
                $scope.configure.actions.submit = function(){
                    updateSRObjectForSubmit();
                    var deferred = DeviceServiceRequest.post({
                        item:  $scope.sr
                    });

                    deferred.then(function(result){
                        ServiceRequest.item = DeviceServiceRequest.item;
                        $location.path(DeviceServiceRequest.route + '/update/' + $scope.device.id + '/receipt');
                    }, function(reason){
                        NREUM.noticeError('Failed to create SR because: ' + reason);
                    });

                };
            }
            function configureReceiptTemplate() {
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
            }

            function configureTemplates() {
                $scope.configure = {
                    header: {
                        translate: {
                            h1: 'DEVICE_SERVICE_REQUEST.UPDATE_DEVICE',
                            body: 'MESSAGE.LIPSUM',
                            readMore: ''
                        },
                        readMoreUrl: ''
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
                    }
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
