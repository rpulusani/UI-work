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

            $scope.madcDevice = {};
            $scope.returnedForm = false;

            SRHelper.addMethods(Devices, $scope, $rootScope);

            $scope.goToContactPicker = function(currentSelected) {
                $rootScope.currentSelected = currentSelected;
                $rootScope.selectionId = $scope.device.id;
                $rootScope.contactReturnPath = $location.url();
                $rootScope.returnPickerObject = $scope.device;
                $rootScope.returnPickerSRObject = $scope.sr;
                $location.path(DeviceServiceRequest.route + '/update/pick_contact');
            };

            $scope.goToAddressPicker = function() {
                $rootScope.addressReturnPath = $location.url();
                $rootScope.selectionId = $scope.device.id;
                $rootScope.returnPickerObjectAddress = $scope.device;
                $rootScope.returnPickerSRObjectAddress = $scope.sr;
                $location.path(DeviceServiceRequest.route + '/update/pick_address');
            };

            $scope.goToReview = function() {
                console.log('in go to review');
                $rootScope.formChangedValues = $scope.getChangedValues();
                $location.path(DeviceServiceRequest.route + '/update/' + $scope.device.id + '/review');
            };

            $scope.goToSubmit = function() {
                setMADCObject();
                DeviceServiceRequest.saveMADC($scope.madcDevice).then(function(){
                    $location.path(DeviceServiceRequest.route + '/update/' + $scope.device.id + '/receipt');
                }, function(reason){
                    NREUM.noticeError('Failed to create SR because: ' + reason);
                });
            };

            var configureSR = function(ServiceRequest){
                var assetInfo = {
                    ipAddress: $scope.device.ipAddress,
                    hostName: $scope.device.hostName,
                    assetTag: $scope.device.assetTag,
                    costCenter: $scope.device.costCenter
                };
                ServiceRequest.addField('assetInfo', assetInfo);
                ServiceRequest.addRelationship('account', $scope.device);
                ServiceRequest.addRelationship('asset', $scope.device, 'self');

                if ($scope.device.lexmarkMoveDevice === 'true') {
                    ServiceRequest.addField('type', 'MADC_MOVE');
                    ServiceRequest.addRelationship('sourceAddress', $scope.device.currentInstallAddress, 'self');
                    ServiceRequest.addRelationship('destinationAddress', $scope.device.updatedInstallAddress, 'self');
                } else {
                    ServiceRequest.addRelationship('sourceAddress', $scope.device.updatedInstallAddress, 'self');
                    ServiceRequest.addField('type', 'DATA_ASSET_CHANGE');
                }
            };

            var redirectToList = function() {
                $location.path(Devices.route + '/');
            };

            if (Devices.item === null) {
                redirectToList();
            } else if($rootScope.selectedContact 
                    && $rootScope.returnPickerObject 
                    && $rootScope.selectionId === Devices.item.id){
                console.log('in select contact');
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
                console.log('in select address');
                $scope.device = $rootScope.returnPickerObjectAddress;
                $scope.sr = $rootScope.returnPickerSRObjectAddress;
                $scope.device.updatedInstallAddress = angular.copy($rootScope.selectedAddress);
                Devices.item = $scope.device;
            } else {
                $scope.device = Devices.item;
                if (!BlankCheck.isNull(Devices.item.address.item)) {
                    $scope.device.currentInstallAddress = Devices.item.address.item;
                    $scope.device.updatedInstallAddress = $scope.device.currentInstallAddress;
                }
                if (!BlankCheck.isNull(Devices.item.contact.item)) {
                    $scope.device.deviceContact = Devices.item.contact.item;
                }


                if (BlankCheck.isNullOrWhiteSpace($scope.device.lexmarkMoveDevice)) {
                    $scope.device.lexmarkMoveDevice = false;
                }

                //setupSR();

                // $rootScope.currentUser.item.data
                // We'd want to actually do Users.item.links or Users.getAddi
                // var user = {item: {}}; 
                // console.log($rootScope.currentUser.item);
                // user.item = Contacts.createItem($rootScope.currentUser.item);

                // user.item.links.contact().then(function() {
                //     console.log('user contact',user.item);
                //     $scope.device.requestedByContact = user.item.contact.item;
                //     $scope.sr._links['requester'] = $scope.device.requestedByContact._links['self'];
                //     $scope.requestedByContactFormatted =
                //         FormatterService.formatContact($scope.device.requestedByContact);
                // });

                if ($rootScope.returnPickerObjectAddress && $rootScope.selectionId !== Devices.item.id) {
                    resetAddressPicker();
                }

                if ($rootScope.returnPickerObject && $rootScope.selectionId !== Devices.item.id) {
                    resetContactPicker();
                }

            }

            $scope.setupSR(ServiceRequest, configureSR);
            $scope.setupTemplates(configureTemplates, configureReceiptTemplate, configureReviewTemplate );
            $scope.getRequestor(ServiceRequest, Contacts);
            //configureTemplates();

            // if($location.path().indexOf('receipt') > -1){
            //     configureReceiptTemplate();
            // }else if($location.path().indexOf('review') > -1){
            //      configureReviewTemplate();
            // }

            // function setupSR(){
            //     if(DeviceServiceRequest.item === null){
            //         DeviceServiceRequest.newMessage();
            //         $scope.sr = DeviceServiceRequest.item;
            //         $scope.sr._links['account'] = $scope.device._links['account'];
            //         $scope.sr._links['asset'] = $scope.device._links['self'];
            //         $scope.sr.customerReferenceId = '';
            //         $scope.sr.costCenter = '';
            //         $scope.sr.notes = '';
            //         $scope.sr.id = $scope.sr.requestNumber;
            //         $scope.sr._links['ui'] = 'http://www.google.com/1-XAEASD';
            //     }else{
            //        $scope.sr = DeviceServiceRequest.item;
            //     }
            // }
            function configureReviewTemplate(){
                $scope.configure.actions.translate.submit = 'DEVICE_SERVICE_REQUEST.SUBMIT_DEVICE_REQUEST';
                $scope.configure.actions.submit = $scope.goToSubmit
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

            function resetAddressPicker(){
                $rootScope.returnPickerObjectAddress = undefined;
                $rootScope.returnPickerSRObjectAddress = undefined;
                $rootScope.selectedAddress = undefined;
            }

            function resetContactPicker(){
                $rootScope.returnPickerObject = undefined;
                $rootScope.returnPickerSRObject = undefined;
                $rootScope.selectedContact = undefined;
                $rootScope.currentSelected = undefined;
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
                if (!BlankCheck.isNull($scope.device.updatedInstallAddress)) {
                    $scope.formattedDeviceAddress = FormatterService.formatAddress($scope.device.updatedInstallAddress);
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

                if (!BlankCheck.isNull($scope.device.updatedInstallAddress)) {
                    $scope.formattedInstalledAddress = FormatterService.formatAddress($scope.device.updatedInstallAddress);
                }
            };
            
            $scope.formatReceiptData(formatAdditionalData);
        }
    ]);
});
