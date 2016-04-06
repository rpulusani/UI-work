
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
        tombstoneWaitTimeout
        ){

        $scope.isLoading = false;

        var configurePermissions = [
            {
                name: 'moveMADCAccess',
                permission: permissionSet.serviceRequestManagement.moveMADC
            }
        ],
        statusBarLevels = [
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_SUBMITTED_SHORT'), value: 'SUBMITTED'},
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_IN_PROCESS'), value: 'INPROCESS'},
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_COMPLETED'), value: 'COMPLETED'}],
        SecureHelper = new SecurityHelper($scope);
        SRHelper.addMethods(Devices, $scope, $rootScope);
        SecureHelper.setupPermissionList(configurePermissions);
        $scope.setTransactionAccount('DeviceUpdate', Devices);
        SecureHelper.redirectCheck($rootScope.addDevice);

        $scope.returnedForm = false;




        $scope.goToReview = function() {
            $location.path(DeviceServiceRequest.route + '/update/' + $scope.device.id + '/review');
        };

        $scope.revertAddress = function() {
            $scope.device.addressSelected = false;
            $scope.device.updatedInstallAddress = $scope.device.currentInstalledAddress;

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
                && $rootScope.selectionId === Devices.item.id){
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
            if(BlankCheck.isNull($scope.device.addressSelected) || $scope.device.addressSelected) {
                $scope.device.addressSelected = true;
                ServiceRequest.addRelationship('destinationAddress', $rootScope.selectedAddress, 'self');

                $scope.device.updatedInstallAddress = angular.copy($rootScope.selectedAddress);
                $scope.setupPhysicalLocations($scope.device.updatedInstallAddress,
                                                $scope.device.physicalLocation1,
                                                $scope.device.physicalLocation2,
                                                $scope.device.physicalLocation3);
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

            if (BlankCheck.isNullOrWhiteSpace($scope.device.lexmarkMoveDevice)) {
                $scope.device.lexmarkMoveDevice = false;
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
            if ($scope.device.lexmarkMoveDevice === 'true') {
                ServiceRequest.addField('type', 'MADC_MOVE');
            } else {
                ServiceRequest.addField('type', 'DATA_ASSET_CHANGE');
            }
            var assetInfo = {
                ipAddress: $scope.device.ipAddress,
                hostName: $scope.device.hostName,
                assetTag: $scope.device.assetTag,
                costCenter: $scope.device.costCenter,
                physicalLocation1: $scope.device.physicalLocation1,
                physicalLocation2: $scope.device.physicalLocation2,
                physicalLocation3: $scope.device.physicalLocation3
            };
            if ($scope.device.chl && $scope.device.chl.id) {
                assetInfo.customerHierarchyLevel = $scope.device.chl.id;
            }

            ServiceRequest.addField('assetInfo', assetInfo);
            ServiceRequest.addField('attachments', $scope.files_complete);
        };

        function configureReviewTemplate(){
                $scope.configure.actions.translate.submit = 'REQUEST_MAN.REQUEST_DEVICE_UPDATE_REVIEW.BTN_DEVICE_UPDATE_SUBMIT';
            $scope.configure.actions.submit = function(){
              if(!$scope.isLoading) {
                $scope.isLoading = true;

                updateSRObjectForSubmit();
                var deferred = DeviceServiceRequest.post({
                    item:  $scope.sr
                });

                deferred.then(function(result) {
                  if(DeviceServiceRequest.item._links['tombstone']) {
                    $location.search('tab', null);
                    $timeout(function(){
                      DeviceServiceRequest.getAdditional(DeviceServiceRequest.item, Tombstone, 'tombstone', true).then(function(){
                        if(Tombstone.item && Tombstone.item.siebelId) {
                            ServiceRequest.item.requestNumber = Tombstone.item.siebelId;
                            $location.path(DeviceServiceRequest.route + '/updates/' + $scope.device.id + '/receipt/notqueued');
                        } else {
                          ServiceRequest.item = DeviceServiceRequest.item;
                          $location.path(DeviceServiceRequest.route + '/updates/' + $scope.device.id + '/receipt/queued');
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
        function configureReceiptTemplate() {
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
          }
        }

        function configureTemplates() {
            $scope.configure = {
                header: {
                    translate: {
                            h1: 'REQUEST_MAN.COMMON.TXT_UPDATE_DEVICE_INFO',
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
                                contact: 'REQUEST_MAN.COMMON.TXT_SUPPLIES_CONTACT'
                        }
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
                    sourceAddress: $scope.device.currentInstalledAddress
                }
            };

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
    }
]);
