define(['angular', 'address'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestAddresses')
    .controller('AddressUpdateController', ['$scope',
        '$location',
        '$routeParams',
        '$rootScope',
        'ServiceRequestService',
        'FormatterService',
        'BlankCheck',
        'Addresses',
        'Contacts',
        'UserService',
        'SRControllerHelperService',
        'SecurityHelper',
        'permissionSet',
        function($scope,
            $location,
            $routeParams,
            $rootScope,
            ServiceRequest,
            FormatterService,
            BlankCheck,
            Addresses,
            Contacts,
            Users,
            SRHelper,
            SecurityHelper,
            permissionSet
            ) {

            $scope.returnedForm = false;

            SRHelper.addMethods(Addresses, $scope, $rootScope);

            $scope.goToReview = function() {
                $location.path(Addresses.route + '/update/' + $scope.address.id + '/review');
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
                        $scope.address.primaryContact = $scope.address.requestedByContact;
                        ServiceRequest.addRelationship('primaryContact', $scope.address.requestedByContact, 'self');
                        $scope.requestedByContactFormatted =
                        FormatterService.formatContact($scope.address.requestedByContact);
                    });
                });
            };

            if (Addresses.item === null) {
                $scope.redirectToList();
            } else if($rootScope.selectedContact && $rootScope.returnPickerObject && $rootScope.selectionId === Addresses.item.id){
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
                Addresses.item = $scope.address;
                $scope.resetContactPicker();
            }else {
                $scope.address = Addresses.item;
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
            };

            function configureReviewTemplate(){
                $scope.configure.actions.translate.submit = 'ADDRESS_SERVICE_REQUEST.SR_UPDATE';
                $scope.configure.actions.submit = function(){
                    updateSRObjectForSubmit();
                    var deferred = ServiceRequest.post({
                        item:  $scope.sr
                    });

                    deferred.then(function(result){
                        $rootScope.newAddress = $scope.address;
                        $rootScope.newSr = $scope.sr;
                        $location.path(Addresses.route + '/update/' + $scope.address.id + '/receipt');
                    }, function(reason){
                        NREUM.noticeError('Failed to create SR because: ' + reason);
                    });

                };
            }
            function configureReceiptTemplate() {
                $scope.configure.header.translate.h1 = "ADDRESS_SERVICE_REQUEST.SR_UPDATE_SUBMITTED";
                $scope.configure.header.translate.body = "ADDRESS_SERVICE_REQUEST.UBMISSION_TEXT";
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
                            h1: 'ADDRESS_SERVICE_REQUEST.UPDATE',
                            body: 'MESSAGE.LIPSUM',
                            readMore: ''
                        },
                        readMoreUrl: ''
                    },
                    address: {
                        information:{
                            translate: {
                                title: 'ADDRESS_SERVICE_REQUEST.REQUESTED_UPDATE_TO_ADDRESS',
                                contact: 'ADDRESS_SERVICE_REQUEST.ADDRESS_CONTACT'
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
