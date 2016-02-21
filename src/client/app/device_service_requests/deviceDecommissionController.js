define(['angular',
    'deviceServiceRequest',
    'deviceManagement.deviceFactory',
    'utility.imageService'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestDevices')
    .controller('DeviceDecommissionController', [
        '$scope',
        '$rootScope',
        '$routeParams',
        '$location',
        '$translate',
        'Devices',
        'imageService',
        'ServiceRequestService',
        'FormatterService',
        'BlankCheck',
        'DeviceServiceRequest',
        'Contacts',
        'SRControllerHelperService',
        'TombstoneService',
        '$timeout',
        'tombstoneWaitTimeout',
        function($scope,
            $rootScope,
            $routeParams,
            $location,
            $translate,
            Devices,
            ImageService,
            ServiceRequest,
            FormatterService,
            BlankCheck,
            DeviceServiceRequest,
            Contacts,
            SRHelper,
            Tombstone,
            $timeout,
            tombstoneWaitTimeout) {

            $scope.isLoading = false;
            SRHelper.addMethods(Devices, $scope, $rootScope);

            var configureSR = function(ServiceRequest){
                    ServiceRequest.addRelationship('account', $scope.device);
                    ServiceRequest.addRelationship('asset', $scope.device, 'self');
                    ServiceRequest.addRelationship('primaryContact', $scope.device, 'contact');

                    ServiceRequest.addField('type', 'MADC_DECOMMISSION');
            };

            $scope.$broadcast('setupPrintAndExport', $scope);


            if (Devices.item === null) {
                $scope.redirectToList();
            } else if($rootScope.selectedContact
                && $rootScope.returnPickerObject
                && $rootScope.selectionId === Devices.item.id){
                $scope.device = $rootScope.returnPickerObject;
                $scope.sr = $rootScope.returnPickerSRObject;
                ServiceRequest.addRelationship('primaryContact', $rootScope.selectedContact, 'self');
                $scope.device.primaryContact = angular.copy($rootScope.selectedContact);
                $scope.resetContactPicker();
            }else if($rootScope.contactPickerReset){
                $rootScope.device = Devices.item;
                $rootScope.contactPickerReset = false;
            }else {

                $scope.device = Devices.item;

                if (!BlankCheck.isNull(Devices.item['address'])) {
                    $scope.device.installAddress = $scope.device['address']['item'];
                }
                if (!BlankCheck.isNull(Devices.item['contact'])) {
                    $scope.device.primaryContact = $scope.device['contact']['item'];
                }


                if (BlankCheck.isNullOrWhiteSpace($scope.device.lexmarkPickupDevice)) {
                    $scope.device.lexmarkPickupDevice = false;
                }

                if (BlankCheck.isNullOrWhiteSpace($scope.pageCountQuestion)) {
                    $scope.device.pageCountQuestion = false;
                }

                if ($rootScope.returnPickerObject && $rootScope.selectionId !== Devices.item.id) {
                    $scope.resetContactPicker();
                }

                var image =  ImageService;
                image.getPartMediumImageUrl($scope.device.partNumber).then(function(url){
                    $scope.medImage = url;
                }, function(reason){
                     NREUM.noticeError('Image url was not found reason: ' + reason);
                });
            }

            $scope.setupSR(ServiceRequest, configureSR);
            $scope.setupTemplates(configureTemplates, configureReceiptTemplate, configureReviewTemplate );
            $scope.getRequestor(ServiceRequest, Contacts);

            var updateSRObjectForSubmit = function() {
                var meterReads = [];
                if ($scope.device.lexmarkPickupDevice === 'true') {
                    $scope.sr = ServiceRequest.item;
                    $scope.sr.type = 'MADC_DECOMMISSION';
                } else {
                    $scope.sr.type = 'DATA_ASSET_DEREGISTER';
                }

                ServiceRequest.addRelationship('sourceAddress', $scope.device, 'address');
                for (var countObj in $scope.device.newCount) {
                    var meterRead = {};
                    meterRead.type = countObj;
                    meterRead.value = $scope.device.newCount[countObj];
                    meterReads.push(meterRead);
                }
                for (var dateObj in $scope.device.newDate) {
                    for (var i=0; i<meterReads.length; i++) {
                        if(meterReads[i].type && meterReads[i].type === dateObj) {
                            meterReads[i].updateDate = FormatterService.formatDateForPost($scope.device.newDate[dateObj]);
                        }
                    }
                }
                ServiceRequest.addField('meterReads', meterReads);
                ServiceRequest.addField('attachments', $scope.files_complete);
            };

            function configureReviewTemplate(){
                $scope.configure.actions.translate.submit = 'DEVICE_SERVICE_REQUEST.SUBMIT_DEVICE_DECOMMISSION';
                $scope.configure.actions.submit = function(){
                  if(!$scope.isLoading) {
                    $scope.isLoading = true;
                    updateSRObjectForSubmit();
                    var deferred = DeviceServiceRequest.post({
                         item:  $scope.sr
                    });
                    deferred.then(function(result){
                      if(DeviceServiceRequest.item._links['tombstone']) {
                        $location.search('tab', null);
                        $timeout(function(){
                          DeviceServiceRequest.getAdditional(DeviceServiceRequest.item, Tombstone, 'tombstone', true).then(function(){
                          if(Tombstone.item && Tombstone.item.siebelId) {
                            ServiceRequest.item.requestNumber = Tombstone.item.siebelId;
                            $location.path(DeviceServiceRequest.route + '/decommission/' + $scope.device.id + '/receipt/notqueued');
                          } else {
                            ServiceRequest.item = DeviceServiceRequest.item;
                            $location.path(DeviceServiceRequest.route + '/decommission/' + $scope.device.id + '/receipt/queued');
                          }
                        });
                        }, tombstoneWaitTimeout);
                     }
                    }, function(reason){
                        NREUM.noticeError('Failed to create SR because: ' + reason);
                    });

                  }
                };
            }
            function configureReceiptTemplate(){
              if($routeParams.queued === 'queued') {
                $scope.configure.header.translate.h1="QUEUE.RECEIPT.TXT_TITLE";
                $scope.configure.header.translate.h1Values = {
                    'type': $translate.instant('SERVICE_REQUEST_COMMON.TYPES.' + DeviceServiceRequest.item.type)
                };
                $scope.configure.header.translate.body = "QUEUE.RECEIPT.TXT_PARA";
                $scope.configure.header.translate.bodyValues= {
                    'srHours': 24
                };
                $scope.configure.header.translate.readMore = undefined;
                $scope.configure.header.translate.action="QUEUE.RECEIPT.TXT_ACTION";
                $scope.configure.header.translate.actionValues = {
                    actionLink: Devices.route,
                    actionName: $translate.instant('DEVICE_MAN.MANAGE_DEVICES.TXT_MANAGE_DEVICES')
                };
                $scope.configure.receipt = {
                    translate:{
                        title:"QUEUE.COMMON.TXT_GENERIC_SERVICE_REQUEST_TITLE",
                        titleValues: {'srNumber': $translate.instant('QUEUE.RECEIPT.TXT_GENERATING_REQUEST') }
                    }
                };
                $scope.configure.queued = true;
              } else {
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
            }
            function configureTemplates(){
                if($scope.device){
                    $scope.configure = {
                        header: {
                            translate:{
                                h1: 'DEVICE_SERVICE_REQUEST.REQUEST_DECOMMISSION_FOR',
                                h1Values:{'productModel': $scope.device.productModel},
                                body: 'MESSAGE.LIPSUM',
                                bodyValues: '',
                                readMore: ''
                            },
                            readMoreUrl: '',
                            showCancelBtn: false
                        },
                        device: {
                            removal:{
                                translate:{
                                    title: 'DEVICE_SERVICE_REQUEST.DEVICE_REMOVAL',
                                    pickup: 'DEVICE_SERVICE_REQUEST.DEVICE_PICKUP_LEXMARK',
                                    pageCount: 'DEVICE_SERVICE_REQUEST.DEVICE_PAGE_COUNTS'
                                },
                                source: 'decommission'
                            },
                            information:{
                                translate: {
                                    title: 'DEVICE_MGT.DEVICE_INFO',
                                    serialNumber: 'DEVICE_MGT.SERIAL_NO',
                                    partNumber: 'DEVICE_MGT.PART_NUMBER',
                                    product: 'DEVICE_MGT.PRODUCT_MODEL',
                                    ipAddress: 'DEVICE_MGT.IP_ADDRESS',
                                    hostName: 'DEVICE_MGT.HOST_NAME',
                                    installAddress: 'DEVICE_MGT.INSTALL_ADDRESS',
                                    contact: 'DEVICE_SERVICE_REQUEST.DEVICE_CONTACT'
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
                            pickerObject: $scope.device,
                            source: 'DeviceDecommission'
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
                        },
                        statusList:[
                  {
                    'label':'Submitted',
                    'date': '1/29/2016',
                    'current': true
                  },
                  {
                    'label':'In progress',
                    'date': '',
                    'current': false
                  },
                  {
                    'label':'Completed',
                    'date': '',
                    'current': false
                  }
                ]
                    };
                }
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
