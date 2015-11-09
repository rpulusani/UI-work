define(['angular', 'deviceServiceRequest', 'deviceManagement.deviceFactory','utility.formatters'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestDevices')
    .controller('DeviceUpdateController', ['$scope', '$location', '$filter', '$routeParams', '$rootScope', 'ServiceRequestService',
        'FormatterService', 'BlankCheck','DeviceServiceRequest', 'Devices', 'Contacts',
        function($scope, $location, $filter, $routeParams, $rootScope, ServiceRequest, FormatterService, 
            BlankCheck, DeviceServiceRequest, Devices, Contacts) {
            
            var redirectToList = function() {
                $location.path(Devices.route + '/');
            };

            if (Devices.item === null) {
                redirectToList();
            } else if ($rootScope.updateDevice !== undefined && $routeParams.return) {
                $scope.device = $rootScope.updateDevice;
                $scope.sr = $rootScope.updateSr;
                configureTemplates();
            } else {
                $scope.device = Devices.item;
                $scope.device.currentInstallAddress = Devices.item._embeddedItems['address'];
                $scope.device.updatedInstallAddress = $scope.device.currentInstallAddress;
                $scope.device.primaryContact = Devices.item._embeddedItems['primaryContact'];

                if (BlankCheck.isNullOrWhiteSpace($scope.lexmarkMoveDevice)) {
                    $scope.device.lexmarkMoveDevice = false;
                }
                
                setupSR();
                configureTemplates();

                if($location.path().indexOf('receipt') > -1){
                    configureReceiptTemplate();
                }
            }

            Contacts.getAdditional($rootScope.currentUser, Contacts).then(function(){
                $scope.device.requestedByContact = Contacts.item;
                $scope.sr._links['requester'] = $scope.device.requestedByContact._links['self'];
                $scope.requestedByContactFormatted =
                    FormatterService.formatContact($scope.device.requestedByContact);
            });

            function setupSR(){
                if(ServiceRequest.item === null){
                    ServiceRequest.newMessage();
                    $scope.sr = ServiceRequest.item;
                    $scope.sr._links['account'] = $scope.device._links['account'];
                    $scope.sr._links['asset'] = $scope.device._links['self'];
                    $scope.sr.customerReferenceId = '';
                    $scope.sr.costCenter = '';
                    $scope.sr.notes = '';
                    $scope.sr.id = '1-XAEASD';
                    $scope.sr._links['ui'] = 'http://www.google.com/1-XAEASD';
                }else{
                   $scope.sr = ServiceRequest.item;
                }
            }

            function configureReceiptTemplate(){
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

            function configureTemplates(){
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
                        networkConfig: {
                            translate: {
                                title: 'DEVICE_SERVICE_REQUEST.DEVICE_NETWORK_CONFIGURATION',
                                ipAddress: 'DEVICE_MGT.IP_ADDRESS',
                                hostName: 'DEVICE_MGT.HOST_NAME'
                            }
                        },
                        deviceBilling: {
                            translate: {
                                title: 'DEVICE_SERVICE_REQUEST.DEVICE_BILLING_TRACKING',
                                deviceCostCenter: 'DEVICE_SERVICE_REQUEST.DEVICE_COST_CENTER',
                                customerDeviceTag: 'DEVICE_MGT.CUSTOMER_DEVICE_TAG'
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
                            abandonConfirm: 'SERVICE_REQUEST.ABANDON_MODAL_CONFIRM',
                        },
                        returnPath: Devices.route + '/'
                    },
                    contactPicker: {
                        translate: {
                            title: 'CONTACT.SELECT_CONTACT',
                            contactSelectText: 'CONTACT.SELECTED_CONTACT_IS',
                        }
                    }
                };
                if (!BlankCheck.isNull($rootScope.currentSelected) && $rootScope.currentSelected === 'updateRequestContact') {
                    $scope.configure.contactPicker["returnPath"] = DeviceServiceRequest.route + '/update/' + $scope.device.id + '/review'
                } else {
                    $scope.configure.contactPicker["returnPath"] = DeviceServiceRequest.route + '/' + $scope.device.id + '/update'
                }

            }

            $scope.goToReview = function() {
                console.log($scope.device.lexmarkMoveDevice);
                $scope.edit = {};
                angular.copy($scope.updateDevice, $scope.edit);
                //console.log(findDiff($scope.updateDevice, $scope.edit));
                $location.path(DeviceServiceRequest.route + '/update/' + $scope.device.id + '/review');
            };

            function findDiff(original, edited){
                var diff = {}
                for(var key in original){
                    if(original[key] && original[key].$modelValue) {
                        console.log('original ',original[key].$modelValue);
                        console.log('edited', edited[key]);
                        if(original[key].$modelValue !== edited[key].$modelValue) {
                            console.log('original ',original[key].$modelValue);
                            console.log('edited', edited[key].$modelValue);
                            diff[key] = edited[key];
                        }
                    }
                    // console.log('original ',original[key]);
                    // console.log('edited', edited[key]);
                    // if(original[key].$modelValue !== edited[key].$modelValue) {
                    //     console.log('original ',original[key].$modelValue);
                    //     console.log('edited', edited[key].$modelValue);
                    //     diff[key] = edited[key];
                    // }
                }
                return diff;
            };

            $scope.goToSubmit = function() {
                Devices.get(device, 'address,primaryContact').then(function(){
                    $location.path(Devices.route + '/' + device.id + '/review');
                });

                $location.path(DeviceServiceRequest.route + '/update/' + $scope.device.id + '/receipt');
            };

            $scope.goToContactPicker = function(currentSelected) {
                $rootScope.currentSelected = currentSelected;
                $rootScope.updateDevice = $scope.device;
                $rootScope.updateSr = $scope.sr;
                $location.path(DeviceServiceRequest.route + '/update/pick_contact');
            };

            console.log($routeParams);
            if ($routeParams.updateid) {
                console.log($scope.lexmarkMoveDevice);
                if (!BlankCheck.isNullOrWhiteSpace($scope.lexmarkMoveDevice)) {
                    $scope.formattedMoveDevice = FormatterService.formatYesNo($scope.lexmarkMoveDevice);
                    console.log('inside condition');
                    console.log($scope.formattedMoveDevice);
                }
            }

            if ($rootScope.currentRowList !== undefined && $rootScope.currentRowList.length >= 1 
                && $routeParams.return && $routeParams.return !== 'discard') {
                if ($rootScope.currentSelected) {
                        switch($rootScope.currentSelected){
                            case 'updateDeviceContact':
                                $rootScope.updateDeviceContact = $rootScope.currentRowList[$rootScope.currentRowList.length - 1].entity;
                            break;
                            case 'updateRequestContact':
                                $rootScope.updateRequestContact = $rootScope.currentRowList[$rootScope.currentRowList.length - 1].entity;
                            break;
                        }
                    }
            }
            
            
            // if ($rootScope.newDevice !== undefined && $routeParams.return) {
            //     $scope.device = $rootScope.newDevice;
            // } 
            

            // if ($rootScope.currentRowList !== undefined && $rootScope.currentRowList.length >= 1 
            //     && $routeParams.return && $routeParams.return !== 'discard') {
            //     if ($rootScope.currentRowList[$rootScope.currentRowList.length - 1].entity.serialNumber !== undefined) {
            //         console.log("inside device condition");
            //         $scope.device.selectedDevice = $rootScope.currentRowList[$rootScope.currentRowList.length - 1].entity;
            //     } else {
            //         if ($rootScope.currentSelected) {
            //             switch($rootScope.currentSelected){
            //                 case 'deviceContact':
            //                     $scope.device.selectedContact = $rootScope.currentRowList[$rootScope.currentRowList.length - 1].entity;
            //                 break;
            //                 case 'requestPrimaryContact':
            //                     $scope.device.requestPrimaryContact = $rootScope.currentRowList[$rootScope.currentRowList.length - 1].entity;
            //                 break;
            //                 case 'requestSecondaryContact':
            //                     $scope.device.requestSecondaryContact = $rootScope.currentRowList[$rootScope.currentRowList.length - 1].entity;
            //                 break;
            //             }
            //         }
                    
            //     }
            // }

            // $scope.goToBrowse = function(device) {
            //     $rootScope.newDevice = device;
            //     $location.path('/device_management/pick_device');
            // };

            // $scope.goToReview = function() {
            //     $scope.isReview = true;
            // };

            // $scope.goToAdd = function() {
            //     $scope.isReview = false;
            // };

            // $scope.goToSubmit = function() {
            //     $scope.isSubmitted = true;
            // };

            // $scope.goToCreate = function() {
            //     $location.path('/service_requests/devices/new');
            // };

            // $scope.isDeviceSelected = function(){
            //     if ($rootScope.currentRowList !== undefined && $rootScope.currentRowList.length >= 1 
            //         && $routeParams.return && $routeParams.return !== 'discard') {
            //         return true;
            //     } else {
            //         return false;
            //     }
            // };

            // if ($scope.device.address) {
            //     $scope.installAddress = Format.formatAddress($scope.device.address);
            // }

            if (!BlankCheck.isNull($scope.device.updatedInstallAddress)) {
                $scope.formattedDeviceAddress = FormatterService.formatAddress($scope.device.updatedInstallAddress);
            }

            if (!BlankCheck.isNull($scope.device.primaryContact) || 
                !BlankCheck.isNull($rootScope.updateContact)){
                if ($rootScope.updateDeviceContact) {
                    $scope.formattedDeviceContact = FormatterService.formatContact($rootScope.updateDeviceContact);
                } else {
                    $scope.formattedDeviceContact = FormatterService.formatContact($scope.device.primaryContact);
                }
                
                if ($rootScope.updateRequestContact) {
                    $scope.formattedPrimaryContact = FormatterService.formatContact($rootScope.updateRequestContact);
                } else {
                    $scope.formattedPrimaryContact = FormatterService.formatContact($scope.device.primaryContact);
                }
                
            }

            if (!BlankCheck.isNull($scope.device.lexmarkMoveDevice)) {
                console.log('device move question ' + $scope.device.lexmarkMoveDevice);
                $scope.formattedMoveDevice = FormatterService.formatYesNo($scope.device.lexmarkMoveDevice);
                console.log('formatted move question ' + $scope.formattedMoveDevice);
                //$scope.formattedDeviceAddress = FormatterService.formatAddress($scope.device.updatedInstallAddress);
            }
            
        }
    ]);
});
