
angular.module('mps.serviceRequestAddresses')
.controller('AddressAddController', [
    '$scope',
    '$location',
    '$filter',
    '$routeParams',
    '$rootScope',
    '$translate',
    '$timeout',
    'ServiceRequestService',
    'FormatterService',
    'BlankCheck',
    'Addresses',
    'Contacts',
    'SRControllerHelperService',
    'UserService',
    'HATEAOSConfig',
    'TombstoneService',
    'tombstoneWaitTimeout',
    'SecurityHelper',
    'ErrorMsgs',
    function($scope,
        $location,
        $filter,
        $routeParams,
        $rootScope,
        $translate,
        $timeout,
        ServiceRequest,
        FormatterService,
        BlankCheck,
        Addresses,
        Contacts,
        SRHelper,
        Users,
        HATEAOSConfig,
        Tombstone,
        tombstoneWaitTimeout,
        SecurityHelper,
        ErrorMsgs) {
        if(Addresses.item === null){                        
            window.scrollTo(0,0);
            $location.path(Addresses.route+'/');
        }
        $scope.isLoading = false;
        $scope.bodsError = false;
        $scope.bodsErrorKey = '';
        $rootScope.newAddress=undefined;
        SRHelper.addMethods(Addresses, $scope, $rootScope);
        $scope.setTransactionAccount('AddressAdd', ServiceRequest);
        new SecurityHelper($rootScope).redirectCheck($rootScope.addressAccess);

        var statusBarLevels = [
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_SUBMITTED_SHORT'), value: 'SUBMITTED'},
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_IN_PROCESS'), value: 'INPROCESS'},
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_COMPLETED'), value: 'COMPLETED'}];

        function getSRNumber(existingUrl) {
            $timeout(function(){
                return ServiceRequest.getAdditional(ServiceRequest.item, Tombstone, 'tombstone', true).then(function(){
                    if (existingUrl === $location.url()) {
                        if(Tombstone.item && Tombstone.item.siebelId) {
                            ServiceRequest.item.requestNumber = Tombstone.item.siebelId;
                            $location.path(Addresses.route + '/add/receipt/notqueued');
                        } else {
                            return getSRNumber($location.url());
                        }
                    }
                });
            }, tombstoneWaitTimeout);
        }

        function configureReviewTemplate(){
            $scope.configure.actions.translate.submit = 'ADDRESS_MAN.COMMON.BTN_SUBMIT_ADDRESS_REQUEST';
            $scope.configure.actions.submit = function(){
              if(!$scope.isLoading) {
                $scope.isLoading = true;

                updateSRObjectForSubmit();
                if (!BlankCheck.checkNotBlank(ServiceRequest.item.postURL)) {
                    HATEAOSConfig.getApi(ServiceRequest.serviceName).then(function(api) {
                        ServiceRequest.item.postURL = api.url;
                    });
                }
                var deferred = ServiceRequest.post({
                    item:  $scope.sr
                });

                deferred.then(function(result){
                  if(ServiceRequest.item._links['tombstone']) {
                    getSRNumber($location.url());
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
                actionName: $translate.instant('ADDRESS_MAN.MANAGE_ADDRESS.TXT_MANAGE_INSTALL_ADDRESSES')
            };
            $scope.configure.receipt = {
                translate:{
                    title:"ADDRESS_MAN.ADD_ADDRESS.TXT_ADD_ADDRESS_DETAILS",
                    titleValues: {'srNumber': $translate.instant('QUEUE.RECEIPT.TXT_GENERATING_REQUEST') }
                }
            };
            $scope.configure.queued = true;
          } else {
            $scope.configure.header.translate.h1 = "ADDRESS_MAN.ADD_ADDRESS.TXT_ADD_ADDRESS_SUBMITTED";
            $scope.configure.header.translate.body = "ADDRESS_MAN.ADD_ADDRESS.TXT_ADD_ADDRESS_SUBMITTED_PAR";
            $scope.configure.header.translate.bodyValues= {
                'srNumber': FormatterService.getFormattedSRNumber($scope.sr),
                'srHours': 24,
                'addressUrl': '/service_requests/addresses',
            };
            $scope.configure.address.information.translate.makeChanges = false;
            $scope.configure.receipt = {
                translate: {
                    title:"ADDRESS_MAN.ADD_ADDRESS.TXT_ADD_ADDRESS_DETAILS",
                    titleValues: {'srNumber': FormatterService.getFormattedSRNumber($scope.sr) }
                },
                print: true
            };
            $scope.configure.contact.show.primaryAction = false;
            $scope.configure.showAddAnotherAddress = true;
          }
            $scope.goToCreate = function() {
                ServiceRequest.newMessage();
                Addresses.item = undefined;
                $location.path('/service_requests/addresses/new');
            };
        }

        function configureTemplates() {
            $scope.configure = {
                header: {
                    translate: {
                        h1: 'ADDRESS_MAN.ADD_ADDRESS.TXT_ADD_INSTALL_ADDRESS',
                        body: 'ADDRESS_MAN.ADD_ADDRESS.TXT_ADD_INSTALL_ADDRESS_PAR',
                        readMore: 'ADDRESS_MAN.COMMON.LNK_LEARN_MORE'
                    },
                    readMoreUrl: '/service_requests/learn_more',
                    showCancelBtn: false,
                    showDeleteBtn: false
                },
                address: {
                    information:{
                        translate: {
                            title: 'ADDRESS_MAN.COMMON.TXT_ADDRESS_INFORMATION',
                            contact: 'ADDRESS_MAN.COMMON.TXT_REQUEST_CONTACTS',
                            makeChanges: 'ADDRESS_MAN.COMMON.CTRL_MAKE_CHANGES'
                        }
                    }
                },
                detail: {
                    translate: {
                        title: 'ADDRESS_MAN.COMMON.TXT_ADDITIONAL_REQUEST_DETAILS',
                        referenceId: 'ADDRESS_MAN.COMMON.TXT_CUSTOMER_REF_ID',
                        costCenter: 'REQUEST_MAN.COMMON.TXT_REQUEST_COST_CENTER',
                        comments: 'LABEL.COMMON.COMMENTS',
                        attachments: 'LABEL.COMMON.ATTACHMENTS',
                        attachmentMessage: 'MESSAGE.ATTACHMENT',
                        fileList: ['.csv', '.xls', '.xlsx', '.vsd', '.doc', '.docx', '.ppt', '.pptx', '.pdf', '.zip'].join(', ')
                    },
                    show: {
                        referenceId: true,
                        costCenter: false,
                        comments: false,
                        attachements: false
                    }
                },
                actions: {
                    translate: {
                        abandonRequest:'ADDRESS_MAN.ADD_ADDRESS.BTN_ABANDON_ADDRESS_CREATE',
                        submit: 'ADDRESS_MAN.COMMON.BTN_REVIEW_SUBMIT'
                    },
                    submit: $scope.goToReview
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
                    source: 'AddressAdd'
                },
                modal: {
                    translate: {
                        abandonTitle: 'SERVICE_REQUEST.TITLE_ABANDON_MODAL',
                        abandonBody: 'SERVICE_REQUEST.BODY_ABANDON_MODAL',
                        abandonCancel:'SERVICE_REQUEST.ABANDON_MODAL_CANCEL',
                        abandonConfirm: 'SERVICE_REQUEST.ABANDON_MODAL_CONFIRM'
                    },
                    returnPath: '/service_requests/addresses'
                },
                contactPicker: {
                    translate: {
                        replaceContactTitle: 'CONTACT.REPLACE_CONTACT'
                    }
                },
                breadcrumbs: {
                    1: {
                        href: '/service_requests/addresses',
                        value: 'ADDRESS.TITLE'
                    },
                    2: {
                        value: 'ADDRESS_MAN.ADD_ADDRESS.TXT_REVIEW_ADD_ADDRESS'
                    }
                }
            };
        }

        if($scope.inTransactionalAccountContext()){
            $scope.setStoreFrontName = function(){
                if($scope.storeFrontNameCheck){
                    $scope.address.storeFrontName =  $scope.address.name;
                }else{
                    $scope.address.storeFrontName ='';
                }
            };


            $scope.checkAddress = function() {
                    if(($scope.checkedAddress === undefined || $scope.checkedAddress === 0 ) && $scope.newAddress.$valid && $scope.address.country) {
                        $scope.validForm = true;
                    $scope.enteredAddress = {
                        addressLine1: $scope.address.addressLine1,
                        addressLine2: $scope.address.addressLine2,
                        city: $scope.address.city,
                        state:  $scope.address.state,
                        country: $scope.address.country,
                        postalCode: $scope.address.postalCode
                    };
                    Addresses.verifyAddress($scope.enteredAddress, function(statusCode, bodsData) {
                        if (statusCode === 200) {
                            $scope.bodsError = false;
                            $scope.comparisonAddress = bodsData;
                            if($scope.address.addressLine1 != $scope.comparisonAddress.addressLine1  || $scope.address.city != $scope.comparisonAddress.city || $scope.address.postalCode != $scope.comparisonAddress.postalCode){
                                $scope.needToVerify = true;
                                $scope.checkedAddress = 1;
                                $scope.contactUpdate = false;
                                $scope.acceptedEnteredAddress = 'comparisonAddress';
                                $scope.setAcceptedAddress();
                            }else{
                                $scope.canReview = true;
                                $scope.checkedAddress = 1;
                                $scope.address.addressCleansedFlag = 'Y';
                                $scope.goToReview();
                            }
                        }else{
                            //an error validating address has occurred with bods (log a different way?)
                            $scope.needToVerify = true;
                            $scope.contactUpdate = false;
                            $scope.checkedAddress = 1;
                            $scope.bodsError = true;
                            var localKey = '';
                            if (bodsData && bodsData.message) {
                                localKey = bodsData.message.substring(0, 4);
                                ErrorMsgs.query(function(data) {
                                    for (var i=0;i<data.length;i++) {
                                        if (data[i].id === localKey) {
                                            $scope.bodsErrorKey = data[i].key;
                                        }
                                    }
                                });
                            }
                            $scope.acceptedEnteredAddress = 'enteredAddress';
                            $scope.setAcceptedAddress();
                        }
                    });
                    } else {
                        $scope.validForm = false;
                        window.scrollTo(0,0);
                }
            };

            $scope.setAcceptedAddress =  function() {
              if ($scope.acceptedEnteredAddress === 'comparisonAddress') {
                    $scope.address.country = $scope.comparisonAddress.country;
                    $scope.address.addressLine1 = $scope.comparisonAddress.addressLine1;
                    $scope.address.addressLine2 = $scope.comparisonAddress.addressLine2;
                    $scope.address.city = $scope.comparisonAddress.city;
                    $scope.address.state = $scope.comparisonAddress.state;
                    $scope.address.postalCode = $scope.comparisonAddress.postalCode;
                    $scope.address.addressCleansedFlag = 'Y';
                } else {
                    $scope.address.country = $scope.enteredAddress.country;
                    $scope.address.addressLine1 = $scope.enteredAddress.addressLine1;
                    $scope.address.addressLine2 = $scope.enteredAddress.addressLine2;
                    $scope.address.city = $scope.enteredAddress.city;
                    $scope.address.state = $scope.enteredAddress.state;
                    $scope.address.postalCode = $scope.enteredAddress.postalCode;
                    $scope.address.addressCleansedFlag = 'N';
                }
                $scope.canReview = true;
            };

            $scope.editAddress = function(addressType){
                $scope.checkedAddress = 0;
                $scope.needToVerify = false;
                if(addressType === 'comparisonAddress'){
                    $scope.address.country = $scope.comparisonAddress.country;
                    $scope.address.addressLine1 = $scope.comparisonAddress.addressLine1;
                    $scope.address.addressLine2 = $scope.comparisonAddress.addressLine2;
                    $scope.address.city = $scope.comparisonAddress.city;
                    $scope.address.state = $scope.comparisonAddress.state;
                    $scope.address.postalCode = $scope.comparisonAddress.postalCode;
                    $scope.address.addressCleansedFlag = 'Y';
                }
                $scope.canReview = false;
            };

            $scope.resetAddress = function(){
                $scope.address = {};
                $scope.needToVerify = false;
                $scope.checkedAddress = 0;
            };

            $scope.makeChanges = function(){
                $scope.needToVerify = false;
                $scope.checkedAddress = 0;
                $location.path(Addresses.route + '/new');
            };

            $scope.goToReview = function() {
                $scope.checkAddress();
                if($scope.canReview === true && $scope.checkedAddress === 1){
                    Addresses.item = $scope.address;
                    $rootScope.newAddress = $scope.address;
                    $location.path(Addresses.route + '/add/review');
                }
            };

            var configureSR = function(ServiceRequest){
                ServiceRequest.addRelationship('primaryContact', $scope.address, 'requestor');
                ServiceRequest.addField('type', 'DATA_ADDRESS_ADD');
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

            if ($rootScope.selectedContact && $rootScope.returnPickerObject){
                $scope.address = $rootScope.returnPickerObject;
                $scope.sr = $rootScope.returnPickerSRObject;
                ServiceRequest.addRelationship('primaryContact', $rootScope.selectedContact, 'self');
                $scope.address.primaryContact = angular.copy($rootScope.selectedContact);
                $scope.formatAdditionalData();
                $scope.resetContactPicker();
            }else if(Addresses.item){
                $scope.address = Addresses.item;
            }else{
                $scope.address = {};
                $scope.enteredAddress = {};
                $scope.comparisonAddress = {};
                $scope.checkedAddress = 0;
                $scope.needToVerify = false;
                $scope.canReview = false;
                $scope.address.addressCleansedFlag = 'N';
                if (BlankCheck.isNullOrWhiteSpace($scope.address.storeFrontQuestion)) {
                    $scope.address.storeFrontQuestion = false;
                }
                
                if ($rootScope.newAddress || $rootScope.newSr) {
                    if ($rootScope.newAddress) {
                        $scope.address = $rootScope.newAddress;
                        $rootScope.newAddress = undefined;
                    }
                    if ($rootScope.newSr) {
                        $scope.sr = $rootScope.newSr;
                        $rootScope.newSr = undefined;
                    }
                } else {
                    $scope.getRequestor(ServiceRequest, Contacts);
                }
            }

            $scope.setupSR(ServiceRequest, configureSR);
            $scope.setupTemplates(configureTemplates, configureReceiptTemplate, configureReviewTemplate);


            var updateSRObjectForSubmit = function() {
                var sourceAddress = {
                    name: $scope.address.name,
                    storeFrontName: $scope.address.storeFrontName,
                    country: $scope.address.country,
                    addressLine1: $scope.address.addressLine1,
                    addressLine2: $scope.address.addressLine2,
                    city: $scope.address.city,
                    state: $scope.address.state,
                    postalCode: $scope.address.postalCode,
                    addressCleansedFlag: $scope.address.addressCleansedFlag
                };

                ServiceRequest.addField('sourceAddress', sourceAddress);
                ServiceRequest.addAccountRelationship();
                ServiceRequest.addField('attachments', $scope.files_complete);
            };

            $scope.formatReceiptData($scope.formatAdditionalData);
        }
    }
]);
