define(['angular', 'address'], function(angular) {
    'use strict';
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
            tombstoneWaitTimeout) {

            $scope.isLoading = false;

            SRHelper.addMethods(Addresses, $scope, $rootScope);

            $scope.setStoreFrontName = function(){
                $scope.address.storeFrontName =  $scope.address.name;
            };


            $scope.checkAddress = function() {
                if($scope.checkedAddress === 0){
                    $scope.enteredAddress = {
                        addressLine1: $scope.address.addressLine1,
                        city: $scope.address.city,
                        state:  $scope.address.state,
                        country: $scope.address.country,
                        postalCode: $scope.address.postalCode
                    };
                    Addresses.verifyAddress($scope.enteredAddress, function(statusCode, bodsData) {
                        if (statusCode === 200) {
                            $scope.comparisonAddress = bodsData;
                            if($scope.address.addressLine1 != $scope.comparisonAddress.addressLine1  || $scope.address.city != $scope.comparisonAddress.city || $scope.address.postalCode != $scope.comparisonAddress.postalCode){
                                $scope.needToVerify = true;
                                $scope.checkedAddress = 1;
                                $scope.contactUpdate = false;
                            }else{
                                $scope.canReview = true;
                                $scope.checkedAddress = 1;
                                $scope.goToReview();
                            }
                        }else{
                            //an error validating address has occurred with bods (log a different way?)
                            $scope.canReview = true;
                            $scope.checkedAddress = 1;
                            $scope.goToReview();
                        }
                    });
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
                } else {
                    $scope.address.country = $scope.enteredAddress.country;
                    $scope.address.addressLine1 = $scope.enteredAddress.addressLine1;
                    $scope.address.addressLine2 = $scope.enteredAddress.addressLine2;
                    $scope.address.city = $scope.enteredAddress.city;
                    $scope.address.state = $scope.enteredAddress.state;
                    $scope.address.postalCode = $scope.enteredAddress.postalCode;
                }
                $scope.canReview = true;
            };

            $scope.editAddress = function(addressType){
                $scope.needToVerify = false;
                if(addressType === 'comparisonAddress'){
                    $scope.address.country = $scope.comparisonAddress.country;
                    $scope.address.addressLine1 = $scope.comparisonAddress.addressLine1;
                    $scope.address.addressLine2 = $scope.comparisonAddress.addressLine2;
                    $scope.address.city = $scope.comparisonAddress.city;
                    $scope.address.state = $scope.comparisonAddress.state;
                    $scope.address.postalCode = $scope.comparisonAddress.postalCode;
                }
                $scope.canReview = true;
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
                    postalCode: $scope.address.postalCode
                };

                ServiceRequest.addField('sourceAddress', sourceAddress);
                ServiceRequest.addRelationship('account', $scope.address.requestedByContact, 'account');
            };

            function configureReviewTemplate(){
                $scope.configure.actions.translate.submit = 'ADDRESS_SERVICE_REQUEST.SUBMIT';
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
                        $location.search('tab', null);
                        $timeout(function(){
                          ServiceRequest.getAdditional(ServiceRequest.item, Tombstone, 'tombstone', true).then(function(){
                              if(Tombstone.item && Tombstone.item.siebelId) {
                                ServiceRequest.item.requestNumber = Tombstone.item.siebelId;
                                $location.path(Addresses.route + '/add/receipt/notqueued')
                              } else {
                                ServiceRequest.item = ServiceRequest.item;
                                $rootScope.newAddress = $scope.address;
                                $rootScope.newSr = $scope.sr;
                                $location.path(Addresses.route + '/add/receipt/queued');
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
                        title:"ORDER_MAN.SUPPLY_ORDER_SUBMITTED.TXT_ORDER_DETAIL_SUPPLIES",
                        titleValues: {'srNumber': $translate.instant('QUEUE.RECEIPT.TXT_GENERATING_REQUEST') }
                    }
                };
                $scope.configure.queued = true;
              } else {
                $scope.configure.header.translate.h1 = "ADDRESS_SERVICE_REQUEST.SR_ADD_SUBMITTED";
                $scope.configure.header.translate.body = "ADDRESS_SERVICE_REQUEST.ADD_ADDRESS_SUBMIT_HEADER_BODY";
                $scope.configure.header.translate.bodyValues= {
                    'srNumber': FormatterService.getFormattedSRNumber($scope.sr),
                    'srHours': 24,
                    'addressUrl': '/service_requests/addresses',
                };
                $scope.configure.receipt = {
                    translate: {
                        title:"ADDRESS_SERVICE_REQUEST.REQUEST_SERVICE_DETAIL",
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
                            h1: 'ADDRESS_SERVICE_REQUEST.ADD',
                            body: 'MESSAGE.LIPSUM',
                            readMore: 'Learn more about requests'
                        },
                        readMoreUrl: '/service_requests/learn_more',
                        showCancelBtn: false,
                        showDeleteBtn: false
                    },
                    address: {
                        information:{
                            translate: {
                                title: 'ADDRESS.INFO',
                                contact: 'ADDRESS_SERVICE_REQUEST.ADDRESS_CONTACT',
                                makeChanges: 'LABEL.MAKE_CHANGES'
                            }
                        }
                    },
                    detail: {
                        translate: {
                            title: 'ADDRESS_SERVICE_REQUEST.ADDITIONAL_REQUEST_DETAILS',
                            referenceId: 'SERVICE_REQUEST.INTERNAL_REFERENCE_ID',
                            costCenter: 'SERVICE_REQUEST.REQUEST_COST_CENTER',
                            comments: 'LABEL.COMMENTS',
                            attachments: 'LABEL.ATTACHMENTS',
                            attachmentMessage: 'MESSAGE.ATTACHMENT',
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
                            abandonRequest:'ADDRESS_SERVICE_REQUEST.ABANDON_ADD',
                            submit: 'LABEL.REVIEW_SUBMIT'
                        },
                        submit: $scope.goToReview
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


            $scope.formatReceiptData($scope.formatAdditionalData);
        }
    ]);
});
