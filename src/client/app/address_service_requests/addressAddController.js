define(['angular', 'address'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestAddresses')
    .controller('AddressAddController', [
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
            HATEAOSConfig) {

            SRHelper.addMethods(Addresses, $scope, $rootScope);

            $scope.setStoreFrontName = function(){
                $scope.address.storeFrontName =  $scope.address.name;
            };

            $scope.goToReview = function() {
                $rootScope.newAddress = $scope.address;
                $location.path(Addresses.route + '/add/review');
            };

            var configureSR = function(ServiceRequest){
                ServiceRequest.addRelationship('primaryContact', $scope.address, 'requestor');
            };

            if ($rootScope.selectedContact && $rootScope.returnPickerObject){
                $scope.address = $rootScope.returnPickerObject;
                $scope.sr = $rootScope.returnPickerSRObject;
                if ($rootScope.currentSelected) {
                    if ($rootScope.currentSelected === 'updateRequestContact') {
                        ServiceRequest.addRelationship('primaryContact', $rootScope.selectedContact, 'self');
                        $scope.address.primaryContact = angular.copy($rootScope.selectedContact);
                    } else if ($rootScope.currentSelected === 'updateAddressContact') {
                        ServiceRequest.addRelationship('addressContact', $rootScope.selectedContact, 'self');
                        $scope.address.addressContact = angular.copy($rootScope.selectedContact);
                    }
                }
                $scope.resetContactPicker();
            } else {
                $scope.address = {};
                if ($rootScope.newAddress || $rootScope.newSr) {
                    if ($rootScope.newAddress) {
                        $scope.address = $rootScope.newAddress;
                        $rootScope.newAddress = undefined;
                    }
                    if ($rootScope.newSr) {
                        $scope.sr = $rootScope.newSr;
                        $rootScope.newSr = undefined;
                    }
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
                    updateSRObjectForSubmit();
                    if (!BlankCheck.checkNotBlank(ServiceRequest.item.postURL)) {
                        HATEAOSConfig.getApi(ServiceRequest.serviceName).then(function(api) {
                            ServiceRequest.item.postURL = api.url;
                        });
                    }
                    var deferred = AddressServiceRequest.post({
                        item:  $scope.sr
                    });

                    deferred.then(function(result){
                        ServiceRequest.item = AddressServiceRequest.item;
                        $rootScope.newAddress = $scope.address;
                        $rootScope.newSr = $scope.sr;
                        $location.path(Addresses.route + '/add/receipt');
                    }, function(reason){
                        NREUM.noticeError('Failed to create SR because: ' + reason);
                    });

                };
            }

            function configureReceiptTemplate() {
                $scope.configure.header.translate.h1 = "ADDRESS_SERVICE_REQUEST.ADD_ADDRESS_REQUEST_SUBMITTED";
                $scope.configure.header.translate.body = "ADDRESS_SERVICE_REQUEST.SUBMISSION_TEXT";
                $scope.configure.header.translate.bodyValues= {
                    'srNumber': FormatterService.getFormattedSRNumber($scope.sr),
                    'srHours': 24,
                    'addressUrl': '/service_requests/addresses',
                };
                $scope.configure.receipt = {
                    translate: {
                        title:"ADDRESS_SERVICE_REQUEST.REQUEST_SERVICE_DETAIL",
                        titleValues: {'srNumber': FormatterService.getFormattedSRNumber($scope.sr) }
                    }
                };
                $scope.configure.contact.show.primaryAction = false;
            }

            function configureTemplates() {
                $scope.configure = {
                    header: {
                        translate: {
                            h1: 'ADDRESS_SERVICE_REQUEST.ADD',
                            body: 'MESSAGE.LIPSUM',
                            readMore: 'Learn more about requests'
                        },
                        readMoreUrl: '/service_requests/learn_more'
                    },
                    address: {
                        information:{
                            translate: {
                                title: 'ADDRESS.INFO',
                                contact: 'ADDRESS_SERVICE_REQUEST.ADDRESS_CONTACT'
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
                    }
                };
            }

            var formatAdditionalData = function() {
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

            $scope.formatReceiptData(formatAdditionalData);
        }
    ]);
});
