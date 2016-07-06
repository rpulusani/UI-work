
angular.module('mps.serviceRequestDevices')
.controller('DeviceDecommissionController', [
    '$scope',
    '$rootScope',
    '$filter',
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
    'SecurityHelper','$interval','tombstoneCheckCount',
    function($scope,
        $rootScope,
        $filter,
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
        tombstoneWaitTimeout,
        SecurityHelper,$interval,tombstoneCheckCount) {
        if(Devices.item === null){       
            $location.path('/device_management');
        }
        $scope.isUpdateRequestContact = ($rootScope.currentSelected === 'updateRequestContact') ? true : false;
        $scope.isLoading = false;
        $scope.srType = 'decommission';
        SRHelper.addMethods(Devices, $scope, $rootScope);

        $scope.setTransactionAccount('decommission', Devices);
        new SecurityHelper($rootScope).redirectCheck($rootScope.decommissionAccess);

        var statusBarLevels = [
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_SUBMITTED_SHORT'), value: 'SUBMITTED'},
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_IN_PROCESS'), value: 'INPROCESS'},
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_COMPLETED'), value: 'COMPLETED'}];

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
            $scope.device.sr = {};
            $scope.device.sr.selectedContact = angular.copy($rootScope.selectedContact);
            $scope.resetContactPicker();
        }else if($rootScope.contactPickerReset){
            $rootScope.device = Devices.item;
            $rootScope.contactPickerReset = false;
        }else {

            $scope.device = Devices.item;

            if (!BlankCheck.isNull(Devices.item['address'])) {
                $scope.device.installAddress = $scope.device['address']['item'];
            }
                if (!BlankCheck.isNull(Devices.item['contact']) && !$scope.device.primaryContact) {
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
            if ($scope.device.lexmarkPickupDevice === true) {
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

        function getSRNumber(existingUrl) {
                       
            var intervalPromise = $interval(function(){        		
        		DeviceServiceRequest.getAdditional(DeviceServiceRequest.item, Tombstone, 'tombstone', true).then(function(){
        			
                    if (existingUrl === $location.url()) {
                        if(Tombstone.item && Tombstone.item.siebelId) {
                            ServiceRequest.item.requestNumber = Tombstone.item.siebelId;
                            $location.path(DeviceServiceRequest.route + '/decommission/' + $scope.device.id + '/receipt/notqueued');
                            $interval.cancel(intervalPromise);
                        }
                    }
                });
        	}, tombstoneWaitTimeout, tombstoneCheckCount);
        	
        	intervalPromise.then(function(){
        		$location.path(DeviceServiceRequest.route + '/decommission/' + $scope.device.id + '/receipt/queued');
        		$interval.cancel(intervalPromise);
        	});
        }


        function configureReviewTemplate(){
                $scope.configure.actions.translate.submit = 'REQUEST_MAN.REQUEST_DEVICE_DECOM_REVIEW.BTN_DEVICE_DECOM_SUBMIT';
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
                    getSRNumber($location.url());
                 }
                }, function(reason){
                    NREUM.noticeError('Failed to create SR because: ' + reason);
                });

              }
            };
        }
        function configureReceiptTemplate(){
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
                $scope.configure.header.translate.h1 = "REQUEST_MAN.REQUEST_DEVICE_DECOM_SUBMITTED.TXT_DEVICE_DECOM_SUBMITTED";
                $scope.configure.header.translate.body = "REQUEST_MAN.REQUEST_DEVICE_DECOM_SUBMITTED.TXT_DECOM_SUBMITTED";
            $scope.configure.header.translate.bodyValues= {
                'srNumber': FormatterService.getFormattedSRNumber($scope.sr),
                'srHours': 24,
                'deviceManagementUrl': 'device_management/',
            };
            $scope.configure.receipt = {
                translate:{
                        title:"REQUEST_MAN.REQUEST_DEVICE_DECOM_SUBMITTED.TXT_DECOM_DEVICE_DETAILS",
                    titleValues: {'srNumber': FormatterService.getFormattedSRNumber($scope.sr) }
                }
            };
            $scope.configure.contact.show.primaryAction = false;
            $scope.configure.showManageAnotherDevice = true;
          }
          $scope.goToList = function() {     
            Devices.item = undefined;
            $location.path('/device_management');
          };
        }
        function configureTemplates(){
            if($scope.device){
                $scope.configure = {
                    header: {
                        translate:{
                                h1: 'REQUEST_MAN.REQUEST_DEVICE_DECOM_REVIEW.TXT_DEVICE_DECOM_REVIEW',
                            h1Values:{'productModel': $scope.device.productModel},
                                body: 'REQUEST_MAN.REQUEST_DEVICE_DECOM_REVIEW.TXT_DEVICE_DECOM_REVIEW_PAR',
                            bodyValues: '',
                            readMore: ''
                        },
                        readMoreUrl: '',
                        showCancelBtn: false
                    },
                    device: {
                        removal:{
                            translate:{
                                    title: 'REQUEST_MAN.COMMON.TXT_DECOM_OPTIONS',
                                    pickup: 'REQUEST_MAN.COMMON.TXT_LXK_PICK_UP_QUERY',
                                    pageCount: 'REQUEST_MAN.COMMON.TXT_PAGE_COUNTS'
                            },
                            source: 'decommission'
                        },
                        information:{
                            translate: {
                                    title: 'REQUEST_MAN.COMMON.TXT_DEVICE_INFO',
                                    serialNumber: 'REQUEST_MAN.COMMON.TXT_SERIAL_NUMBER',
                                    partNumber: 'REQUEST_MAN.COMMON.TXT_PART_NUMBER',
                                    product: 'REQUEST_MAN.REQUEST_DEVICE_REGISTER.TXT_PRODUCT_NUMBER',
                                    ipAddress: 'REQUEST_MAN.COMMON.TXT_IP_ADDR',
                                    hostName: 'REQUEST_MAN.COMMON.TXT_HOSTNAME',
                                    installAddress: 'REQUEST_MAN.COMMON.TXT_INSTALL_ADDRESS',
                                    contact: 'DEVICE_MAN.MANAGE_DEVICE_OVERVIEW.TXT_SUPPLIES_CONTACT'
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
                        source: 'DeviceDecommission'
                    },
                    detail:{
                        translate:{
                                title: 'REQUEST_MAN.COMMON.TXT_REQUEST_ADDL_DETAILS',
                                referenceId: 'REQUEST_MAN.COMMON.TXT_REQUEST_CUST_REF_ID',
                                costCenter: 'REQUEST_MAN.COMMON.TXT_REQUEST_COST_CENTER',
                                comments: 'REQUEST_MAN.COMMON.TXT_REQUEST_COMMENTS',
                                attachments: 'REQUEST_MAN.COMMON.TXT_REQUEST_ATTACHMENTS',
                                attachmentMessage: 'REQUEST_MAN.COMMON.TXT_REQUEST_ATTACH_FILE_FORMATS',
                                validationMessage:'ATTACHMENTS.COMMON.VALIDATION',
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
                                abandonRequest:'REQUEST_MAN.COMMON.BTN_DECOM_ABANDON',
                                submit: 'REQUEST_MAN.REQUEST_DEVICE_DECOM_REVIEW.BTN_DEVICE_DECOM_SUBMIT'
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
            }
        }

        if (!BlankCheck.isNull($scope.device.installAddress)) {
            $scope.formattedDeviceAddress = FormatterService.formatAddress($scope.device.installAddress);
        }

            if (!BlankCheck.isNull($scope.device.primaryContact)){
            	$scope.formattedDeviceContact = FormatterService.formatContact($scope.device.primaryContact);
                $scope.formattedPrimaryContact = FormatterService.formatContact($scope.device.sr === undefined? $scope.device.primaryContact:$scope.device.sr.selectedContact);
                   if($scope.isUpdateRequestContact){
                      $scope.formattedPrimaryContact = FormatterService.formatContact($scope.device.sr === undefined? $scope.device.primaryContact:$scope.device.sr.selectedContact);
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
