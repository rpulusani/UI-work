define(['angular', 'contact'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestContacts')
    .controller('ContactAddController', [
        '$scope',
        '$location',
        '$filter',
        '$routeParams',
        '$rootScope',
        'ServiceRequestService',
        'FormatterService',
        'BlankCheck',
        'Addresses',
        'Contacts',
        'SRControllerHelperService',
        'UserService',
        'HATEAOSConfig',
        function($scope,
            $location,
            $filter,
            $routeParams,
            $rootScope,
            ServiceRequest,
            FormatterService,
            BlankCheck,
            Addresses,
            Contacts,
            SRHelper,
            Users,
            HATEAOSConfig) {

            SRHelper.addMethods(Contacts, $scope, $rootScope);

            $scope.checkAddress = function() {
                if($scope.checkedAddress === 0){
                    $scope.enteredAddress = {
                        addressLine1: $scope.contacts.item.address.addressLine1,
                        city: $scope.contacts.item.address.city,
                        state:  $scope.contacts.item.address.state,
                        country: $scope.contacts.item.address.country,
                        postalCode: $scope.contacts.item.address.postalCode
                    };
                    Addresses.verifyAddress($scope.enteredAddress, function(statusCode, bodsData) {
                        if (statusCode === 200) {
                            $scope.comparisonAddress = bodsData;
                            if($scope.contacts.item.address.addressLine1 != $scope.comparisonAddress.addressLine1  ||
                                $scope.contacts.item.address.city != $scope.comparisonAddress.city ||
                                $scope.contacts.item.address.postalCode != $scope.comparisonAddress.postalCode) {
                                $scope.needToVerify = true;
                                $scope.checkedAddress = 1;
                            }else{
                                $scope.canReview = true;
                                $scope.checkedAddress = 1;
                                $scope.saveNewContact();
                            }
                        }else{
                            //an error validating address has occurred with bods (log a different way?)
                            $scope.canReview = true;
                            $scope.checkedAddress = 1;
                            $scope.saveNewContact();
                        }
                    });
                }
            };

            $scope.setAcceptedAddress =  function() {
              if ($scope.acceptedEnteredAddress === 'comparisonAddress') {
                    $scope.contacts.item.address.country = $scope.comparisonAddress.country;
                    $scope.contacts.item.address.addressLine1 = $scope.comparisonAddress.addressLine1;
                    $scope.contacts.item.address.addressLine2 = $scope.comparisonAddress.addressLine2;
                    $scope.contacts.item.address.city = $scope.comparisonAddress.city;
                    $scope.contacts.item.address.state = $scope.comparisonAddress.state;
                    $scope.contacts.item.address.postalCode = $scope.comparisonAddress.postalCode;
                } else {
                    $scope.contacts.item.address.country = $scope.enteredAddress.country;
                    $scope.contacts.item.address.addressLine1 = $scope.enteredAddress.addressLine1;
                    $scope.contacts.item.address.addressLine2 = $scope.enteredAddress.addressLine2;
                    $scope.contacts.item.address.city = $scope.enteredAddress.city;
                    $scope.contacts.item.address.state = $scope.enteredAddress.state;
                    $scope.contacts.item.address.postalCode = $scope.enteredAddress.postalCode;
                }
                $scope.canReview = true;
            };

            $scope.editAddress = function(addressType){
                $scope.needToVerify = false;
                if(addressType === 'comparisonAddress'){
                    $scope.contacts.item.address.country = $scope.comparisonAddress.country;
                    $scope.contacts.item.address.addressLine1 = $scope.comparisonAddress.addressLine1;
                    $scope.contacts.item.address.addressLine2 = $scope.comparisonAddress.addressLine2;
                    $scope.contacts.item.address.city = $scope.comparisonAddress.city;
                    $scope.contacts.item.address.state = $scope.comparisonAddress.state;
                    $scope.contacts.item.address.postalCode = $scope.comparisonAddress.postalCode;
                }
                $scope.canReview = true;
            };

            $scope.resetAddress = function(){
                $scope.contacts.item.address = {};
                $scope.needToVerify = false;
                $scope.checkedAddress = 0;
            };

            $scope.saveNewContact = function(contactForm) {
                $scope.checkAddress();
                if($scope.canReview === true && $scope.checkedAddress === 1){
                    Contact.item = $scope.contact;
                    $rootScope.newContact = $scope.contact;
                    $location.path(Contacts.route + contact.id +'/review');
                }
            };

            $scope.contacts = Contacts;
            $scope.contacts.item.address = {};
            $scope.enteredAddress = {};
            $scope.comparisonAddress = {};
            $scope.checkedAddress = 0;
            $scope.needToVerify = false;
            $scope.canReview = false;


            $scope.setupSR(Contacts, configureSRFromContact);
            $scope.setupTemplates(configureTemplates, configureReceiptTemplate, configureReviewTemplate);


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
                        }
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
                    }
                };
            }

        }
    ]);
});
