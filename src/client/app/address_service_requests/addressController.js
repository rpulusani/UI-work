define(['angular', 'address'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestAddresses')
    .controller('AddressController', [
        '$scope',
        'Addresses',
        '$translate',
        '$rootScope',
        'FormatterService',
        'ServiceRequestService',
        'SecurityHelper',
        'Contacts',
        function(
            $scope, Addresses, $translate, $rootScope, FormatterService, ServiceRequest, SecurityHelper, Contacts) {

            $scope.addresses = Addresses;

            if (Addresses.item === null) {
                Addresses.goToList();
            }else {
                if (Addresses.wasSaved) {
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
                // User has been prompted with the need to verify and can now save/update
                $scope.canSave = false;
                $scope.canUpdate = false;

                //TODO UPDATES?
                 $scope.translationPlaceHolder = {
                    contactInfo: $translate.instant('CONTACT.INFO'),
                    requestContactInfo: $translate.instant('DEVICE_SERVICE_REQUEST.REQUEST_CONTACT_INFORMATION'),
                    submit: $translate.instant('CONTACT_SERVICE_REQUEST.SUBMIT_DELETE'),
                    cancel: $translate.instant('CONTACT_SERVICE_REQUEST.ABANDON_DELETE')
                };

             $scope.formattedAddress = FormatterService.formatAddress(Addresses.item);
                $scope.requestedByAddressFormatted = FormatterService.formatAddress({
                    name: $scope.addresses.item.name,
                    storeFrontname: $scope.addresses.item.storeFrontName,
                    addressLine1: $scope.addresses.item.addressLine1,
                    addressLine2: $scope.addresses.item.addressLine2,
                    city: $scope.addresses.item.city,
                    state: $scope.addresses.item.state,
                    postalCode: $scope.addresses.item.postalCode,
                    country: $scope.addresses.item.country
                });

                $scope.formattedPrimaryContact = FormatterService.formatContact(Contacts.item);
                $scope.requestedByContactFormatted = FormatterService.formatContact({
                    firstName: $rootScope.currentUser.firstName,
                    lastName: $rootScope.currentUser.lastName,
                    workPhone: $rootScope.currentUser.workPhone
                });

                $scope.configure = {
                    header: {
                        translate:{
                            h1: 'ADDRESS_SERVICE_REQUEST.DELETE',
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
                    addresssr: {
                        translate: {
                            title: 'ADDRESS.INFO',
                            primaryTitle: 'SERVICE_REQUEST.PRIMARY_CONTACT',
                            changePrimary: 'SERVICE_REQUEST.CHANGE_PRIMARY_CONTACT'
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
                    actions: {
                        translate: {
                            abandonRequest:'ADDRESS_SERVICE_REQUEST.CANCEL',
                            submit: 'ADDRESS_SERVICE_REQUEST.SR_UPDATE'
                        },
                        submit: function() {
                            $scope.processDelete();
                        }
                    }
                };

                 if (Addresses.submitedSR) {
                    $scope.configure.header.translate.h1 = 'ADDRESS_SERVICE_REQUEST.SR_DELETE_SUBMITTED';

                    $scope.configure.receipt = {
                        translate: {
                            title: 'ADDRESS_SERVICE_REQUEST.REQUEST_SERVICE_DETAIL',
                            titleValues: {'srNumber': ServiceRequest.item.id },
                            abandonRequest:'ADDRESS_SERVICE_REQUEST.CANCEL',
                            submit: 'ADDRESS_SERVICE_REQUEST.SR_UPDATE'
                        }
                    };
                }

                $scope.processDelete = function(fn) {
                    ServiceRequest.setItem(Addresses.createSRFromAddress());

                    ServiceRequest.get({
                        method: 'post',
                        preventDefaultParams: true,
                        data: ServiceRequest.item
                    }).then(function(res) {
                        if (res.status === 201) {
                            ServiceRequest.setItem(res.data);
                            Addresses.submitedSR = true;
                            Addresses.goToDelete();
                        }
                    });
                },

                $scope.saveAddress = function(addressForm) {
                    if (!$scope.enteredAddress) {
             
                    }

                    if (Addresses.item && Addresses.item.id) {
                        $scope.enteredAddress = {
                            country: addressForm.country.$modelValue,
                            addressLine1: addressForm.addressLine1.$modelValue,
                            postalCode: addressForm.zipCode.$modelValue,
                            city: addressForm.city.$modelValue
                        };

                        Addresses.wasSaved = false;
                        Addresses.item.postURL = Addresses.url + '/' + Addresses.item.id;

                        if ($scope.enteredAddress.addressLine1 !== Addresses.item.address.addressLine1 || $scope.enteredAddress.city !== Addresses.item.address.city) {

                            $scope.canUpdate = false;

                        } else {
                            $scope.canUpdate = true;
                        }


                        if ($scope.canUpdate || $scope.canUpdate === false && !$scope.enteredAddress.addressLine1) {
                            
                            Addresses.update(Addresses.item, {
                                preventDefaultParams: true
                            }).then(function() {
                                $scope.updated = true;
                                
                                Addresses.goToUpdate();
                            });
                        } else {
                            Addresses.verifyAddress($scope.enteredAddress, function(statusCode, bodsData) {
                                if (statusCode === 200) {
                                    $scope.comparisonAddress = bodsData;
                                    $scope.needToVerify = true;
                                }

                                $scope.canUpdate = true;
                            });
                        }
                    } else {
                        Addresses.item = Addresses.getModel();
                        Addresses.item.name = addressForm.name.$modelValue;
                        Addresses.item.storeFrontName = addressForm.storeFrontName.$modelValue;
                        Addresses.item.country = addressForm.country.$modelValue;
                        Addresses.item.addressLine1 = addressForm.addressLine1.$modelValue;
                        Addresses.item.addressLine2 = addressForm.addressLine2.$modelValue;
                        Addresses.item.city = addressForm.city.$modelValue;
                        Addresses.item.state = addressForm.state.$modelValue;
                        Addresses.item.zipCode = addressForm.zipCode.$modelValue;
                        
                        $scope.updated = false;

                        if ($scope.canSave === false) {
                            $scope.enteredAddress = {
                                country: addressForm.country.$modelValue,
                                addressLine1: addressForm.addressLine1.$modelValue,
                                postalCode: addressForm.zipCode.$modelValue,
                                city: addressForm.city.$modelValue
                            };

                            Addresses.verifyAddress($scope.enteredAddress, function(statusCode, bodsData) {
                                if (statusCode === 200) {
                                    $scope.comparisonAddress = bodsData;
                                    $scope.needToVerify = true;
                                }

                                $scope.canSave = true;
                            });
                        } else {
                            if ($scope.acceptedEnteredAddress === 2) {
                                Addresses.item.address = $scope.comparisonAddress;
                            } else {
                                Addresses.item.address = $scope.enteredAddress;
                            }

                            Addresses.save(Addresses.item, {
                                preventDefaultParams: true
                            }).then(function(r) {
                                Addresses.wasSaved = true;
                                $scope.updated = false;

                                Addresses.goToUpdate();
                            });
                        }
                    }
                }
            }
    }]);
});
