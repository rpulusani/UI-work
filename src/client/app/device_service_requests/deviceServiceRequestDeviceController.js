
angular.module('mps.serviceRequestDevices')
.controller('DeviceServiceRequestDeviceController', [
    '$scope',
    '$filter',
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
        $filter,
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
        $scope.srType = 'break_fix';
        $scope.validForm = true;
        $scope.formattedAddress = '';
        SRHelper.addMethods(Devices, $scope, $rootScope);

        var statusBarLevels = [
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_SUBMITTED_SHORT'), value: 'SUBMITTED'},
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_IN_PROCESS'), value: 'INPROCESS'},
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_COMPLETED'), value: 'COMPLETED'}],
        setCsvDefinition = function() {
            $scope.csvModel = {
                filename: $scope.sr.requestNumber + '.csv',
                data: {
                    requestNumber: $scope.sr.requestNumber,
                    description: $scope.sr.description,
                    type: $scope.sr.type
                }
            };
        };

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
        }else if($rootScope.selectedAddress
                && $rootScope.returnPickerObjectAddress
                && $rootScope.selectionId === Devices.item.id){
            $scope.device = $rootScope.returnPickerObjectAddress;
            $scope.sr = $rootScope.returnPickerSRObjectAddress;
            if(BlankCheck.isNull($scope.device.addressSelected) || $scope.device.addressSelected) {
                $scope.device.addressSelected = true;
                $scope.device.newAddress = false;
                if ($rootScope.selectedAddress._links) {
                    ServiceRequest.addRelationship('sourceAddress', $rootScope.selectedAddress, 'self');
                } else {
                    $scope.device.newAddress = true;
                }
                $scope.device.installAddress = angular.copy($rootScope.selectedAddress);
                $scope.setupPhysicalLocations($scope.device.installAddress,
                                                $scope.device.physicalLocation1,
                                                $scope.device.physicalLocation2,
                                                $scope.device.physicalLocation3);
            }
            Devices.item = $scope.device;
            if($scope.device){
                var image =  ImageService;
                image.getPartMediumImageUrl($scope.device.partNumber).then(function(url){
                    $scope.medImage = url;
                }, function(reason){
                    NREUM.noticeError('Image url was not found reason: ' + reason);
                });
            }
            $scope.resetAddressPicker();
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
            $scope.device = Devices.item;
            configureSR(ServiceRequest);
            if (Devices.item && !$scope.device.addressSelected && !BlankCheck.isNull(Devices.item['address']) && Devices.item['address']['item']) {
                $scope.device.installAddress = Devices.item['address']['item'];
                $scope.setupPhysicalLocations($scope.device.installAddress,
                                                $scope.device.physicalLocation1,
                                                $scope.device.physicalLocation2,
                                                $scope.device.physicalLocation3);
            }else if(Devices.item && !$scope.device.addressSelected && !BlankCheck.isNull(Devices.item['address'])){
                $scope.device.installAddress = Devices.item['address'];
                $scope.setupPhysicalLocations($scope.device.installAddress,
                                                $scope.device.physicalLocation1,
                                                $scope.device.physicalLocation2,
                                                $scope.device.physicalLocation3);
            }
            if (Devices.item && !BlankCheck.isNull(Devices.item['contact']) && Devices.item['contact']['item']) {
                $scope.device.primaryContact = Devices.item['contact']['item'];
            }else if(Devices.item && !BlankCheck.isNull(Devices.item['contact'])){
                $scope.device.primaryContact = Devices.item['contact'];
            }
            if ($rootScope.returnPickerObject && $rootScope.selectionId !== Devices.item.id) {
                $scope.resetContactPicker();
            }
            if($scope.device){
                var image =  ImageService;
                image.getPartMediumImageUrl($scope.device.partNumber).then(function(url){
                    $scope.medImage = url;
                }, function(reason){
                    NREUM.noticeError('Image url was not found reason: ' + reason);
                });
            }
        }
        $scope.setupSR(ServiceRequest, configureSR);
        $scope.setupTemplates(configureTemplates, configureReceiptTemplate, configureReviewTemplate );
        if($scope.device){
            $scope.getRequestor(ServiceRequest, Contacts);
        }

        function getSRNumber(existingUrl) {
            $timeout(function(){
                return DeviceServiceRequest.getAdditional(DeviceServiceRequest.item, Tombstone, 'tombstone', true).then(function(){
                    if (existingUrl === $location.url()) {
                        if(Tombstone.item && Tombstone.item.siebelId) {
                            ServiceRequest.item.requestNumber = Tombstone.item.siebelId;
                            $location.path(DeviceServiceRequest.route + '/' + $scope.device.id + '/receipt/notqueued');
                        } else {
                            return getSRNumber($location.url());
                        }
                    }
                });
            }, tombstoneWaitTimeout);
        }

        function configureReviewTemplate(){
            $scope.configure.actions.translate.submit = 'REQUEST_MAN.REQUEST_DEVICE_UPDATE_REVIEW.BTN_DEVICE_UPDATE_SUBMIT';
            $scope.configure.device.information.translate.changeTxt = 'Change Device';
            $scope.configure.actions.submit = function(){
                if(!$scope.isLoading) {
                    $scope.isLoading = true;
                    if ($scope.device.newAddress) {
                        var sourceAddress = {
                            name: $scope.device.installAddress.name,
                            storeFrontName: $scope.device.installAddress.storeFrontName,
                            country: $scope.device.installAddress.country,
                            addressLine1: $scope.device.installAddress.addressLine1,
                            addressLine2: $scope.device.installAddress.addressLine2,
                            city: $scope.device.installAddress.city,
                            state: $scope.device.installAddress.state,
                            postalCode: $scope.device.installAddress.postalCode,
                            houseNumber: $scope.device.installAddress.houseNumber,
                            addressCleansedFlag: $scope.device.installAddress.addressCleansedFlag
                        };
                        ServiceRequest.addField('sourceAddress', sourceAddress);
                    }
                    ServiceRequest.addField('attachments', $scope.files_complete);
                    var deferred = DeviceServiceRequest.post({
                        item:  $scope.sr
                    });

                    deferred.then(function(result){
                        if(DeviceServiceRequest.item._links['tombstone']) {
                            getSRNumber($location.url());
                        }
                    }, function(reason){
                        NREUM.noticeError('Failed to create SR because: ' + reason);
                    });
                }
            };
        }

        function configureReceiptTemplate(){
            $scope.configure.device.information.translate.changeTxt = undefined;
          var submitDate = $filter('date')(new Date(), 'yyyy-MM-ddTHH:mm:ss');
          $scope.configure.statusList = $scope.setStatusBar('SUBMITTED', submitDate.toString(), statusBarLevels);
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
            $scope.configure.device.service.translate.linkMakeChangesTxt = false;
            $scope.configure.header.readMoreUrl = '';
            $scope.configure.receipt = {
                translate:{
                    title:"DEVICE_SERVICE_REQUEST.REQUEST_SERVICE_DETAIL",
                    titleValues: {'srNumber': FormatterService.getFormattedSRNumber($scope.sr) }
                }
            };
            $scope.configure.contact.show.primaryAction = false;
            
            setCsvDefinition();
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
                            product: 'REQUEST_MAN.COMMON.TXT_PRODUCT_MODEL',
                            ipAddress: 'REQUEST_MAN.COMMON.TXT_IP_ADDR',
                            installAddress: 'REPORTING.SERVICE_ADDRESS'
                        }
                    },
                    service:{
                        translate:{
                            title:'DEVICE_MAN.DEVICE_SERVICE_HISTORY.TXT_SERVICE_SUMMARY',
                            description:'DEVICE_MAN.DEVICE_SERVICE_HISTORY.TXT_PROBLEM_DESC',
                            linkMakeChangesTxt: 'REQUEST_MAN.REQUEST_DEVICE_REGISTER_REVIEW.TXT_MAKE_CHANGES'
                        },
                        linkMakeChanges: '/service_requests/devices/' + $scope.device.id + '/view'
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
                            validationMessage:'ATTACHMENTS.COMMON.VALIDATION',
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
                            abandonRequest:'REQUEST_MAN.COMMON.BTN_ABANDON_SERVICE_REQUEST',
                            submit: 'REQUEST_MAN.COMMON.BTN_REVIEW_SUBMIT'
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
                },
                addressPicker: {
                    translate: {
                            currentInstalledAddressTitle: 'REQUEST_MAN.REQUEST_DEVICE_CHANGE_INST_ADDR.TXT_DEVICE_INSTALLED_AT',
                            replaceAddressTitle: 'REQUEST_MAN.REQUEST_DEVICE_CHANGE_INST_ADDR.TXT_REPLACE_INSTALL_ADDR'
                    },
                    sourceAddress: $scope.device.installAddress,
                    showNewAddressTab: true
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
                attachments:{
                    maxItems:2
                }
            };
                $scope.configure.breadcrumbs = {
                    1: {
                        href: '/device_management',
                        value: 'DEVICE_MAN.MANAGE_DEVICES.TXT_MANAGE_DEVICES'
                    },
                    2: {
                        value: Devices.item.productModel
                    }
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
                $scope.formattedAddressNoPl = FormatterService.formatAddresswoPhysicalLocation($scope.device.installAddress);
                $scope.formattedDeviceAddress = FormatterService.formatAddress($scope.device.installAddress);
            }

            if (!BlankCheck.isNull($scope.device) && !BlankCheck.isNull($scope.device.primaryContact)){
                    $scope.formattedDeviceContact = FormatterService.formatContact($scope.device.primaryContact);
                    $scope.formattedPrimaryContact = FormatterService.formatContact($scope.device.primaryContact);
            }
        };

        $scope.formatReceiptData(formatAdditionalData);


         $scope.goToServiceCreate = function(){
            Devices.item = {};
            $scope.goToDevicePicker('DeviceServiceRequestDevice', Devices.item, '/service_requests/devices/breakfix');
        };

    }
]);
