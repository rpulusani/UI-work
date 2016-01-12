define(['angular',
    'deviceServiceRequest',
    'deviceManagement.deviceFactory',
    'utility.imageService'],
    function(angular) {
    'use strict';
    angular.module('mps.serviceRequestDevices')
    .controller('DeviceServiceRequestDeviceController', [
        '$scope',
        '$location',
        '$translate',
        'Devices',
        'imageService',
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
            ImageService,
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
                    ServiceRequest.addField('description', '');
                    ServiceRequest.addRelationship('account', $scope.device);
                    ServiceRequest.addRelationship('asset', $scope.device, 'self');
                    ServiceRequest.addRelationship('primaryContact', $scope.device, 'contact');
                    ServiceRequest.addField('type', 'BREAK_FIX');
            };

            if (Devices.item === null && $location.path() !== DeviceServiceRequest.route + "/picker") {
                $scope.redirectToList();
            } else if($location.path() === DeviceServiceRequest.route + "/picker" && !$rootScope.selectedDevice){
                $scope.setupSR(ServiceRequest, configureSR);
                $scope.goToDevicePicker('DeviceServiceRequestDevice',Devices);
            } else if($location.path() === "/device_management/pick_device/DeviceServiceRequestDevice"){
                //do nothing
            }else if($rootScope.selectedContact &&
                $rootScope.returnPickerObject &&
                $rootScope.selectionId === Devices.item.id){
                    $scope.device = $rootScope.returnPickerObject;
                    $scope.sr = $rootScope.returnPickerSRObject;
                    ServiceRequest.addRelationship('primaryContact', $rootScope.selectedContact, 'self');
                    $scope.device.primaryContact = angular.copy($rootScope.selectedContact);
                    $scope.resetContactPicker();
            }else if($rootScope.contactPickerReset){
                $rootScope.device = Devices.item;
                $rootScope.contactPickerReset = false;
            }else if($rootScope.selectedDevice &&
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
                                embed:'contact, address'
                            }
                        };
                        Devices.item.get(options).then(function() {
                            $scope.device.selectedDevice.contact = Devices.item.contact.item;
                            $scope.formattedSelectedDeviceContact = FormatterService.formatContact($scope.device.selectedDevice.contact);
                        });
                        $scope.resetDevicePicker();
                        $location.path(DeviceServiceRequest.route + "/" + $scope.device.id + '/view');
                    }
            } else {
                $rootScope.device = Devices.item;
                if (Devices.item && !BlankCheck.isNull(Devices.item['address']) && Devices.item['address']['item']) {
                    $scope.device.installAddress = Devices.item['address']['item'];
                }else if(Devices.item && !BlankCheck.isNull(Devices.item['address'])){
                    $scope.device.installAddress = Devices.item['address'];
                }
                if (Devices.item && !BlankCheck.isNull(Devices.item['contact']) && Devices.item['contact']['item']) {
                    $scope.device.primaryContact = Devices.item['contact']['item'];
                }else if(Devices.item && !BlankCheck.isNull(Devices.item['contact'])){
                    $scope.device.primaryContact = Devices.item['contact'];
                }
                if ($rootScope.returnPickerObject && $rootScope.selectionId !== Devices.item.id) {
                    $scope.resetContactPicker();
                }
                if($rootScope.device){
                    var image =  ImageService;
                    image.getPartMediumImageUrl($rootScope.device.partNumber).then(function(url){
                        $scope.medImage = url;
                    }, function(reason){
                        NREUM.noticeError('Image url was not found reason: ' + reason);
                    });
                }
            }
            $scope.setupSR(ServiceRequest, configureSR);
            $scope.setupTemplates(configureTemplates, configureReceiptTemplate, configureReviewTemplate );
            if($rootScope.device){
                $scope.getRequestor(ServiceRequest, Contacts);
            }

            function configureReviewTemplate(){
                $scope.configure.actions.translate.submit = 'DEVICE_SERVICE_REQUEST.SUBMIT_DEVICE_REQUEST';
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
                if($scope.device){
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
                                product: 'DEVICE_MGT.PRODUCT_MODEL',
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
                        },
                        source: 'DeviceServiceRequestDevice'
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
                }else{
                   $scope.configure = {
                        devicePicker: {
                            singleDeviceSelection: true,
                            readMoreUrl: '',
                            translate: {
                                replaceDeviceTitle: 'SERVICE_REQUEST.SERVICE_REQUEST_PICKER_SELECTED',
                                h1: 'SERVICE_REQUEST.SERVICE_REQUEST_DEVICE',
                                body: 'MESSAGE.LIPSUM',
                                readMore: '',
                                confirmation:{
                                    abandon:'SERVICE_REQUEST.ABANDON_SERVICE_REQUEST',
                                    submit: 'DEVICE_MGT.REQUEST_SERVICE_DEVICE'
                                }
                            }

                        }
                    };
                }

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

