
angular.module('mps.serviceRequestDevices')
.controller('DeviceUpdateController', ['$scope',
    '$location',
    '$filter',
    '$routeParams',
    '$rootScope',
    'ServiceRequestService',
    'FormatterService',
    'BlankCheck',
    'DeviceServiceRequest',
    'Devices',
    'Contacts',
    'UserService',
    'SRControllerHelperService',
    'SecurityHelper',
    'permissionSet',
    '$translate',
    'TombstoneService',
    '$timeout',
    'tombstoneWaitTimeout',
    '$q',
    'CountryService','$interval','tombstoneCheckCount',
    function($scope,
        $location,
        $filter,
        $routeParams,
        $rootScope,
        ServiceRequest,
        FormatterService,
        BlankCheck,
        DeviceServiceRequest,
        Devices,
        Contacts,
        Users,
        SRHelper,
        SecurityHelper,
        permissionSet,
        $translate,
        Tombstone,
        $timeout,
        tombstoneWaitTimeout,
        $q,
        Country,$interval,tombstoneCheckCount
        ){
		
        if(Devices.item === null){       
            $location.path('/device_management');
        }

        $scope.isLoading = false;
        $scope.multiple = {};

        var statusBarLevels = [
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_SUBMITTED_SHORT'), value: 'SUBMITTED'},
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_IN_PROCESS'), value: 'INPROCESS'},
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_COMPLETED'), value: 'COMPLETED'}],
        SecureHelper = new SecurityHelper($scope);
        SRHelper.addMethods(Devices, $scope, $rootScope);
        
        
        	
        
        
        
        
        
        $scope.setTransactionAccount('DeviceUpdate', Devices);
        SecureHelper.redirectCheck($rootScope.addDevice);
        $scope.confirmedSavedSR = [];
        $scope.returnedForm = false;

        if (ServiceRequest.confirmedSavedSR) {
            $scope.confirmedSavedSR = ServiceRequest.confirmedSavedSR;
        }

        // For updating multiple
        if (Devices.updatingMultiple) {
            $scope.devices = Devices.data;
            if ($rootScope.selectedContact) {
                $scope.contact = $rootScope.selectedContact;
            }
            if (!BlankCheck.isNull($scope.contact) && !BlankCheck.isNull($scope.contact.address)) {
                $scope.formattedMultiContactAddress = FormatterService.formatAddresswoPhysicalLocation($scope.contact.address);
            }

            if (!BlankCheck.isNull($scope.contact)) {
                $scope.formattedMultiContact = FormatterService.formatContact($scope.contact);
            }
        }
        Country.get().then(function(){
            $scope.countries=Country.data;
        });
        $scope.countrySelected = function(countryId) {
                var item=$scope.countries.filter(function(item) {
                    return item.code === countryId; 
                });
                $scope.provinces = item[0].provinces;
        };
        $scope.goToReview = function() {
            $location.path(DeviceServiceRequest.route + '/update/' + $scope.device.id + '/review');
        };

        $scope.revertAddress = function() {
            $scope.device.addressSelected = false;
            $scope.device.updatedInstallAddress = $scope.device.currentInstalledAddress;
            $scope.setupPhysicalLocations($scope.device.currentInstalledAddress,
                    $scope.device.physicalLocation1,
                    $scope.device.physicalLocation2,
                    $scope.device.physicalLocation3);
            $scope.formattedDeviceAddress = FormatterService.formatAddresswoPhysicalLocation($scope.device.updatedInstallAddress);
            ServiceRequest.addRelationship('destinationAddress', $scope.device, 'address');
        };

        var configureSR = function(ServiceRequest){
            ServiceRequest.addRelationship('account', $scope.device);
            ServiceRequest.addRelationship('asset', $scope.device, 'self');

            ServiceRequest.addRelationship('sourceAddress', $scope.device, 'address');
        };

        if (Devices.item === null) {
            $scope.redirectToList();
        } else if($rootScope.selectedContact
                && $rootScope.returnPickerObject
                && ($rootScope.selectionId === Devices.item.id || Devices.updatingMultiple)){
            $scope.device = $rootScope.returnPickerObject;
            $scope.sr = $rootScope.returnPickerSRObject;
            if ($rootScope.currentSelected) {
                if ($rootScope.currentSelected === 'updateRequestContact') {
                    ServiceRequest.addRelationship('primaryContact', $rootScope.selectedContact, 'self');
                    $scope.device.primaryContact = angular.copy($rootScope.selectedContact);
                } else if ($rootScope.currentSelected === 'updateDeviceContact') {
                    ServiceRequest.addRelationship('assetContact', $rootScope.selectedContact, 'self');
                    $scope.device.prevDeviceContact = angular.copy($scope.device.deviceContact);
                    $scope.device.deviceContact = angular.copy($rootScope.selectedContact);
                }
            }
            Devices.item = $scope.device;
            $scope.resetContactPicker();
        } else if($rootScope.selectedAddress
                && $rootScope.returnPickerObjectAddress
                && $rootScope.selectionId === Devices.item.id){
            $scope.device = $rootScope.returnPickerObjectAddress;
            $scope.sr = $rootScope.returnPickerSRObjectAddress;
            if(BlankCheck.isNull($scope.device.addressSelected) || !$scope.device.addressSelected) {
                $scope.device.addressSelected = true;
                ServiceRequest.addRelationship('destinationAddress', $rootScope.selectedAddress, 'self');

                $scope.device.updatedInstallAddress = angular.copy($rootScope.selectedAddress);
                $scope.setupPhysicalLocations($scope.device.updatedInstallAddress,
                                                $scope.device.physicalLocation1,
                                                $scope.device.physicalLocation2,
                                                $scope.device.physicalLocation3);
                $scope.setupPhysicalLocations($scope.device.currentInstalledAddress,'','','');
            }
            Devices.item = $scope.device;
            $scope.resetAddressPicker();
        } else {
            $scope.device = Devices.item;
            if (!$rootScope.selectedAddress) {
                if (!(ServiceRequest.item && ServiceRequest.item._links && ServiceRequest.item._links.destinationAddress)) {
                    ServiceRequest.addRelationship('destinationAddress', Devices.item, 'address');
                }
                ServiceRequest.addRelationship('account', Devices.item);
                ServiceRequest.addRelationship('asset', Devices.item, 'self');
                ServiceRequest.addRelationship('sourceAddress', Devices.item, 'address');
            }

            if (BlankCheck.isNull($scope.device.chl)) {
                $scope.device.chl = {};
            }
            if (!BlankCheck.isNull($scope.device.address.item) && BlankCheck.isNull($scope.device.currentInstalledAddress)) {
                $scope.device.currentInstalledAddress = $scope.device.address.item;
                $scope.setupPhysicalLocations($scope.device.currentInstalledAddress,
                                            $scope.device.physicalLocation1,
                                            $scope.device.physicalLocation2,
                                            $scope.device.physicalLocation3);
                $scope.device.updatedInstallAddress = $scope.device.currentInstalledAddress;
            }

            if (!BlankCheck.isNull($scope.device.contact.item) && BlankCheck.isNull($scope.device.deviceContact)) {
                $scope.device.deviceContact = $scope.device.contact.item;
                $scope.device.prevDeviceContact = angular.copy($scope.device.deviceContact);
            }

            if ($rootScope.pagestatus === 'edit') {
              $scope.device.lexmarkMoveDevice = false;
            }
            else{
            $scope.device.lexmarkMoveDevice = true;
            }

            if (BlankCheck.isNullOrWhiteSpace($scope.device.deviceCHLQuestion)) {
                $scope.device.deviceCHLQuestion = false;
            }
        }
        $scope.checkChange = function(field){
            if($scope.device && $scope.orignalDevice &&
                $scope.device[field] === $scope.orignalDevice[field]){
                return false;
            }else{
                return true;
            }
        };

        $scope.setupSR(ServiceRequest, configureSR);
        $scope.setupTemplates(configureTemplates, configureReceiptTemplate, configureReviewTemplate, ServiceRequest);
        $scope.getRequestor(ServiceRequest, Contacts);

        var updateSRObjectForSubmit = function() {
            if ($scope.device.lexmarkMoveDevice === true) {
                ServiceRequest.addField('type', 'MADC_MOVE');
            } else {
                ServiceRequest.addField('type', 'DATA_ASSET_CHANGE');
            }
            var assetInfo = {
                ipAddress: $scope.device.ipAddress,
                hostName: $scope.device.hostName,
                serialNumber: $scope.device.serialNumber,
                assetTag: $scope.device.assetTag,
                costCenter: $scope.device.costCenter,
                physicalLocation1: $scope.device.addressSelected?$scope.device.currentInstalledAddress.building:$scope.device.updatedInstallAddress.building,
                physicalLocation2: $scope.device.addressSelected?$scope.device.currentInstalledAddress.floor:$scope.device.updatedInstallAddress.floor,
                physicalLocation3: $scope.device.addressSelected?$scope.device.currentInstalledAddress.office:$scope.device.updatedInstallAddress.office                
            };
            if ($scope.device.chl && $scope.device.chl.id) {
                assetInfo.customerHierarchyLevel = $scope.device.chl.id;
            }
           if($scope.device.addressSelected){
        	   var sourceAddressPhysicalLocation = {
               		   physicalLocation1 : $scope.device.addressSelected?$scope.device.updatedInstallAddress.building:$scope.device.currentInstalledAddress.building,
                       physicalLocation2 : $scope.device.addressSelected?$scope.device.updatedInstallAddress.floor:$scope.device.currentInstalledAddress.floor,
                       physicalLocation3 : $scope.device.addressSelected?$scope.device.updatedInstallAddress.office:$scope.device.currentInstalledAddress.office
               };
        	   ServiceRequest.addField('sourceAddressPhysicalLocation', sourceAddressPhysicalLocation);
           }
            
            ServiceRequest.addField('assetInfo', assetInfo);
            ServiceRequest.addField('attachments', $scope.files_complete);
        };

        function getSRNumber(existingUrl) {
            if (!ServiceRequest.confirmedSavedSR) {
                ServiceRequest.confirmedSavedSR = [];
            }
            
            if (!Devices.updatingMultiple) {
            	var intervalPromise = $interval(function(){
            		DeviceServiceRequest.getAdditional(DeviceServiceRequest.item, Tombstone, 'tombstone', true).then(function(){
                        if (existingUrl === $location.url()) {
                            if(Tombstone.item && Tombstone.item.siebelId) {
                                ServiceRequest.item.requestNumber = Tombstone.item.siebelId;
                                $location.path(DeviceServiceRequest.route + '/updates/' + $scope.device.id + '/receipt/notqueued');
                                $interval.cancel(intervalPromise);
                            }else if(Tombstone.item.status && Tombstone.item.status.toLowerCase() === 'fail'){
                            	$location.path(DeviceServiceRequest.route + '/updates/' + $scope.device.id + '/receipt/queued');
                        		$interval.cancel(intervalPromise);
                            }
                        }
                    });
            	}, tombstoneWaitTimeout, tombstoneCheckCount); 
            	intervalPromise.then(function(){
            		$location.path(DeviceServiceRequest.route + '/updates/' + $scope.device.id + '/receipt/queued');
            		$interval.cancel(intervalPromise);
            	});
            	  
            }else{
            	var i = 0, promises = [];
            	for (i; i < $scope.savedSR.length; i += 1) {
            		var srItem = $scope.savedSR[i]; 
            		var intervalPromise = $interval(tombstoneMultiple.bind(null,srItem,existingUrl,promises), 
            				tombstoneWaitTimeout, tombstoneCheckCount); 
            		promises.push(intervalPromise);
                }
            	$q.all(promises).then(function(){
            		for(i = 0 ; i<promises.length ; i++){
            			$interval.cancel(promises[i]);
            		}
            		if(ServiceRequest.confirmedSavedSR.length < $scope.savedSR.length){
            			 $scope.setupTemplates(configureTemplates, configureReceiptTemplate, configureReviewTemplate, ServiceRequest);
                         $location.path(DeviceServiceRequest.route + '/updates/' + $scope.device.id + '/receipt/queued');
            		}
            		
            	});
            }
            
        }
        function tombstoneMultiple(srItem,existingUrl,promises){
        	DeviceServiceRequest.getAdditional(srItem, Tombstone, 'tombstone', true).then(function() {
                if (existingUrl === $location.url()) {
                    if(Tombstone.item && Tombstone.item.siebelId) {
                        ServiceRequest.item.requestNumber = Tombstone.item.siebelId;
                        srItem.saved = true;
                        ServiceRequest.confirmedSavedSR.push(Tombstone.item);
                        if ( ServiceRequest.confirmedSavedSR.length === $scope.savedSR.length) {
                            // everything has been saved 
                            $scope.setupTemplates(configureTemplates, configureReceiptTemplate, configureReviewTemplate, ServiceRequest);
                            $location.path(DeviceServiceRequest.route + '/updates/' + $scope.device.id + '/receipt/notqueued');
                            for(i = 0 ; i<promises.length ; i++){
                    			$interval.cancel(promises[i]);
                    		}
                        } 
                    } 
                }
            });
        }
        function configureReviewTemplate(){
            if (Devices.updatingMultiple) {
                for (var k=0; k < Devices.data.length; k += 1) {
                    Devices.data[k].multipleCostCenter = $scope.devices[0].multipleCostCenter;
                    if($rootScope.currentSelected === 'updateDeviceContact')
                        $scope.configure.updatingMultiple[k]._embedded.contact = $rootScope.selectedContact;

                }
                if($rootScope.currentSelected === 'updateRequestContact'){
                    $scope.device.primaryContact = angular.copy($rootScope.selectedContact);
                }
            }
            $scope.configure.actions.translate.submit = 'REQUEST_MAN.REQUEST_DEVICE_UPDATE_REVIEW.BTN_DEVICE_UPDATE_SUBMIT';
            $scope.configure.device.information.translate.linkMakeChangesTxt = "REQUEST_MAN.REQUEST_DEVICE_REGISTER_REVIEW.TXT_MAKE_CHANGES";
            

           
            $scope.configure.actions.submit = function(){
              var i = 0,
              deferreds = [];

              $scope.savedSR = [];

              if(!$scope.isLoading) {
                $scope.isLoading = true;

                updateSRObjectForSubmit();

                if (Devices.updatingMultiple) {
                    for (i; i < Devices.data.length; i += 1) {
                    	ServiceRequest.addRelationship('asset', Devices.data[i], 'self');
                    	ServiceRequest.addRelationship('sourceAddress', Devices.data[i], 'address');
                    	ServiceRequest.removeRelationship('destinationAddress');
                        $scope.sr.assetInfo = {
                        	serialNumber :Devices.data[i].serialNumber, 
                        	assetTag: Devices.data[i].assetTag,
                            costCenter: Devices.data[i].multipleCostCenter,
                            hostName: Devices.data[i].hostName,
                            ipAddress: Devices.data[i].ipAddress,
                            physicalLocation1: Devices.data[i].physicalLocation1,
                            physicalLocation2: Devices.data[i].physicalLocation2,
                            physicalLocation3: Devices.data[i].physicalLocation3
                        };
                        
                        deferreds.push(DeviceServiceRequest.post({
                            item:  JSON.parse(JSON.stringify($scope.sr))
                        }).then(function(res) {
                            $scope.savedSR.push(res.data);
                        }));
                    }
                } else {
                    deferreds.push(DeviceServiceRequest.post({
                        item:  $scope.sr
                    }));
                }

                $q.all(deferreds).then(function(result) {
                  if(DeviceServiceRequest.item._links['tombstone']) {
                    ServiceRequest.confirmedSavedSR = [];
                    getSRNumber($location.url());
                  }
                }, function(reason){
                    NREUM.noticeError('Failed to create SR because: ' + reason);
                });
              }

            };
        }
        function configureReceiptTemplate() {
          var submitDate = $filter('date')(new Date(), 'yyyy-MM-ddTHH:mm:ss'),
          srDisplay = '';

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
                $scope.configure.header.translate.h1 = "REQUEST_MAN.REQUEST_DEVICE_UPDATE_SUBMITTED.TXT_UPDATE_DEVICE_SUBMITTED";
                $scope.configure.header.translate.body = "REQUEST_MAN.COMMON.TXT_REQUEST_SUBMITTED";
            $scope.configure.header.translate.bodyValues= {
                'refId': FormatterService.getFormattedSRNumber($scope.sr),
                'srNumber': FormatterService.getFormattedSRNumber($scope.sr),
                'srHours': 24,
                'deviceManagementUrl': 'device_management/',
            };
            $scope.configure.receipt = {
                translate: {
                        title:"REQUEST_MAN.REQUEST_DEVICE_UPDATE_SUBMITTED.TXT_UPDATE_DEVICE_DETAILS",
                    titleValues: {'srNumber': FormatterService.getFormattedSRNumber($scope.sr) }
                }
            };
            $scope.configure.contact.show.primaryAction = false;
            $scope.configure.device.information.translate.linkMakeChangesTxt = undefined;
            $scope.configure.showManageAnotherDevice = true;
          }

          $scope.goToList = function() {     
            Devices.item = undefined;
            $location.path('/device_management');
          };

            if ($scope.confirmedSavedSR && angular.isArray($scope.confirmedSavedSR) && $scope.confirmedSavedSR.length > 0) {
                srDisplay = (function() {
                    var i = 0,
                    idArr = [];

                    for (i; i < $scope.confirmedSavedSR.length; i += 1) {
                        idArr.push($scope.confirmedSavedSR[i].siebelId);
                    }

                    return idArr.toString().replace(/,/g, ', ');
                }());

                $scope.configure.receipt.translate.titleValues.srNumber = srDisplay;

                $scope.configure.header.translate.bodyValues = {
                    'refId': (function() {
                        var i = 0,
                        idArr = [];

                        for (i; i < $scope.confirmedSavedSR.length; i += 1) {
                            idArr.push($scope.confirmedSavedSR[i].siebelId);
                        }

                        return idArr.toString().replace(/,/g, ', ');
                    }()),
                    'srNumber': srDisplay
                };
            }
        }

        function configureTemplates() {
            $scope.configure = {
                header: {
                    translate: {
                            h1: (function() {
                                if (!Devices.updatingMultiple) {
                                    return 'REQUEST_MAN.COMMON.TXT_UPDATE_DEVICE_INFO';
                                } else {
                                    return 'DEVICE_MAN.MANAGE_DEVICE_OVERVIEW.CTRL_UPDATE_DEVICE_INFO';
                                }
                            }()),
                            h1Values:{'productModel': $scope.device.productModel},
                            body: 'REQUEST_MAN.REQUEST_DEVICE_UPDATE.TXT_UPDATE_DEVICE_PAR',
                            readMore: 'REQUEST_MAN.REQUEST_DEVICE_REGISTER.LNK_LEARN_MORE'
                    },
                    readMoreUrl: '/service_requests/learn_more',
                    showCancelBtn: false
                },
                device: {
                    information:{
                        translate: {
                                title: 'REQUEST_MAN.COMMON.TXT_DEVICE_INFO',
                                move: 'REQUEST_MAN.COMMON.TXT_INSTALL_LXK_TO_MOVE',
                                serialNumber: 'REQUEST_MAN.COMMON.TXT_SERIAL_NUMBER',
                                partNumber: 'REQUEST_MAN.COMMON.TXT_PART_NUMBER',
                                product: 'REQUEST_MAN.REQUEST_DEVICE_REGISTER.TXT_PRODUCT_NUMBER',
                                ipAddress: 'REQUEST_MAN.COMMON.TXT_IP_ADDR',
                                hostName: 'REQUEST_MAN.COMMON.TXT_HOSTNAME',
                                costCenter: 'REQUEST_MAN.COMMON.TXT_DEVICE_COST_CENTER',
                                chl: 'REQUEST_MAN.REQUEST_DEVICE_UPDATE_SUBMITTED.TXT_CHL',
                                customerDeviceTag: 'REQUEST_MAN.COMMON.TXT_DEVICE_TAG',
                                contact: 'REQUEST_MAN.COMMON.TXT_SUPPLIES_CONTACT',
                                installAddress:'REQUEST_MAN.COMMON.TXT_INSTALL_ADDRESS',
                                moveAddress: 'REQUEST_MAN.COMMON.TXT_MOVE_ADDRESS'
                                
                        },
                        linkMakeChanges: '/service_requests/devices/' + $scope.device.id + '/update'
                        
                    }
                },
                contact: {
                    translate: {
                            title: 'REQUEST_MAN.COMMON.TXT_REQUEST_CONTACTS',
                            requestedByTitle: 'REQUEST_MAN.COMMON.TXT_REQUEST_CREATED_BY',
                            primaryTitle: 'REQUEST_MAN.COMMON.TXT_REQUEST_CONTACT',
                            changePrimary: 'REQUEST_MAN.REQUEST_DEVICE_UPDATE_REVIEW.LNK_CHANGE_REQUEST_CONTACT'
                    },
                    show: {
                        primaryAction : true
                    },
                    pickerObject: $scope.device,
                    source: 'DeviceUpdate'
                },
                detail: {
                    translate: {
                            title: 'REQUEST_MAN.COMMON.TXT_REQUEST_ADDL_DETAILS',
                            referenceId: 'REQUEST_MAN.COMMON.TXT_REQUEST_CUST_REF_ID',
                            costCenter: 'REQUEST_MAN.COMMON.TXT_REQUEST_COST_CENTER',
                            comments: 'REQUEST_MAN.COMMON.TXT_REQUEST_COMMENTS',
                            attachments: 'REQUEST_MAN.COMMON.TXT_REQUEST_ATTACHMENTS',
                            attachmentMessage: 'REQUEST_MAN.COMMON.TXT_REQUEST_ATTACH_FILE_FORMATS',
                            validationMessage:'ATTACHMENTS.COMMON.VALIDATION',
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
                            abandonRequest:'REQUEST_MAN.COMMON.BTN_DISCARD_DEVICE_CHANGES',
                            submit: 'REQUEST_MAN.COMMON.BTN_REVIEW_SUBMIT'
                    },
                    submit: $scope.goToReview
                },
                modal: {
                    translate: {
                        abandonTitle: 'SERVICE_REQUEST.TITLE_ABANDON_MODAL',
                        abandondBody: 'SERVICE_REQUEST.BODY_ABANDON_MODAL',
                        abandonCancel:'SERVICE_REQUEST.ABANDON_MODAL_CANCEL',
                        abandonConfirm: 'SERVICE_REQUEST.ABANDON_MODAL_CONFIRM'
                    },
                    returnPath: Devices.route + '/'
                },
                contactPicker: {
                    translate: {
                        replaceContactTitle: 'CONTACT.REPLACE_CONTACT'
                    }
                },
                addressPicker: {
                    translate: {
                            currentInstalledAddressTitle: 'REQUEST_MAN.REQUEST_DEVICE_CHANGE_INST_ADDR.TXT_DEVICE_INSTALLED_AT',
                            replaceAddressTitle: 'REQUEST_MAN.REQUEST_DEVICE_CHANGE_INST_ADDR.TXT_REPLACE_INSTALL_ADDR'
                    },
                    sourceAddress: $scope.device.currentInstalledAddress,
                    showNewAddressTab: false
                },
                attachments:{
                    maxItems:2
                },
                updatingMultiple: $scope.devices
            };

            if (!Devices.updatingMultiple) {
                $scope.configure.breadcrumbs = {
                    1: {
                        href: '/device_management',
                        value: 'DEVICE_MAN.MANAGE_DEVICES.TXT_MANAGE_DEVICES'
                    },
                    2: {
                        value: Devices.item.productModel
                    }
                };
            } else {
                $scope.configure.breadcrumbs = {
                    1: {
                        href: '/device_management',
                        value: 'DEVICE_MAN.MANAGE_DEVICES.TXT_MANAGE_DEVICES'
                    },
                    2: {
                        value: 'DEVICE_MAN.MANAGE_DEVICES.TXT_MANAGE_DEVICES'
                    }
                };
            }

        }

        var formatAdditionalData = function() {
            if (!BlankCheck.isNull($scope.device.currentInstalledAddress)) {
                $scope.formattedCurrentAddress = FormatterService.formatAddress($scope.device.currentInstalledAddress);
                $scope.formattedPrevAddress = FormatterService.formatAddresswoPhysicalLocation($scope.device.currentInstalledAddress);
            }

            if (!BlankCheck.isNull($scope.device.updatedInstallAddress)) {
                $scope.formattedDeviceAddress = FormatterService.formatAddresswoPhysicalLocation($scope.device.updatedInstallAddress);
            }

            if (!BlankCheck.isNull($scope.device.primaryContact)) {
                $scope.formattedPrimaryContact = FormatterService.formatContact($scope.device.primaryContact);
            }

            if (!BlankCheck.isNull($scope.device.deviceContact)) {
                $scope.formattedDeviceContact = FormatterService.formatContact($scope.device.deviceContact);
            }
            if (!BlankCheck.isNull($scope.device.prevDeviceContact)) {
                $scope.formattedPrevDeviceContact = FormatterService.formatContact($scope.device.prevDeviceContact);
            }

            if (!BlankCheck.isNull($scope.device.requestedByContact)) {
                $scope.requestedByContactFormatted = FormatterService.formatContact($scope.device.requestedByContact);
            }

            if (!BlankCheck.isNull($scope.device.lexmarkMoveDevice)) {
                $scope.formattedMoveDevice = FormatterService.formatYesNo($scope.device.lexmarkMoveDevice);
            }
        };

        $scope.formatReceiptData(formatAdditionalData);
        
        //Changes for permission of the particular device account starts
        
        var configPermissions = [];
        configPermissions = angular.copy($rootScope.configurePermissions);
        $scope.deviceActionPermissions = {};          		
       
        var helperDeviceSelect = new SecurityHelper($scope.deviceActionPermissions);
        var accId = Devices.item._embedded.account.accountId,
        	i=0,
        	acntPermissions,
        	accounts = $rootScope.currentUser.transactionalAccount.data;
        	
        	
        	for(;i<accounts.length;i++){
            		if(accounts[i].account.accountId === accId){
            			acntPermissions = accounts[i].permisssions.permissions;            			
            			break;
            		}
            }
        		$scope.deviceActionPermissions.security.setWorkingPermission(acntPermissions);
        		helperDeviceSelect.setupPermissionList(configPermissions);
        	
    }
]);
