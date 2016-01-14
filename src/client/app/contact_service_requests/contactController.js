define(['angular', 'contact'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestContacts')
    .controller('ContactController', [
        '$scope',
        'Contacts',
        '$translate',
        '$rootScope',
        'FormatterService',
        function($scope, Contacts, $translate, $rootScope, FormatterService) {

            $scope.contacts = Contacts;

            if (Contacts.item === null) {
                Contacts.goToList();
            } else {
                if (Contacts.wasSaved) {
                    $scope.saved = true;
                }

                // Address information entered into form
                $scope.enteredAddress = {};
                // Address information from /address-validation
                $scope.comparisonAddress = {};
                // the verify radio btn value 
                $scope.acceptedEnteredAddress = 1;
                // verify address, hide-when
                $scope.needToVerify = false;
                // User has been prompted with the need to verify and can now save
                $scope.canSave = false;

                $scope.translationPlaceHolder = {
                    contactInfo: $translate.instant('CONTACT.INFO'),
                    requestContactInfo: $translate.instant('DEVICE_SERVICE_REQUEST.REQUEST_CONTACT_INFORMATION'),
                    submit: $translate.instant('CONTACT_SERVICE_REQUEST.SUBMIT_DELETE'),
                    cancel: $translate.instant('CONTACT_SERVICE_REQUEST.ABANDON_DELETE')
                };

                $scope.formattedPrimaryContact = FormatterService.formatContact(Contacts.item);
                $scope.requestedByContactFormatted = FormatterService.formatContact(Contacts.item);

                $scope.configure = {
                    header: {
                        translate:{
                            h1: 'CONTACT_SERVICE_REQUEST.DELETE',
                            body: 'MESSAGE.LIPSUM'
                        },
                        readMoreUrl: ''
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
                    actions:{
                        translate: {
                            abandonRequest:'CONTACT_SERVICE_REQUEST.CANCEL',
                            submit: 'CONTACT_SERVICE_REQUEST.SR_UPDATE'
                        },
                        submit: function() {
                            Contacts.goToDelete();
                        }
                    },
                    receipt: {
                        translate:{
                            title:"DEVICE_SERVICE_REQUEST.DECOMMISION_DEVICE_DETAIL",
                            titleValues: {'srNumber': 'test' }
                        }
                    }
                };

                // Submit a delete SR
                $scope.deleteContact = function() {
                    if (Contact.item) {

                    }
                };

                $scope.saveContact = function(contactForm) {
                    if (Contacts.item && Contacts.item.id) {
                        Contacts.wasSaved = false;
                        Contacts.item.postURL = Contacts.url + '/' + Contacts.item.id;

                        Contacts.update(Contacts.item, {
                            preventDefaultParams: true
                        }).then(function() {
                            if (Contacts.item._links) {
                                $scope.updated = true;
                                
                                Contacts.goToUpdate();
                            } else {
                                Contacts.goToList();
                            }
                        });
                    } else {
                        Contacts.item = Contacts.getModel();
                        Contacts.item.firstName = contactForm.firstName.$modelValue;
                        Contacts.item.middleName = contactForm.middleName.$modelValue;
                        Contacts.item.lastName = contactForm.lastName.$modelValue;
                        Contacts.item.email = contactForm.email.$modelValue;
                        Contacts.item.workPhone = contactForm.workPhone.$modelValue;

                        if ($scope.canSave === false) {
                            $scope.enteredAddress = {
                                country: contactForm.country.$modelValue,
                                addressLine1: contactForm.addressLine1.$modelValue,
                                postalCode: contactForm.zipCode.$modelValue,
                                city: contactForm.city.$modelValue
                            };

                            Contacts.verifyAddress($scope.enteredAddress, function(statusCode, bodsData) {
                                var currentAddress = Contacts.item.address;

                                if (statusCode === 200) {
                                    $scope.comparisonAddress = bodsData;
                                    $scope.needToVerify = true;
                                }

                                $scope.canSave = true;
                            });
                        } else {
                            if ($scope.acceptedEnteredAddress === 2) {
                                Contacts.item.address = $scope.comparisonAddress;
                            } else {
                                Contacts.item.address = $scope.enteredAddress;
                            }

                            Contacts.save(Contacts.item, {
                                preventDefaultParams: true
                            }).then(function(r) {
                                Contacts.wasSaved = true;
                                $scope.updated = false;

                                Contacts.goToUpdate();
                            });
                        }
                    }
                }
            }
        }
    ]);
});
