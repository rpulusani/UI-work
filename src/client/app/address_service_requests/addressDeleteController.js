
angular.module('mps.serviceRequestAddresses')
.controller('AddressDeleteController', [
    '$scope',
    '$filter',
    '$rootScope',
    '$routeParams',
    '$location',
    '$translate',
    '$timeout',
    'Addresses',
    'ServiceRequestService',
    'FormatterService',
    'BlankCheck',
    'Contacts',
    'SRControllerHelperService',
    'UserService',
    'TombstoneService',
    'tombstoneWaitTimeout',
    'SecurityHelper',
    function($scope,
        $filter,
        $rootScope,
        $routeParams,
        $location,
        $translate,
        $timeout,
        Addresses,
        ServiceRequest,
        FormatterService,
        BlankCheck,
        Contacts,
        SRHelper,
        Users,
        Tombstone,
        tombstoneWaitTimeout,
        SecurityHelper) {
    	
    	if(Addresses.item === null){                        
    		      window.scrollTo(0,0);
    		      $location.path(Addresses.route+'/');
    	}
    	
        $scope.isLoading = false;

        SRHelper.addMethods(Addresses, $scope, $rootScope);
        $scope.setTransactionAccount('AddressDelete', Addresses);
        new SecurityHelper($rootScope).redirectCheck($rootScope.addressAccess);

        var statusBarLevels = [
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_SUBMITTED_SHORT'), value: 'SUBMITTED'},
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_IN_PROCESS'), value: 'INPROCESS'},
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_COMPLETED'), value: 'COMPLETED'}];

        var configureSR = function(ServiceRequest){
                ServiceRequest.addRelationship('account', $scope.address);
                ServiceRequest.addRelationship('sourceAddress', $scope.address, 'self');
                ServiceRequest.addRelationship('primaryContact', $scope.address, 'requestor');
                ServiceRequest.addField('type', 'DATA_ADDRESS_REMOVE');

        };

        $scope.getRequestor = function(ServiceRequest, Contacts) {
            Users.getLoggedInUserInfo().then(function() {
                Users.item.links.contact().then(function() {
                    $scope.address.requestedByContact = Users.item.contact.item;
                    ServiceRequest.addRelationship('requester', $scope.address.requestedByContact, 'self');
                    if(!$scope.address.primaryContact){
                        $scope.address.primaryContact = $scope.address.requestedByContact;

                        ServiceRequest.addRelationship('primaryContact', $scope.address.requestedByContact, 'self');
                    }
                    $scope.formatAdditionalData();
                });
            });
        };

        $scope.formatAdditionalData = function() {
            if (!BlankCheck.isNull($scope.address)) {
                $scope.formattedAddress = FormatterService.formatAddress($scope.address);
            }

            if (!BlankCheck.isNull($scope.address.primaryContact)) {
                $scope.formattedPrimaryContact = FormatterService.formatContact($scope.address.primaryContact);
            }

            if (!BlankCheck.isNull($scope.address.requestedByContact)) {
                $scope.requestedByContactFormatted = FormatterService.formatContact($scope.address.requestedByContact);
            }
            if (!BlankCheck.isNull($scope.sr.customerReferenceId)) {
                $scope.formattedReferenceId = FormatterService.formatNoneIfEmpty($scope.sr.customerReferenceId);
            }

            if (!BlankCheck.isNull($scope.sr.costCenter)) {
                $scope.formattedCostCenter = FormatterService.formatNoneIfEmpty($scope.sr.costCenter);
            }

        };

        function getSRNumber(existingUrl) {
            $timeout(function(){
                return ServiceRequest.getAdditional(ServiceRequest.item, Tombstone, 'tombstone', true).then(function(){
                    if (existingUrl === $location.url()) {
                        if(Tombstone.item && Tombstone.item.siebelId) {
                            ServiceRequest.item.requestNumber = Tombstone.item.siebelId;
                            $location.path(Addresses.route + '/delete/' + $scope.address.id + '/receipt/notqueued');
                        } else {
                            return getSRNumber($location.url());
                        }
                    }
                });
            }, tombstoneWaitTimeout);
        }

        if (Addresses.item === null) {
            $scope.redirectToList();
        } else if($rootScope.selectedContact && $rootScope.returnPickerObject && $rootScope.selectionId === Addresses.item.id){
            $scope.address = $rootScope.returnPickerObject;
            $scope.sr = $rootScope.returnPickerSRObject;
            ServiceRequest.addRelationship('primaryContact', $rootScope.selectedContact, 'self');
            $scope.address.primaryContact = angular.copy($rootScope.selectedContact);
            $scope.formatAdditionalData();
            $scope.resetContactPicker();
        }else if($rootScope.contactPickerReset){
            $rootScope.address = Addresses.item;
            $rootScope.contactPickerReset = false;
        }else {

            $scope.address = Addresses.item;
            if (Addresses.item && !BlankCheck.isNull(Addresses.item['contact']) && Addresses.item['contact']['item']) {
                $scope.Addresses.primaryContact = Addresses.item['contact']['item'];
            }else if(Addresses.item && !BlankCheck.isNull(Addresses.item['contact'])){
                $scope.Addresses.primaryContact = Addresses.item['contact'];
            }

            if ($rootScope.returnPickerObject && $rootScope.selectionId !== Addresses.item.id) {
                $scope.resetContactPicker();
            }
        }

        $scope.setupSR(ServiceRequest, configureSR);
        $scope.setupTemplates(configureTemplates, configureReceiptTemplate, configureReviewTemplate);
        $scope.getRequestor(ServiceRequest, Contacts);

        function configureReviewTemplate(){
            var destinationAddress = {
                name: $scope.address.name,
                storeFrontName: $scope.address.storeFrontName,
                country: $scope.address.country,
                addressLine1: $scope.address.addressLine1,
                addressLine2: $scope.address.addressLine2,
                city: $scope.address.city,
                state: $scope.address.state,
                postalCode: $scope.address.postalCode
            };

            $scope.configure.actions.translate.submit = 'ADDRESS_MAN.DELETE_ADDRESS.BTN_DELETE_ADDRESS_REQUEST';
            $scope.configure.actions.submit = function(){

            ServiceRequest.addField('destinationAddress', destinationAddress);

              if(!$scope.isLoading) {
                $scope.isLoading = true;
                ServiceRequest.addField('attachments', $scope.files_complete);
                var deferred = ServiceRequest.post({
                     item:  $scope.sr
                });
                deferred.then(function(result){
                  if(ServiceRequest.item._links['tombstone']) {
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
                'type': $translate.instant('SERVICE_REQUEST_COMMON.TYPES.' + ServiceRequest.item.type)
            };
            $scope.configure.header.translate.body = "QUEUE.RECEIPT.TXT_PARA";
            $scope.configure.header.translate.bodyValues= {
                'srHours': 24
            };
            $scope.configure.header.translate.readMore = undefined;
            $scope.configure.header.translate.action="QUEUE.RECEIPT.TXT_ACTION";
            $scope.configure.header.translate.actionValues = {
                actionLink: Addresses.route,
                actionName: 'Manage Addresses'
            };
            $scope.configure.receipt = {
                translate:{
                    title:"ADDRESS_MAN.DELETE_ADDRESS.TXT_DELETE_ADDRESS_DETAILS",
                    titleValues: {'srNumber': $translate.instant('QUEUE.RECEIPT.TXT_GENERATING_REQUEST') }
                }
            };
            $scope.configure.queued = true;
          } else {
            $scope.configure.header.translate.h1 = "ADDRESS_MAN.DELETE_ADDRESS.TXT_DELETE_ADDRESS_SUBMITTED";
            $scope.configure.header.translate.body = "ADDRESS_MAN.DELETE_ADDRESS.TXT_DELETE_ADDRESS_SUBMITTED_PAR";
            $scope.configure.header.translate.readMore = 'ADDRESS_MAN.COMMON.CTRL_MANAGE_ANOTHER_ADDRESS';
            $scope.configure.header.translate.readMoreUrl = Addresses.route;
            $scope.configure.header.translate.bodyValues= {
                'refId': FormatterService.getFormattedSRNumber($scope.sr),
                'srHours': 24,
                'deviceManagementUrl': 'device_management/',
            };
            $scope.configure.receipt = {
                translate:{
                    title:"ADDRESS_MAN.DELETE_ADDRESS.TXT_DELETE_ADDRESS_DETAILS",
                    titleValues: {'srNumber': FormatterService.getFormattedSRNumber($scope.sr) }
                },
                print: true
            };
            $scope.configure.contact.show.primaryAction = false;
          }
        }
        function configureTemplates(){
            $scope.configure = {
                header: {
                    translate:{
                        h1: 'ADDRESS_MAN.DELETE_ADDRESS.TXT_DELETE_INSTALL_ADDRESS',
                        body: 'ADDRESS_MAN.DELETE_ADDRESS.TXT_DELETE_INSTALL_ADDRESS_PAR',
                        bodyValues: '',
                        readMore: ''
                    },
                    readMoreUrl: '',
                    showCancelBtn: false
                },
                address: {
                    information:{
                        translate: {
                            title: 'ADDRESS_MAN.DELETE_ADDRESS.TXT_ADDRESS_DELETED',
                            contact: 'ADDRESS_MAN.COMMON.TXT_REQUEST_CONTACTS'
                        }
                    }
                },
                contact:{
                    translate: {
                        title: 'ADDRESS_MAN.COMMON.TXT_REQUEST_CONTACTS',
                        requestedByTitle: 'ADDRESS_MAN.COMMON.TXT_REQUEST_CREATED_BY',
                        primaryTitle: 'ADDRESS_MAN.COMMON.TXT_REQUEST_CONTACT',
                        changePrimary: 'SERVICE_REQUEST.CHANGE_PRIMARY_CONTACT'
                    },
                    show:{
                        primaryAction : true
                    },
                    pickerObject: $scope.address,
                    source: 'AddressDelete'
                },
                detail:{
                    translate:{
                        title: 'ADDRESS_MAN.COMMON.TXT_ADDITIONAL_REQUEST_DETAILS',
                        referenceId: 'ADDRESS_MAN.COMMON.TXT_CUSTOMER_REF_ID',
                        costCenter: 'REQUEST_MAN.COMMON.TXT_REQUEST_COST_CENTER',
                        comments: 'LABEL.COMMON.COMMENTS',
                        attachments: 'LABEL.COMMON.ATTACHMENTS',
                        attachmentMessage: 'MESSAGE.ATTACHMENT',
                        validationMessage:'ATTACHMENTS.COMMON.VALIDATION',
                        fileList: ['.csv', '.xls', '.xlsx', '.vsd', '.doc', '.docx', '.ppt', '.pptx', '.pdf', '.zip'].join(', ')
                    },
                    show:{
                        referenceId: true,
                        costCenter: false,
                        comments: false,
                        attachements: false
                    }
                },
                actions:{
                    translate: {
                        abandonRequest:'ADDRESS_MAN.DELETE_ADDRESS.BTN_ABANDON_DELETE',
                        submit: 'ADDRESS_MAN.DELETE_ADDRESS.BTN_DELETE_ADDRESS_REQUEST'
                    },
                    submit: function(){
                        $location.path(Addresses.route + '/delete/' + $scope.address.id + '/review');
                    }
                },
                modal:{
                    translate:{
                        abandonTitle: 'SERVICE_REQUEST.TITLE_ABANDON_MODAL',
                        abandondBody: 'SERVICE_REQUEST.BODY_ABANDON_MODAL',
                        abandonCancel:'SERVICE_REQUEST.ABANDON_MODAL_CANCEL',
                        abandonConfirm: 'SERVICE_REQUEST.ABANDON_MODAL_CONFIRM',
                    },
                    returnPath: '/service_requests/addresses'
                },
                contactPicker:{
                    translate:{
                        title: 'CONTACT.SELECT_CONTACT',
                        contactSelectText: 'CONTACT.SELECTED_CONTACT_IS',
                    },
                    returnPath: Addresses.route + '/delete/' + $scope.address.id + '/review'
                },
                attachments:{
                    maxItems:2
                }
            };
        }

        $scope.formatReceiptData($scope.formatAdditionalData);
    }
]);
