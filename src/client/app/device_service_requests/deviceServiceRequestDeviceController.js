
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
    '$routeParams',
    'TombstoneService',
    '$timeout',
    'tombstoneWaitTimeout',
    'SecurityHelper',
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
        SRHelper,
        $routeParams,
        Tombstone,
        $timeout,
        tombstoneWaitTimeout,
        SecurityHelper){

        $scope.isLoading = false;
            $scope.validForm = true;
        $scope.formattedAddress = '';
        SRHelper.addMethods(Devices, $scope, $rootScope);

        $scope.setTransactionAccount('DeviceServiceRequestDevice', Devices);
        new SecurityHelper($rootScope).redirectCheck($rootScope.createBreakFixAccess);

        var configureSR = function(ServiceRequest){
                if(!ServiceRequest.item || !ServiceRequest.item.description){
                    ServiceRequest.addField('description', '');
                }
                ServiceRequest.addRelationship('account', $scope.device);
                ServiceRequest.addRelationship('asset', $scope.device, 'self');
                ServiceRequest.addRelationship('primaryContact', $scope.device, 'contact');
                ServiceRequest.addField('type', 'BREAK_FIX');
        };

        if (Devices.item === null &&
            $location.path() !== DeviceServiceRequest.route + "/picker" &&
            $location.path() !== "/device_management/pick_device/DeviceServiceRequestDevice") {
            $scope.redirectToList();
        } else if($location.path() === DeviceServiceRequest.route + "/picker" && !$rootScope.selectedDevice){
            ServiceRequest.reset();
            Devices.reset();
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
                $scope.device.contact.item = $scope.device.primaryContact;
                
                $scope.resetContactPicker();
        }else if($rootScope.contactPickerReset){
            $rootScope.device = Devices.item;
            $rootScope.contactPickerReset = false;
        }else if($rootScope.selectedDevice &&
            $rootScope.returnPickerObjectDevice){
                $scope.device = $rootScope.currentSelectedRow;
                $scope.sr = $rootScope.returnPickerSRObjectDevice;
                configureSR(ServiceRequest);
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
            configureSR(ServiceRequest);
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
                $scope.configure.actions.translate.submit = 'REQUEST_MAN.REQUEST_DEVICE_UPDATE_REVIEW.BTN_DEVICE_UPDATE_SUBMIT';
            $scope.configure.actions.submit = function(){
              if(!$scope.isLoading) {
                $scope.isLoading = true;

               ServiceRequest.addField('attachments', $scope.files_complete);
               var deferred = DeviceServiceRequest.post({
                     item:  $scope.sr
                });

                deferred.then(function(result){
                  if(DeviceServiceRequest.item._links['tombstone']) {
                    $timeout(function(){
                      DeviceServiceRequest.getAdditional(DeviceServiceRequest.item, Tombstone, 'tombstone', true).then(function(){
                        if(Tombstone.item && Tombstone.item.siebelId) {
                          $location.search('tab',null);
                          ServiceRequest.item.requestNumber = Tombstone.item.siebelId;
                          // Success logic
                          $location.path(DeviceServiceRequest.route + '/' + Devices.item.id + '/receipt/notqueued');
                        } else {
                          $location.search('tab', null);
                          ServiceRequest.item = DeviceServiceRequest.item;
                          $location.path(DeviceServiceRequest.route + '/' + Devices.item.id + '/receipt/queued');
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
            $scope.configure.header.translate.h1 = "DEVICE_SERVICE_REQUEST.REQUEST_SERVICE_FOR_SUBMITTED";
                $scope.configure.header.translate.body = "REQUEST_MAN.COMMON.TXT_REQUEST_SUBMITTED";
            $scope.configure.header.translate.bodyValues= {
                    'refId': FormatterService.getFormattedSRNumber($scope.sr),
                'srNumber': FormatterService.getFormattedSRNumber($scope.sr),
                'srHours': 24,
                'deviceManagementUrl': 'device_management/',
            };
            $scope.configure.header.readMoreUrl = '';
            $scope.configure.receipt = {
                translate:{
                    title:"DEVICE_SERVICE_REQUEST.REQUEST_SERVICE_DETAIL",
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
                        h1: 'DEVICE_SERVICE_REQUEST.REQUEST_SERVICE_FOR',
                        h1Values:{'productModel': $scope.device.productModel},
                        body: '',
                        bodyValues: '',
                            readMore: 'DEVICE_MAN.MANAGE_DEVICE.LNK_VISIT_SUPPORT'
                    },
                    readMoreUrl: 'http://support.lexmark.com/index?page=productSelection&channel=supportAndDownloads&locale=EN&userlocale=EN_US',
                    readMoreUrlTarget: true,
                    showCancelBtn: false
                },
                device: {
                    information:{
                        translate: {
                                title: 'REQUEST_MAN.COMMON.TXT_DEVICE_INFO',
                                serialNumber: 'REQUEST_MAN.COMMON.TXT_SERIAL_NUMBER',
                                partNumber: 'REQUEST_MAN.COMMON.TXT_PART_NUMBER',
                                product: 'REQUEST_MAN.REQUEST_DEVICE_REGISTER.TXT_PRODUCT_NUMBER',
                                ipAddress: 'REQUEST_MAN.COMMON.TXT_IP_ADDR',
                                installAddress: 'REQUEST_MAN.COMMON.TXT_INSTALL_ADDRESS'
                        }
                    },
                    service:{
                        translate:{
                                title:'DEVICE_MAN.DEVICE_SERVICE_HISTORY.TXT_SERVICE_SUMMARY',
                                description:'DEVICE_MAN.DEVICE_SERVICE_HISTORY.TXT_PROBLEM_DESC'
                        }
                    }
                },
                contact:{
                    translate: {
                             title: 'REQUEST_MAN.COMMON.TXT_REQUEST_CONTACTS',
                             requestedByTitle: 'REQUEST_MAN.COMMON.TXT_REQUEST_CREATED_BY',
                             primaryTitle: 'REQUEST_MAN.COMMON.TXT_REQUEST_CONTACT',
                             changePrimary: 'REQUEST_MAN.REQUEST_DEVICE_UPDATE_REVIEW.LNK_CHANGE_REQUEST_CONTACT'
                    },
                    show:{
                        primaryAction : true
                    },
                    pickerObject: $scope.device,
                    source: 'DeviceServiceRequestDevice'
                },
                detail:{
                    translate:{
                            title: 'REQUEST_MAN.COMMON.TXT_REQUEST_ADDL_DETAILS',
                            referenceId: 'REQUEST_MAN.COMMON.TXT_REQUEST_CUST_REF_ID',
                            comments: 'REQUEST_MAN.COMMON.TXT_REQUEST_COMMENTS',
                            attachments: 'REQUEST_MAN.COMMON.TXT_REQUEST_ATTACHMENTS',
                            attachmentMessage: 'REQUEST_MAN.COMMON.TXT_REQUEST_ATTACH_FILE_FORMATS',
                        fileList: ['.csv', '.xls', '.xlsx', '.vsd', '.doc', '.docx', '.ppt', '.pptx', '.pdf', '.zip'].join(', ')
                    },
                    show:{
                        referenceId: true,
                        comments: true,
                        attachements: true
                    }
                },
                actions:{
                    translate: {
                            abandonRequest:'REQUEST_MAN.COMMON.BTN_ABANDON_REGISTRATION',
                            submit: 'REQUEST_MAN.COMMON.BTN_REVIEW_SUBMIT'
                    },
                    submit: function() {
                            if ($scope.breakFixDevice.$invalid) {
                                $scope.validForm = false;
                                return false;
                            }
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
                },
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
            }else{
               $scope.configure = {
                    devicePicker: {
                        singleDeviceSelection: true,
                        readMoreUrl: '',
                        translate: {
                                replaceDeviceTitle: 'REQUEST_MAN.REQUEST_SELECT_DEVICE_REMOVAL.TXT_DEVICE_DEVICE_FOR_INSTALL',
                                h1: 'REQUEST_MAN.REQUEST_SELECT_DEVICE_REMOVAL.TXT_SELECT_DEVICE_FOR_REMOVAL',
                                body: 'REQUEST_MAN.REQUEST_SELECT_DEVICE_REMOVAL.TXT_SELECT_DEVICE_FOR_REMOVAL_PAR',
                            readMore: '',
                            confirmation:{
                                    abandon:'REQUEST_MAN.REQUEST_SELECT_DEVICE_REMOVAL.BTN_ABANDON_DEVICE_SELECTION',
                                    submit: 'REQUEST_MAN.REQUEST_SELECT_DEVICE_REMOVAL.BTN_APPLY_DEVICE_SELECTION'
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
