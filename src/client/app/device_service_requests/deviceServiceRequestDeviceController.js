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
        'SRControllerHelperService',
        function($scope,
            $location,
            $translate,
            Devices,
            ServiceRequest,
            BlankCheck,
            DeviceServiceRequest,
            FormatterService,
            Contacts,
            $rootScope,
            SRHelper){

            $scope.formattedAddress = '';
            SRHelper.addMethods(Devices, $scope, $rootScope);

            var configureSR = function(ServiceRequest){
                    ServiceRequest.addRelationship('account', $scope.device);
                    ServiceRequest.addRelationship('asset', $scope.device, 'self');
                    ServiceRequest.addRelationship('contact', $scope.device);
                    ServiceRequest.addField('type', 'BREAK_FIX');
            };

            if (Devices.item === null) {
                $scope.redirectToList();
            } else if($rootScope.selectedContact){
                $rootScope.device = $rootScope.returnPickerObject;
                $rootScope.sr = $rootScope.returnPickerSRObject;
                $rootScope.sr._links['contact'] = $rootScope.selectedContact._links['self'];
                $rootScope.device.primaryContact = angular.copy($rootScope.selectedContact);
                $rootScope.contactPickerReset = true;
                Devices.item = $rootScope.device;
            }else if($rootScope.contactPickerReset){
                $rootScope.device = Devices.item;
                $rootScope.contactPickerReset = false;
            }else {
                $rootScope.device = Devices.item;
                if (!BlankCheck.isNull(Devices.item['address'])) {
                    $scope.device.installAddress = Devices.item['address']['item'];
                }
                if (!BlankCheck.isNull(Devices.item['contact'])) {
                    $scope.device.primaryContact = Devices.item['contact']['item'];
                }
            }
            $scope.setupSR(ServiceRequest, configureSR);
            $scope.setupTemplates(configureTemplates, configureReceiptTemplate, configureReviewTemplate );
            $scope.getRequestor(ServiceRequest, Contacts);

            function configureReviewTemplate(){
                $scope.configure.actions.translate.submit = 'DEVICE_SERVICE_REQUEST.SUBMIT_DEVICE_DECOMMISSION';
                $scope.configure.actions.submit = function(){
                   var deferred = DeviceServiceRequest.post({
                         item:  $scope.sr
                    });

                    deferred.then(function(result){
                        ServiceRequest.item = DeviceServiceRequest.item;
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

            /* Format Data for receipt */
            var formatAdditionalData = function(){
                if (!BlankCheck.isNull($scope.device) && !BlankCheck.isNull($scope.device.installAddress)) {
                    $scope.formattedDeviceAddress = FormatterService.formatAddress($scope.device.installAddress);
                }

                if (!BlankCheck.isNull($scope.device) && !BlankCheck.isNull($scope.device.primaryContact)){
                        $scope.formattedDeviceContact = FormatterService.formatContact($scope.device.primaryContact);
                        $scope.formattedPrimaryContact = FormatterService.formatContact($scope.device.primaryContact);
                }
            };

            $scope.formatReceiptData(formatAdditionalData);
        }
    ]);
});

