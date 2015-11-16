define(['angular',
    'deviceServiceRequest',
    'deviceManagement.deviceFactory'],
    function(angular) {
    'use strict';
    angular.module('mps.serviceRequestDevices')
    .controller('DeviceServiceRequestDeviceController', [
        '$scope',
        '$location',
        '$translate',
        'Devices',
        'ServiceRequestService',
        'BlankCheck',
        'DeviceServiceRequest',
        'FormatterService',
        'Contacts',
        '$rootScope',
        function($scope,
            $location,
            $translate,
            Devices,
            ServiceRequest,
            BlankCheck,
            DeviceServiceRequest,
            FormatterService,
            Contacts,
            $rootScope){

            var redirect_to_list = function() {
                $location.path(Devices.route + '/');
            };

             $scope.goToContactPicker = function() {
                $rootScope.returnPickerObject = $scope.device;
                $rootScope.returnPickerSRObject = $scope.sr;
                $location.path(DeviceServiceRequest.route + '/pick_contact');
            };

            if (Devices.item === null) {
                redirect_to_list();
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
                $rootScope.device = Devices.item;
                if (!BlankCheck.isNull(Devices.item._embeddedItems)) {
                    $rootScope.device.installAddress = Devices.item._embeddedItems['address'];
                    $rootScope.device.primaryContact = Devices.item._embeddedItems['primaryContact'];
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
                ServiceRequest.addRelationship($scope.sr, 'requester', $scope.device.requestedByContact._links['self']);
                $scope.requestedByContactFormatted =
                    FormatterService.formatContact($scope.device.requestedByContact);
            });

            function setupSR(){
                if(ServiceRequest.item === null){
                    ServiceRequest.newMessage();
                    $scope.sr = ServiceRequest.item;
                    ServiceRequest.addRelationship($scope.sr, 'account', $scope.device._links['account']);
                    ServiceRequest.addRelationship($scope.sr, 'asset', $scope.device._links['self']);
                    ServiceRequest.addRelationship($scope.sr, 'primaryContact', $scope.device._links['primaryContact']);
                    ServiceRequest.addField($scope.sr, 'type', 'BREAK_FIX');
                    ServiceRequest.addField($scope.sr, 'customerReferenceId', '');
                    ServiceRequest.addField($scope.sr, 'costCenter', '');
                    ServiceRequest.addField($scope.sr, 'notes', '');
                    ServiceRequest.addField($scope.sr, 'description', '');
                    ServiceRequest.addField($scope.sr, 'id', '');
                }else{
                   $scope.sr = ServiceRequest.item;
                }
            }

            function configureReviewTemplate(){
                $scope.configure.actions.translate.submit = 'DEVICE_SERVICE_REQUEST.SUBMIT_DEVICE_DECOMMISSION';
                $scope.configure.actions.submit = function(){
                    DeviceServiceRequest.saveMADC($scope.sr).then(function(){
                    $location.path(DeviceServiceRequest.route + '/' + $scope.device.id + '/receipt');
                }, function(reason){
                    NREUM.noticeError('Failed to create SR because: ' + reason);
                });
                };
            }
            function configureReceiptTemplate(){
                $scope.configure.header.translate.h1 = "DEVICE_SERVICE_REQUEST.DECOMMISSION_DEVICE_REQUEST_SUBMITTED";
                $scope.configure.header.translate.body = "DEVICE_SERVICE_REQUEST.DECOMMISION_DEVICE_SUBMIT_HEADER_BODY";
                $scope.configure.header.translate.bodyValues= {
                    'srNumber': FormatterService.getFormattedSRNumber($scope.sr),
                    'srHours': 24,
                    'deviceManagementUrl': 'device_management/',
                };
                $scope.configure.receipt = {
                    translate:{
                        title:"DEVICE_SERVICE_REQUEST.DECOMMISION_DEVICE_DETAIL",
                        titleValues: {'srNumber': FormatterService.getFormattedSRNumber($scope.sr) }
                    }
                };
                $scope.configure.contact.show.primaryAction = false;
            }
            function configureTemplates(){
                $scope.configure = {
                    header: {
                        translate:{
                            h1: 'DEVICE_SERVICE_REQUEST.REQUEST_SERVICE_FOR',
                            h1Values:{'productModel': $scope.device.productModel},
                            body: 'MESSAGE.LIPSUM',
                            bodyValues: '',
                            readMore: ''
                        },
                        readMoreUrl: ''
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
                        service:{
                            translate:{
                                title:'DEVICE_SERVICE_REQUEST.SERVICE_DETAILS',
                                description:'DEVICE_SERVICE_REQUEST.PROBLEM_DESCRIPTION'
                            }
                        }
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
                        }
                    },
                    detail:{
                        translate:{
                            title: 'DEVICE_SERVICE_REQUEST.ADDITIONAL_REQUEST_DETAILS',
                            referenceId: 'SERVICE_REQUEST.INTERNAL_REFERENCE_ID',
                            costCenter: 'SERVICE_REQUEST.REQUEST_COST_CENTER',
                            comments: 'LABEL.COMMENTS',
                            attachments: 'LABEL.ATTACHMENTS',
                            attachmentMessage: 'MESSAGE.ATTACHMENT',
                            fileList: ['.csv', '.xls', '.xlsx', '.vsd', '.doc', '.docx', '.ppt', '.pptx', '.pdf', '.zip'].join(', ')
                        },
                        show:{
                            referenceId: true,
                            costCenter: true,
                            comments: true,
                            attachements: true
                        }
                    },
                    actions:{
                        translate: {
                            abandonRequest:'SERVICE_REQUEST.ABANDON_SERVICE_REQUEST',
                            submit: 'LABEL.REVIEW_SUBMIT'
                        },
                        submit: function() {
                            $location.path(DeviceServiceRequest.route + '/' + $scope.device.id + '/review');
                        }
                    },
                    modal:{
                        translate:{
                            abandonTitle: 'SERVICE_REQUEST.TITLE_ABANDON_MODAL',
                            abandondBody: 'SERVICE_REQUEST.BODY_ABANDON_MODAL',
                            abandonCancel:'SERVICE_REQUEST.ABANDON_MODAL_CANCEL',
                            abandonConfirm: 'SERVICE_REQUEST.ABANDON_MODAL_CONFIRM',
                        },
                        returnPath: Devices.route + '/'
                    },
                    contactPicker:{
                        translate:{
                            title: 'CONTACT.SELECT_CONTACT',
                            contactSelectText: 'CONTACT.SELECTED_CONTACT_IS',
                        },
                        returnPath: DeviceServiceRequest.route + '/' + $scope.device.id + '/review'
                    }
                };
            }


            $scope.moveDevice = '';
            $scope.breakfixOption ='';
            $scope.formattedAddress = '';
            $scope.formattedTitleAddress = '';

            $scope.typeOfServiceOptions = [
                { value: 'BREAK_FIX_ONSITE_REPAIR', label: $translate.instant('DEVICE_SERVICE_REQUEST.BREAK_FIX_ONSITE_REPAIR') },
                { value: 'BREAK_FIX_EXCHANGE', label: $translate.instant('DEVICE_SERVICE_REQUEST.BREAK_FIX_EXCHANGE') },
                { value: 'BREAK_FIX_OPTION_EXCHANGE', label: $translate.instant('DEVICE_SERVICE_REQUEST.BREAK_FIX_OPTION_EXCHANGE') },
                { value: 'BREAK_FIX_REPLACEMENT', label: $translate.instant('DEVICE_SERVICE_REQUEST.BREAK_FIX_REPLACEMENT') },
                { value: 'BREAK_FIX_CONSUMABLE_SUPPLY_INSTALL', label: $translate.instant('DEVICE_SERVICE_REQUEST.BREAK_FIX_CONSUMABLE_SUPPLY_INSTALL') },
                { value: 'BREAK_FIX_CONSUMABLE_PART_INSTALL', label: $translate.instant('DEVICE_SERVICE_REQUEST.BREAK_FIX_CONSUMABLE_PART_INSTALL') },
                { value: 'BREAK_FIX_ONSITE_EXCHANGE', label: $translate.instant('DEVICE_SERVICE_REQUEST.BREAK_FIX_ONSITE_EXCHANGE') },
                { value: 'BREAK_FIX_OTHER', label: $translate.instant('DEVICE_SERVICE_REQUEST.BREAK_FIX_OTHER') }
            ];

            $scope.serviceSelected = function(option) {
                if ($scope.breakfixOption === 'BREAK_FIX_ONSITE_EXCHANGE') {
                    $scope.moveDevice = $translate.instant('LABEL.YES');
                }
                else {
                    $scope.moveDevice = $translate.instant('LABEL.NO');
                }
            };

             if (!BlankCheck.isNull($scope.device) && !BlankCheck.isNull($scope.device.installAddress)) {
                $scope.formattedDeviceAddress = FormatterService.formatAddress($scope.device.installAddress);
            }

            if (!BlankCheck.isNull($scope.device) && !BlankCheck.isNull($scope.device.primaryContact)){
                    $scope.formattedDeviceContact = FormatterService.formatContact($scope.device.primaryContact);
                    $scope.formattedPrimaryContact = FormatterService.formatContact($scope.device.primaryContact);
            }
        }
    ]);
});

