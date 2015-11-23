define(['angular',
    'deviceServiceRequest',
    'deviceManagement.deviceFactory'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestDevices')
    .controller('DeviceDecommissionController', [
        '$scope',
        '$rootScope',
        '$routeParams',
        '$location',
        '$translate',
        'Devices',
        'ServiceRequestService',
         'FormatterService',
         'BlankCheck',
         'DeviceServiceRequest',
         'Contacts',
         'SRControllerHelperService',
        function($scope,
            $rootScope,
            $routeParams,
             $location,
             $translate,
             Devices,
             ServiceRequest,
             FormatterService,
            BlankCheck,
            DeviceServiceRequest,
            Contacts,
            SRHelper) {

            SRHelper.addMethods(Devices, $scope, $rootScope);

            var configureSR = function(ServiceRequest){
                    ServiceRequest.addRelationship('account', $scope.device);
                    ServiceRequest.addRelationship('asset', $scope.device, 'self');
                    ServiceRequest.addRelationship('primaryContact', $scope.device);

                    ServiceRequest.addField('type', 'MADC_DECOMMISSION');
            };

            if (Devices.item === null) {
                $scope.redirectToList();
            } else if($rootScope.selectedContact){
                $rootScope.device = $rootScope.returnPickerObject;
                $rootScope.sr = $rootScope.returnPickerSRObject;
                $rootScope.sr._links['primaryContact'] = $rootScope.selectedContact._links['self'];
                $rootScope.device.primaryContact = angular.copy($rootScope.selectedContact);
                $rootScope.contactPickerReset = true;
                Devices.item = $rootScope.device;
            } else if($rootScope.contactPickerReset){
                $rootScope.device = Devices.item;
                $rootScope.contactPickerReset = false;
            }else {

                $scope.device = Devices.item;

                if (!BlankCheck.isNull(Devices.item['address'])) {
                    $scope.device.installAddress = Devices.item['address']['item'];
                }
                if (!BlankCheck.isNull(Devices.item['contact'])) {
                    $scope.device.primaryContact = Devices.item['contact']['item'];
                }


                if (BlankCheck.isNullOrWhiteSpace($scope.device.lexmarkPickupDevice)) {
                    $scope.device.lexmarkPickupDevice = false;
                }

                if (BlankCheck.isNullOrWhiteSpace($scope.pageCountQuestion)) {
                    $scope.device.pageCountQuestion = false;
                }
            }

            $scope.setupSR(ServiceRequest, configureSR);
            $scope.setupTemplates(configureTemplates, configureReceiptTemplate, configureReviewTemplate );
            $scope.getRequestor(ServiceRequest, Contacts);

            var updateSRObjectForSubmit = function() {

                if ($scope.device.lexmarkPickupDevice === 'true') {
                    ServiceRequest.addRelationship('sourceAddress', $scope.device, 'address');
                    $scope.sr = ServiceRequest.item;
                    $scope.sr.type = 'MADC_DECOMMISSION';
                } else {
                    $scope.sr.type = 'DATA_ASSET_DEREGISTER';
                }



            };

            function configureReviewTemplate(){
                $scope.configure.actions.translate.submit = 'DEVICE_SERVICE_REQUEST.SUBMIT_DEVICE_DECOMMISSION';
                $scope.configure.actions.submit = function(){
                    updateSRObjectForSubmit();
                    var deferred = DeviceServiceRequest.post({
                         item:  $scope.sr
                    });
                    deferred.then(function(result){
                        ServiceRequest.item = DeviceServiceRequest.item;
                       $location.path(DeviceServiceRequest.route + '/decommission/' + $scope.device.id + '/receipt');
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
                                pageCount: 'DEVICE_SERVICE_REQUEST.DEVICE_PAGE_COUNTS'
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
                        submit: function(){
                            $location.path(DeviceServiceRequest.route + '/decommission/' + $scope.device.id + '/review');
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

            if (!BlankCheck.isNull($scope.sr.notes)) {
                $scope.formattedNotes = FormatterService.formatNoneIfEmpty($scope.sr.notes);
            }

            if (!BlankCheck.isNull($scope.sr.customerReferenceId)) {
                $scope.formattedReferenceId = FormatterService.formatNoneIfEmpty($scope.sr.customerReferenceId);
            }

            if (!BlankCheck.isNull($scope.sr.costCenter)) {
                $scope.formattedCostCenter = FormatterService.formatNoneIfEmpty($scope.sr.costCenter);
            }

        }
    ]);
});

