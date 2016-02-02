define(['angular', 'contact'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestContacts')
    .controller('ContactController', [
        '$scope',
        'Contacts',
        '$translate',
        '$rootScope',
        'FormatterService',
        'ServiceRequestService',
        function($scope, Contacts, $translate, $rootScope, FormatterService, ServiceRequest) {
            $scope.contacts = Contacts;

            if (Contacts.item === null) {
                Contacts.goToList();
            } else {
                // Address information from /address-validation
                $scope.comparisonAddress = false;
                // the verify radio btn value
                $scope.acceptedEnteredAddress = 1;
                // User has been prompted with the need to verify and can now save/update
                $scope.canSave = false;

                $scope.processDelete = function(fn) {
                    ServiceRequest.setItem(Contacts.createSRFromContact());

                    ServiceRequest.get({
                        method: 'post',
                        preventDefaultParams: true,
                        data: ServiceRequest.item
                    }).then(function(res) {
                        if (res.status === 201) {
                            ServiceRequest.setItem(res.data);
                            Contacts.submitedSR = true;
                            Contacts.goToDelete();
                        }
                    });
                };

                $scope.updateContact = function(contactForm) {
                    var runUpdate = function(item) {
                         Contacts.update(item, {
                            preventDefaultParams: true
                        }).then(function() {
                            $scope.canSave = false;

                            Contacts.alertState = 'updated';
                            Contacts.goToUpdate();
                        });
                    };

                    Contacts.item.postURL = Contacts.url + '/' + Contacts.item.id;

                    if ($scope.canSave === true) {
                        runUpdate(Contacts.item);
                    } else {
                        if (!contactForm.addressLine1.$pristine || !contactForm.addressLine2.$pristine
                            || !contactForm.postalCode.$pristine) {
                            Contacts.verifyAddress($scope.contacts.item.address, function(statusCode, bodsData) {
                                if (statusCode === 200) {
                                    $scope.comparisonAddress = bodsData;
                                } else {
                                    runUpdate(Contacts.item);
                                }

                                if ($scope.acceptedEnteredAddress === 2) {
                                    Contacts.item.address = $scope.comparisonAddress;
                                }

                                $scope.canSave = true;
                            });
                        } else {
                             runUpdate(Contacts.item);
                        }
                    }
                };

                $scope.saveContact = function(contactForm) {
                    Contacts.setItem($scope.contacts.item);

                    if ($scope.canSave === true) {
                        Contacts.save(Contacts.item, {
                            preventDefaultParams: true
                        }).then(function(r) {
                            $scope.canSave = false;

                            Contacts.alertState = 'saved';
                            Contacts.goToUpdate();
                        });
                    } else {
                        Contacts.verifyAddress($scope.contacts.item.address, function(statusCode, bodsData) {
                            if (statusCode === 200) {
                                $scope.comparisonAddress = bodsData;
                            }

                            if ($scope.acceptedEnteredAddress === 2) {
                                Contacts.item.address = $scope.comparisonAddress;
                            }

                            $scope.canSave = true;
                        });
                    }
                };

                $scope.translationPlaceHolder = {
                    contactInfo: $translate.instant('CONTACT.INFO'),
                    requestContactInfo: $translate.instant('DEVICE_SERVICE_REQUEST.REQUEST_CONTACT_INFORMATION'),
                    submit: $translate.instant('CONTACT_SERVICE_REQUEST.SUBMIT_DELETE'),
                    cancel: $translate.instant('CONTACT_SERVICE_REQUEST.ABANDON_DELETE')
                };

                $scope.formattedPrimaryContact = FormatterService.formatContact(Contacts.item);
                $scope.requestedByContactFormatted = FormatterService.formatContact({
                    firstName: $rootScope.currentUser.firstName,
                    lastName: $rootScope.currentUser.lastName,
                    workPhone: $rootScope.currentUser.workPhone
                });

                $scope.configure = {
                    header: {
                        translate:{
                            h1: 'CONTACT_SERVICE_REQUEST.DELETE',
                            body: 'MESSAGE.LIPSUM'
                        },
                        readMoreUrl: '',
                        showCancelBtn: false
                    },
                    detail:{
                        translate:{
                            title: 'DEVICE_SERVICE_REQUEST.ADDITIONAL_REQUEST_DETAILS',
                            referenceId: 'SERVICE_REQUEST.INTERNAL_REFERENCE_ID',
                            costCenter: 'SERVICE_REQUEST.REQUEST_COST_CENTER',
                            comments: 'LABEL.COMMENTS',
                            attachments: 'LABEL.ATTACHMENTS',
                            attachmentMessage: 'MESSAGE.ATTACHMENT',
                            fileList: ['.csv', '.xls', '.xlsx', '.vsd', '.doc', '.docx', '.ppt', '.pptx', '.pdf', '.zip'].join(', ')
                        },
                        show:{
                            referenceId: true,
                            costCenter: true,
                            comments: true,
                            attachements: true
                        }
                    },
                    contact: {
                        translate: {
                            title: 'DEVICE_SERVICE_REQUEST.REQUEST_CONTACT_INFORMATION',
                            primaryTitle: 'SERVICE_REQUEST.PRIMARY_CONTACT',
                            changePrimary: 'SERVICE_REQUEST.CHANGE_PRIMARY_CONTACT',
                            requestedByTitle: 'Request created by',

                        },
                        show:{
                            primaryAction : true
                        }
                    },
                    contactsr: {
                        translate: {
                            title: 'CONTACT.INFO',
                            primaryTitle: 'SERVICE_REQUEST.PRIMARY_CONTACT',
                            changePrimary: 'SERVICE_REQUEST.CHANGE_PRIMARY_CONTACT'
                        }
                    },
                    actions: {
                        translate: {
                            abandonRequest:'CONTACT_SERVICE_REQUEST.CANCEL',
                            submit: 'CONTACT_SERVICE_REQUEST.SR_DELETE'
                        },
                        submit: function() {
                            $scope.processDelete();
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

                if (Contacts.submitedSR) {
                    $scope.configure.header.translate.h1 = 'CONTACT_SERVICE_REQUEST.SR_DELETE_TITLE';

                    $scope.configure.header.translate.body = "CONTACT_SERVICE_REQUEST.DELETE_CONTACT_SUBMIT_HEADER_BODY";
                    $scope.configure.header.translate.readMore = 'CONTACT_SERVICE_REQUEST.RETURN_LINK';
                    $scope.configure.header.translate.readMoreUrl = Contacts.route;
                    $scope.configure.header.translate.bodyValues = {
                        srNumber: ServiceRequest.item.id,
                        srHours: 24
                    };

                    $scope.configure.receipt = {
                        translate: {
                            title: 'CONTACT_SERVICE_REQUEST.REQUEST_SERVICE_DETAIL',
                            titleValues: {'srNumber': ServiceRequest.item.id },
                            abandonRequest:'CONTACT_SERVICE_REQUEST.CANCEL',
                            submit: 'CONTACT_SERVICE_REQUEST.SR_UPDATE'
                        }
                    };
                }
            }
        }
    ]);
});
