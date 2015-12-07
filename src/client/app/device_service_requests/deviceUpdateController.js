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
            SRHelper) {

            $scope.returnedForm = false;

            SRHelper.addMethods(Devices, $scope, $rootScope);

            $scope.goToReview = function() {
                $rootScope.formChangedValues = $scope.getChangedValues();
                $location.path(DeviceServiceRequest.route + '/update/' + $scope.device.id + '/review');
            };

            $scope.revertAddress = function() {
                $scope.device.addressSelected = false;
                $scope.device.updatedInstallAddress = $scope.device.currentInstalledAddress;
                $scope.formattedDeviceAddress = FormatterService.formatAddresswoPhysicalLocation($scope.device.updatedInstallAddress);
                ServiceRequest.addRelationship('destinationAddress', $scope.device, 'address');
            };

            var configureSR = function(ServiceRequest){
                // ServiceRequest.addRelationship('account', $scope.device);
                // ServiceRequest.addRelationship('asset', $scope.device, 'self');
                //ServiceRequest.addRelationship('sourceAddress', $scope.device, 'address');
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
                        ServiceRequest.addRelationship('contact', $rootScope.selectedContact, 'self');
                        $scope.device.deviceContact = angular.copy($rootScope.selectedContact);
                    }
                }
                Devices.item = $scope.device;
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
            } else {
                $scope.device = Devices.item;
                if (!BlankCheck.isNull(Devices.item.address.item) && BlankCheck.isNull($scope.device.currentInstalledAddress)) {
                    $scope.device.currentInstalledAddress = Devices.item.address.item;
                    $scope.setupPhysicalLocations($scope.device.currentInstalledAddress, 
                                                $scope.device.physicalLocation1,
                                                $scope.device.physicalLocation2,
                                                $scope.device.physicalLocation3);
                    $scope.device.updatedInstallAddress = $scope.device.currentInstalledAddress;
                }

                if (!BlankCheck.isNull(Devices.item.contact.item) && BlankCheck.isNull($scope.device.deviceContact)) {
                    $scope.device.deviceContact = Devices.item.contact.item;
                }

                if (BlankCheck.isNullOrWhiteSpace($scope.device.lexmarkMoveDevice)) {
                    $scope.device.lexmarkMoveDevice = false;
                }

                if ($rootScope.returnPickerObjectAddress && $rootScope.selectionId !== Devices.item.id) {
                    $scope.resetAddressPicker();
                }

                if ($rootScope.returnPickerObject && $rootScope.selectionId !== Devices.item.id) {
                    $scope.resetContactPicker();
                }

            }

            $scope.setupSR(ServiceRequest, configureSR);
            $scope.setupTemplates(configureTemplates, configureReceiptTemplate, configureReviewTemplate, ServiceRequest);
            $scope.getRequestor(ServiceRequest, Contacts);
            
            function configureReviewTemplate(){
                $scope.configure.actions.translate.submit = 'DEVICE_SERVICE_REQUEST.SUBMIT_DEVICE_REQUEST';
                $scope.configure.actions.submit = function(){
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
                    ServiceRequest.addField('assetInfo', assetInfo);
                    console.log('$scope.sr',$scope.sr);
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
                        update: {
                            translate: {
                                title: 'DEVICE_SERVICE_REQUEST.REQUESTED_UPDATE_TO_DEVICE',
                                installAddress: 'DEVICE_MGT.INSTALL_ADDRESS',
                                move: 'DEVICE_SERVICE_REQUEST.LEXMARK_MOVE_DEVICE'
                            }
                        },
                        contact: {
                            translate:{
                                title: 'DEVICE_SERVICE_REQUEST.DEVICE_CONTACT',
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
                        sourceAddress: $scope.device.updatedInstallAddress
                    }
                };

                if ($rootScope.formChangedValues) {
                    if ($rootScope.formChangedValues.indexOf('ipAddress') > -1 ||
                        $rootScope.formChangedValues.indexOf('hostName') > -1) {
                        $scope.configure.device.networkConfig = {
                            translate: {
                                title: 'DEVICE_SERVICE_REQUEST.DEVICE_NETWORK_CONFIGURATION',
                                ipAddress: 'DEVICE_MGT.IP_ADDRESS',
                                hostName: 'DEVICE_MGT.HOST_NAME'
                            }
                        };
                    }

                    if ($rootScope.formChangedValues.indexOf('costCenter') > -1 ||
                        $rootScope.formChangedValues.indexOf('customerDeviceTag') > -1) {
                        $scope.configure.device.deviceBilling = {
                            translate: {
                                title: 'DEVICE_SERVICE_REQUEST.DEVICE_BILLING_TRACKING',
                                deviceCostCenter: 'DEVICE_SERVICE_REQUEST.DEVICE_COST_CENTER',
                                customerDeviceTag: 'DEVICE_MGT.CUSTOMER_DEVICE_TAG'
                            }
                        };

                    }
                }

            }

            $scope.getChangedValues = function() {
                var formUpdatedValues = [];
                if ($rootScope.formChangedValues && $scope.returnedForm) {
                    formUpdatedValues = $rootScope.formChangedValues;
                }
                angular.forEach($scope.updateDevice, function(value, key) {
                    if(key[0] === '$') {
                        return;
                    }
                    if(!value.$pristine && formUpdatedValues.indexOf(value) === -1) {
                        formUpdatedValues.push(key);
                    }
                });
                return formUpdatedValues;
            };

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
