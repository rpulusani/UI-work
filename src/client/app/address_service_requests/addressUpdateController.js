define(['angular', 'address'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestAddresses')
    .controller('AddressUpdateController', ['$scope',
        '$location',
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
        'SecurityHelper',
        'permissionSet',
        'TombstoneService',
        'tombstoneWaitTimeout',
        function($scope,
            $location,
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
            SecurityHelper,
            permissionSet,
            Tombstone,
            tombstoneWaitTimeout) {

            $scope.isLoading = false;
            $scope.returnedForm = false;

            SRHelper.addMethods(Addresses, $scope, $rootScope);

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
                $location.path(Addresses.route + '/' + $scope.address.id + '/update');
            };

            $scope.goToDelete = function(){
                $location.path(Addresses.route + '/delete/' + $scope.address.id + '/review');
            };

            $scope.goToReview = function() {
                $scope.checkAddress();
                if($scope.canReview === true && $scope.checkedAddress === 1){
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

            $scope.setupSR(ServiceRequest, configureSR);
            $scope.setupTemplates(configureTemplates, configureReceiptTemplate, configureReviewTemplate, ServiceRequest);
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
                    postalCode: $scope.address.postalCode
                };
                
                ServiceRequest.addField('destinationAddress', destinationAddress);
                ServiceRequest.addField('attachments', $scope.files_complete)
            };

            function configureReviewTemplate(){
                $scope.configure.actions.translate.submit = 'ADDRESS_SERVICE_REQUEST.SR_UPDATE';
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
                        $timeout(function(){
                          ServiceRequest.getAdditional(ServiceRequest.item, Tombstone, 'tombstone', true).then(function() {
                            if(Tombstone.item && Tombstone.item.siebelId) {
                              $location.search('tab', null);
                              ServiceRequest.item.requestNumber = Tombstone.item.siebelId;
                              $location.path(Addresses.route + '/update/' + $scope.address.id + '/receipt/notqueued');
                            } else {
                              $location.search('tab', null);
                              //Reviewed with Kris - uncertain why this is here
                              // $rootScope.newAddress = $scope.address;
                              // $rootScope.newSr = $scope.sr;
                              $location.path(Addresses.route + '/update/' + $scope.address.id + '/receipt/queued');
                            }
                          });
                        }, tombstoneWaitTimeout);
                      }
                    }, function(reason){
                        NREUM.noticeError('Failed to create SR because: ' + reason);
                    });
                  }
                }; // end $scope.configure.actions
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
                        title:"ADDRESS_SERVICE_REQUEST.REQUEST_SERVICE_DETAIL",
                        titleValues: {'srNumber': $translate.instant('QUEUE.RECEIPT.TXT_GENERATING_REQUEST') }
                    }
                };
                $scope.configure.queued = true;
              } else {
                $scope.configure.header.translate.h1 = "ADDRESS_SERVICE_REQUEST.SR_UPDATE_SUBMITTED";
                $scope.configure.header.translate.body = "ADDRESS_SERVICE_REQUEST.UPDATE_ADDRESS_SUBMIT_HEADER_BODY";
                $scope.configure.header.translate.bodyValues= {
                    'srNumber': FormatterService.getFormattedSRNumber($scope.sr),
                    'srHours': 24,
                    'addressUrl': '/service_requests/addresses',
                };
                $scope.configure.address.information.translate.makeChanges = false;
                $scope.configure.header.showDeleteBtn = false;
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
                            h1: 'ADDRESS_SERVICE_REQUEST.UPDATE',
                            body: 'MESSAGE.LIPSUM',
                            readMore: ''
                        },
                        readMoreUrl: '',
                        showCancelBtn: false,
                        showDeleteBtn: true
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
                    contact: {
                        translate: {
                            title: 'SERVICE_REQUEST.CONTACT_INFORMATION',
                            requestedByTitle: 'SERVICE_REQUEST.REQUEST_CREATED_BY',
                            primaryTitle: 'SERVICE_REQUEST.PRIMARY_CONTACT',
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
                            abandonRequest:'ADDRESS_SERVICE_REQUEST.CANCEL',
                            submit: 'LABEL.REVIEW_SUBMIT'
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
