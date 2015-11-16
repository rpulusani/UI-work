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
        function($scope,
            $location,
            $routeParams,
            $rootScope,
            ServiceRequest,
            FormatterService,
            BlankCheck,
            DeviceServiceRequest,
            Devices,
            Contacts) {

            $scope.madcDevice = {};
            $scope.returnedForm = false;

            $scope.goToContactPicker = function() {
                $rootScope.returnPickerObject = $scope.device;
                $rootScope.returnPickerSRObject = $scope.sr;
                $location.path(DeviceServiceRequest.route + '/pick_contact');
            };

            var redirectToList = function() {
                $location.path(Devices.route + '/');
            };

            if (Devices.item === null) {
                redirectToList();
            } else if($rootScope.selectedContact){
                $rootScope.device = $rootScope.returnPickerObject;
                $rootScope.sr = $rootScope.returnPickerSRObject;
                $rootScope.sr._links['primaryContact'] = $rootScope.selectedContact._links['self'];
                $rootScope.device.primaryContact = angular.copy($rootScope.selectedContact);
                $rootScope.contactPickerReset = true;
                Devices.item = $rootScope.device;
            }else if($rootScope.contactPickerReset){
                $rootScope.device = Devices.item;
                setupSR();
                $rootScope.contactPickerReset = false;
            }else {
                $scope.device = Devices.item;
                if (!BlankCheck.isNull(Devices.item._embeddedItems)) {
                    $scope.device.currentInstallAddress = Devices.item._embeddedItems['address'];
                    $scope.device.updatedInstallAddress = $scope.device.currentInstallAddress;
                    $scope.device.primaryContact = Devices.item._embeddedItems['primaryContact'];
                }


                if (BlankCheck.isNullOrWhiteSpace($scope.device.lexmarkMoveDevice)) {
                    $scope.device.lexmarkMoveDevice = false;
                }

                setupSR();

            }


            configureTemplates();

            if($location.path().indexOf('receipt') > -1){
                configureReceiptTemplate();
            }else if($location.path().indexOf('review') > -1){
                 configureReviewTemplate();
            }

            Contacts.getAdditional($rootScope.currentUser, Contacts).then(function(){
                $scope.device.requestedByContact = Contacts.item;
                $scope.sr._links['requester'] = $scope.device.requestedByContact._links['self'];
                $scope.requestedByContactFormatted =
                    FormatterService.formatContact($scope.device.requestedByContact);
            });

            function setupSR(){
                if(DeviceServiceRequest.item === null){
                    DeviceServiceRequest.newMessage();
                    $scope.sr = DeviceServiceRequest.item;
                    $scope.sr._links['account'] = $scope.device._links['account'];
                    $scope.sr._links['asset'] = $scope.device._links['self'];
                    $scope.sr.customerReferenceId = '';
                    $scope.sr.costCenter = '';
                    $scope.sr.notes = '';
                    $scope.sr.id = $scope.sr.requestNumber;
                    $scope.sr._links['ui'] = 'http://www.google.com/1-XAEASD';
                }else{
                   $scope.sr = DeviceServiceRequest.item;
                }
            }
            function configureReviewTemplate(){
                $scope.configure.actions.translate.submit = 'DEVICE_SERVICE_REQUEST.SUBMIT_DEVICE_DECOMMISSION';
                $scope.configure.actions.submit = function(){
                    $location.path(DeviceServiceRequest.route + '/update/' + $scope.device.id + '/receipt');
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
                            abandonRequest:'DEVICE_SERVICE_REQUEST.DISCARD_DEVICE_CHANGES',
                            submit: 'DEVICE_SERVICE_REQUEST.SUBMIT_DEVICE_REQUEST'
                        }
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
                            title: 'CONTACT.SELECT_CONTACT',
                            contactSelectText: 'CONTACT.SELECTED_CONTACT_IS'
                        }
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

            function setMADCObject() {
                if ($scope.device.lexmarkMoveDevice === 'true') {
                    $scope.madcDevice.type = 'MADC_MOVE';
                } else {
                    $scope.madcDevice.type = 'DATA_ASSET_CHANGE';
                }
                $scope.madcDevice.assetInfo = {
                    ipAddress: $scope.device.ipAddress,
                    hostName: $scope.device.hostName,
                    assetTag: $scope.device.assetTag,
                    costCenter: $scope.device.costCenter
                };
                $scope.madcDevice.notes = $scope.sr.notes;
                $scope.madcDevice.customerReferenceNumber = $scope.sr.customerReferenceId;
                $scope.madcDevice.primaryContact = $scope.device.primaryContact;
                $scope.madcDevice.id = $scope.device.id;
                $scope.madcDevice.installAddress = $scope.device.currentInstallAddress;
                $scope.madcDevice.requestedByContact = $scope.device.requestedByContact;
            }

            $scope.goToReview = function() {
                $rootScope.formChangedValues = $scope.getChangedValues();
                $location.path(DeviceServiceRequest.route + '/update/' + $scope.device.id + '/review');
            };

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

            $scope.goToSubmit = function() {
                setMADCObject();
                DeviceServiceRequest.saveMADC($scope.madcDevice).then(function(){
                    $location.path(DeviceServiceRequest.route + '/update/' + $scope.device.id + '/receipt');
                }, function(reason){
                    NREUM.noticeError('Failed to create SR because: ' + reason);
                });
            };



            if (!BlankCheck.isNull($scope.device.updatedInstallAddress)) {
                $scope.formattedDeviceAddress = FormatterService.formatAddress($scope.device.updatedInstallAddress);
            }

            if (!BlankCheck.isNull($scope.device.primaryContact) || !BlankCheck.isNull($rootScope.updateDeviceContact)) {
                if ($rootScope.updateDeviceContact) {
                    $scope.device.primaryContact = $rootScope.updateDeviceContact;
                }
                $scope.formattedDeviceContact = FormatterService.formatContact($scope.device.primaryContact);
            }

            if (!BlankCheck.isNull($scope.device.primaryContact) || !BlankCheck.isNull($rootScope.updateRequestContact)) {
                if ($rootScope.updateRequestContact) {
                    $scope.device.primaryContact = $rootScope.updateRequestContact;
                }
                $scope.formattedPrimaryContact = FormatterService.formatContact($scope.device.primaryContact);
            }

            if (!BlankCheck.isNull($scope.device.lexmarkMoveDevice)) {
                $scope.formattedMoveDevice = FormatterService.formatYesNo($scope.device.lexmarkMoveDevice);
            }

        }
    ]);
});
