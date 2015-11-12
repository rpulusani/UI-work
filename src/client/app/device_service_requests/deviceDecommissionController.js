define(['angular', 'deviceServiceRequest', 'deviceManagement.deviceFactory'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestDevices')
    .controller('DeviceDecommissionController', ['$scope', '$rootScope', '$routeParams', '$location', '$translate', 'Devices',
        'ServiceRequestService', 'FormatterService', 'BlankCheck', 'DeviceServiceRequest','Contacts',
        function($scope, $rootScope, $routeParams, $location, $translate, Devices, ServiceRequest, FormatterService,
            BlankCheck, DeviceServiceRequest, Contacts) {


            $scope.goToReview = function() {
                $location.path(DeviceServiceRequest.route + '/decommission/' + $scope.device.id + '/review');
            };

            $scope.goToSubmit = function() {
                $location.path(DeviceServiceRequest.route + '/decommission/' + $scope.device.id + '/receipt');
            };

            $scope.goToContactPicker = function() {
                $rootScope.returnPickerObject = $scope.device;
                $rootScope.returnPickerSRObject = $scope.sr;
                $location.path(DeviceServiceRequest.route + '/decommission/pick_contact');
            };

            var redirect_to_list = function() {
                $location.path(Devices.route + '/');
            };

            if (Devices.item === null) {
                redirect_to_list();
            } else if($rootScope.selectedContact){
                $rootScope.device = $rootScope.returnPickerObject;
                $rootScope.sr = $rootScope.returnPickerSRObject;
                $rootScope.sr._links['primaryContact'] = $rootScope.selectedContact._links['self'];
                $rootScope.device.primaryContact = $rootScope.selectedContact;
                $rootScope.selectedContact = undefined;
            } else if(ServiceRequest.item && $rootScope.returnPickerObject){
                setupSR();
                $rootScope.device = $rootScope.returnPickerObject;
            }else {

                $scope.device = Devices.item;

                if (!BlankCheck.isNull(Devices.item._embeddedItems)) {
                    $scope.device.installAddress = Devices.item._embeddedItems['address'];
                    $scope.device.primaryContact = Devices.item._embeddedItems['primaryContact'];
                }

                if (BlankCheck.isNullOrWhiteSpace($scope.lexmarkPickupDevice)) {
                    $scope.device.lexmarkPickupDevice = false;
                }

                if (BlankCheck.isNullOrWhiteSpace($scope.pageCountQuestion)) {
                    $scope.device.pageCountQuestion = false;
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

            function configureReviewTemplate(){
                $scope.configure.actions.translations.submit = 'DEVICE_SERVICE_REQUEST.SUBMIT_DEVICE_DECOMMISSION';
                $scope.configure.actions.submit = function() {
                    $location.path(DeviceServiceRequest.route + '/decommission/' + $scope.device.id + '/receipt');
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
                            h1: 'DEVICE_SERVICE_REQUEST.REQUEST_DECOMMISSION_FOR',
                            h1Values:{'productModel': $scope.device.productModel},
                            body: 'MESSAGE.LIPSUM',
                            bodyValues: '',
                            readMore: ''
                        },
                        readMoreUrl: ''
                    },
                    device: {
                        removal:{
                            translate:{
                                title: 'DEVICE_SERVICE_REQUEST.DEVICE_REMOVAL',
                                pickup: 'DEVICE_SERVICE_REQUEST.DEVICE_PICKUP_LEXMARK',
                            },
                        },
                        information:{
                            translate: {
                                title: 'DEVICE_MGT.DEVICE_INFO',
                                serialNumber: 'DEVICE_MGT.SERIAL_NO',
                                partNumber: 'DEVICE_MGT.PART_NUMBER',
                                ipAddress: 'DEVICE_MGT.IP_ADDRESS',
                                installAddress: 'DEVICE_MGT.INSTALL_ADDRESS'
                            }
                        },
                        contact:{
                            translate:{
                                title: 'DEVICE_SERVICE_REQUEST.DEVICE_CONTACT',
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
                            abandonRequest:'DEVICE_SERVICE_REQUEST.ABANDON_DEVICE_DECOMMISSION',
                            submit: 'LABEL.REVIEW_SUBMIT'
                        },
                        submit: $scope.goToReview
                    },
                    modal:{
                        translate:{
                            abandonTitle: 'SERVICE_REQUEST.TITLE_ABANDON_MODAL',
                            abandondBody: 'SERVICE_REQUEST.BODY_ABANDON_MODAL',
                            abandonCancel:'SERVICE_REQUEST.ABANDON_MODAL_CANCEL',
                            abandonConfirm: 'SERVICE_REQUEST.ABANDON_MODAL_CONFIRM',
                        },
                        actions:{
                            abandon: function(){
                                $rootScope.returnPickerObject = undefined;
                                $rootScope.returnPickerSRObject = undefined;
                                $rootScope.selectedContact = undefined;
                            },
                            cancel: function(){
                                //do nothing
                            }
                        },
                        returnPath: Devices.route + '/'
                    },
                    contactPicker:{
                        translate:{
                            title: 'CONTACT.SELECT_CONTACT',
                            contactSelectText: 'CONTACT.SELECTED_CONTACT_IS',
                        },
                        returnPath: DeviceServiceRequest.route + '/decommission/' + $scope.device.id + '/review'
                    }
                };
            }

            if (!BlankCheck.isNull($scope.device.installAddress)) {
                $scope.formattedDeviceAddress = FormatterService.formatAddress($scope.device.installAddress);
            }

            if (!BlankCheck.isNull($scope.device.primaryContact) ||
                !BlankCheck.isNull($rootScope.decommissionContact)){
                $scope.formattedDeviceContact = FormatterService.formatContact($scope.device.primaryContact);
                if ($rootScope.decommissionContact) {
                    $scope.formattedPrimaryContact = FormatterService.formatContact($rootScope.decommissionContact);
                } else {
                    $scope.formattedPrimaryContact = FormatterService.formatContact($scope.device.primaryContact);
                }

            }

            if (!BlankCheck.isNullOrWhiteSpace($scope.device.lexmarkPickupDevice)) {
                $scope.formattedPickupDevice = FormatterService.formatYesNo($scope.device.lexmarkPickupDevice);
            }
        }
    ]);
});

