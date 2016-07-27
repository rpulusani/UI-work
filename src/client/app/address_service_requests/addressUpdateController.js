
angular.module('mps.serviceRequestAddresses')
.controller('AddressUpdateController', ['$scope',
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
    'UserService',
    'SRControllerHelperService',
    'permissionSet',
    'TombstoneService',
    'tombstoneWaitTimeout',
    'SecurityHelper',
    'ErrorMsgs','$interval','tombstoneCheckCount',
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
        Users,
        SRHelper,
        permissionSet,
        Tombstone,
        tombstoneWaitTimeout,
        SecurityHelper,
        ErrorMsgs,$interval,tombstoneCheckCount) {
        
        if(Addresses.item === null){                        
            window.scrollTo(0,0);
            $location.path(Addresses.route+'/');
        }

        $scope.isLoading = false;
        $scope.returnedForm = false;
        $scope.bodsError = false;
        $scope.bodsErrorKey = '';

        SRHelper.addMethods(Addresses, $scope, $rootScope);
        $scope.setTransactionAccount('AddressUpdate', Addresses);
        new SecurityHelper($rootScope).redirectCheck($rootScope.addressAccess);

        var statusBarLevels = [
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_SUBMITTED_SHORT'), value: 'SUBMITTED'},
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_IN_PROCESS'), value: 'INPROCESS'},
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_COMPLETED'), value: 'COMPLETED'}];

        function generateCsvRows() {
            var rows = [];

            if ($scope.sr && FormatterService.getFormattedSRNumber($scope.sr)) {
                rows.push(FormatterService.getFormattedSRNumber($scope.sr));
            } else {
                rows.push('none');
            }
           
            if ($scope.requestedByContactFormatted) {
                rows.push($scope.requestedByContactFormatted.replace(/<br\/>/g, ', '));
            } else {
                rows.push('none');
            }

            if ($scope.formattedPrimaryContact) {
                rows.push($scope.formattedPrimaryContact.replace(/<br\/>/g, ', '));
            } else {
                rows.push('none');
            }           
            
            if ($scope.sr && FormatterService.getFormattedSRNumber($scope.sr)) {
                var submittedDate = $filter('date')(new Date(), 'yyyy-MM-ddTHH:mm:ss');
                rows.push(submittedDate.toString());
                rows.push($translate.instant('ADDRESS_MAN.COMMON.TXT_CSV_SUBMITTED_STATUS'));
            } else {
                rows.push('none');
                rows.push('none');
            }

            if ($scope.formattedReferenceId) {
                rows.push($scope.formattedReferenceId);
            } else {
                rows.push('none');
            }

            if ($scope.formattedAddress) {
                rows.push($scope.formattedAddress.replace(/<br\/>/g, ', '));
            } else {
                rows.push('none');
            }        

            return rows;
        }
        function setCsvDefinition() {
            var headers = [
                $translate.instant('ADDRESS_MAN.COMMON.TXT_CSV_REQUEST_NBR'),
                $translate.instant('ADDRESS_MAN.COMMON.TXT_CSV_REQUESTED_BY_CONTACT'),
                $translate.instant('ADDRESS_MAN.COMMON.TXT_CSV_PRIMARY_CONTACT'),
                $translate.instant('ADDRESS_MAN.COMMON.TXT_CSV_CREATED_ON'),
                $translate.instant('ADDRESS_MAN.COMMON.TXT_CSV_STATUS'),
                $translate.instant('ADDRESS_MAN.COMMON.TXT_CSV_CUSTOMER_REF_NBR'),
                $translate.instant('ADDRESS_MAN.UPDATE_ADDRESS.TXT_CSV_UPDATED_ADDRESS')
            ],
            rows = generateCsvRows(),
            i = 0;

            $scope.csvModel = {
                filename: FormatterService.getFormattedSRNumber($scope.sr),
                headers: headers,
                // rows are just property names found on the dataObj
                rows: rows
            };

            var pdfHeaders1 = [],
            pdfRows1 = [];
            var totalColumnsCnt = headers.length;                      

            for (i; i < totalColumnsCnt; i += 1) {
               pdfHeaders1.push({text: headers[i], fontSize: 8});
            }

            i = 0;
            for (i; i < totalColumnsCnt; i += 1) {
               pdfRows1.push({text: rows[i], fontSize: 8});
            }
            
            $scope.pdfModel = {
              content: [
                {
                  table: {
                    headerRows: 1,
                    body: [
                      pdfHeaders1,
                      pdfRows1
                    ]
                  }
                }
              ]
            };
        }

        $scope.checkAddress = function() {
                if($scope.checkedAddress === 0 && $scope.updateAddress.$valid && $scope.address.country){
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
                        $scope.bodsError = true;
                        $scope.checkedAddress = 1;
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
                $scope.address.region = $scope.comparisonAddress.region;
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
            $scope.acceptedEnteredAddress = 'enteredAddress';
            $scope.setAcceptedAddress();
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
            $location.path(Addresses.route + '/' + $scope.address.id + '/update');
        };

        $scope.goToDelete = function(){
            $location.path(Addresses.route + '/delete/' + $scope.address.id + '/review');
        };

        $scope.goToReview = function() {
            $scope.checkAddress();
            if($scope.canReview === true && $scope.checkedAddress === 1){
                    if($scope.acceptedEnteredAddress==='comparisonAddress' && !$scope.address.state.trim() && $scope.comparisonAddress.province){
                        $scope.address.state = $scope.comparisonAddress.region;
                        $scope.address.addressCleansedFlag = 'Y';
                        $scope.address.region = $scope.comparisonAddress.region;
                    }
                $location.path(Addresses.route + '/update/' + $scope.address.id + '/review');
            }
        };

        var configureSR = function(ServiceRequest){
            ServiceRequest.addRelationship('account', $scope.address);
            ServiceRequest.addRelationship('sourceAddress', $scope.address, 'self');
            ServiceRequest.addField('type', 'DATA_ADDRESS_CHANGE');
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

        };

        if (Addresses.item === null) {
            $scope.redirectToList();
        } else if($rootScope.selectedContact && $rootScope.returnPickerObject && $rootScope.selectionId === Addresses.item.id){        	
            $scope.address = $rootScope.returnPickerObject;
            $scope.sr = $rootScope.returnPickerSRObject;
            ServiceRequest.addRelationship('primaryContact', $rootScope.selectedContact, 'self');
            $scope.address.primaryContact = angular.copy($rootScope.selectedContact);
            $scope.formatAdditionalData();
            $scope.resetContactPicker();
        }else {
            $scope.address = Addresses.item;
            $scope.enteredAddress = {};
            $scope.comparisonAddress = {};
            $scope.checkedAddress = 0;
            $scope.needToVerify = false;
            $scope.canReview = false;
        }
        $scope.address.storeFrontQuestion = true;
        if (BlankCheck.isNullOrWhiteSpace($scope.address.storeFrontName)) {
            $scope.address.storeFrontQuestion = false;
        }
        $scope.setStoreFrontName = function(){
            if($scope.storeFrontNameCheck){
                $scope.address.storeFrontName =  $scope.address.name;
            }else{
                $scope.address.storeFrontName ='';
            }
        };
        $scope.setupSR(ServiceRequest, configureSR);
        $scope.setupTemplates(configureTemplates, configureReceiptTemplate, configureReviewTemplate);
        $scope.getRequestor(ServiceRequest, Contacts);

        var updateSRObjectForSubmit = function() {
            var destinationAddress = {
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
            if($scope.address.addressCleansedFlag === 'Y'){
                destinationAddress.region = $scope.address.region;
            }
            ServiceRequest.addField('destinationAddress', destinationAddress);
            ServiceRequest.addField('attachments', $scope.files_complete);
        };

        function getSRNumber(existingUrl) {
              var intervalPromise = $interval(function(){        		
        		ServiceRequest.getAdditional(ServiceRequest.item, Tombstone, 'tombstone', true).then(function(){
        			
                    if (existingUrl === $location.url()) {
                        if(Tombstone.item && Tombstone.item.siebelId) {
                            ServiceRequest.item.requestNumber = Tombstone.item.siebelId;
                            $location.path(Addresses.route + '/updates/' + $scope.address.id + '/receipt/notqueued');
                            $interval.cancel(intervalPromise);
                        }else if(Tombstone.item.status && Tombstone.item.status.toLowerCase() === 'fail'){
                        	$location.path(Addresses.route + '/updates/' + $scope.address.id + '/receipt/queued');
                    		$interval.cancel(intervalPromise);
                        }
                    }
                });
        	}, tombstoneWaitTimeout, tombstoneCheckCount);
        	
        	intervalPromise.then(function(){
        		 $location.path(Addresses.route + '/updates/' + $scope.address.id + '/receipt/queued');
        		$interval.cancel(intervalPromise);
        	});
            
        }

        function configureReviewTemplate(){
            $scope.configure.header.translate.h1 = "ADDRESS_MAN.UPDATE_ADDRESS.TXT_REVIEW_UPDATE_ADDRESS";
            $scope.configure.actions.translate.submit = 'ADDRESS_MAN.COMMON.BTN_REVIEW_SUBMIT';
            $scope.configure.header.showDeleteBtn = false;
            $scope.configure.actions.submit = function(){
              if(!$scope.isLoading) {
                $scope.isLoading = true;

                updateSRObjectForSubmit();
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
            }; // end $scope.configure.actions
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
                    title:"ADDRESS_MAN.UPDATE_ADDRESS.TXT_UPDATE_ADDRESS_DETAILS",
                    titleValues: {'srNumber': $translate.instant('QUEUE.RECEIPT.TXT_GENERATING_REQUEST') }
                }
            };
            $scope.configure.queued = true;
          } else {
            $scope.configure.header.translate.h1 = "ADDRESS_MAN.UPDATE_ADDRESS.TXT_UPDATE_ADDRESS_SUBMITTED";
            $scope.configure.header.translate.body = "ADDRESS_MAN.UPDATE_ADDRESS.TXT_UPDATE_ADDRESS_SUBMITTED_PAR";
            $scope.configure.header.translate.bodyValues= {
                'refId': FormatterService.getFormattedSRNumber($scope.sr),
                'srHours': 24,
                'addressUrl': '/service_requests/addresses',
            };
            $scope.configure.address.information.translate.makeChanges = false;
            $scope.configure.header.showDeleteBtn = false;
            $scope.configure.receipt = {
                translate: {
                    title:"ADDRESS_MAN.UPDATE_ADDRESS.TXT_UPDATE_ADDRESS_DETAILS",
                    titleValues: {'srNumber': FormatterService.getFormattedSRNumber($scope.sr) }
                },
                print: true
            };
            $scope.configure.contact.show.primaryAction = false;
          }
        }

        function configureTemplates() {
            $scope.configure = {
                header: {
                    translate: {
                        h1: 'ADDRESS_MAN.UPDATE_ADDRESS.TXT_UPDATE_ADDRESS',
                        body: 'ADDRESS_MAN.UPDATE_ADDRESS.TXT_UPDATE_ADDRESS_PAR',
                        readMore: ''
                    },
                    readMoreUrl: '',
                    showCancelBtn: false,
                    showDeleteBtn: true
                },
                address: {
                    information:{
                        translate: {
                            title: 'ADDRESS_MAN.UPDATE_ADDRESS.TXT_ADDRESS_UPDATED',
                            contact: 'ADDRESS_MAN.COMMON.TXT_REQUEST_CONTACTS',
                            makeChanges: 'ADDRESS_MAN.COMMON.CTRL_MAKE_CHANGES'
                        }
                    }
                },
                contact: {
                    translate: {
                        title: 'ADDRESS_MAN.COMMON.TXT_REQUEST_CONTACTS',
                        requestedByTitle: 'ADDRESS_MAN.COMMON.TXT_REQUEST_CREATED_BY',
                        primaryTitle: 'ADDRESS_MAN.COMMON.TXT_REQUEST_CONTACT',
                        changePrimary: 'SERVICE_REQUEST.CHANGE_PRIMARY_CONTACT'
                    },
                    show: {
                        primaryAction : true
                    },
                    pickerObject: $scope.address,
                    source: 'AddressUpdate'
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
                        abandonRequest:'ADDRESS_MAN.UPDATE_ADDRESS.BTN_DISCARD_ADDRESS_UPDATE',
                        submit: 'ADDRESS_MAN.COMMON.BTN_REVIEW_SUBMIT'
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
                    returnPath: Addresses.route + '/'
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
                        value: $scope.address.name
                    }
                }
            };

        }

        $scope.formatReceiptData($scope.formatAdditionalData);
        setCsvDefinition();
    }
]);
