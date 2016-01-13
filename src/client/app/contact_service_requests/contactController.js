define(['angular', 'contact'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestContacts')
    .controller('ContactController', ['$scope', 'Contacts', 'translationPlaceHolder', '$translate',
        function($scope, Contacts, translationPlaceHolder, $translate) {
            $scope.translationPlaceHolder = translationPlaceHolder;

            $scope.contacts = Contacts;
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

            if (Contacts.item === null) {
                Contacts.goToList();
            } else {
                $scope.saveContact = function(contactForm) {
                    if (Contacts.item && Contacts.item.id) {
                        Contacts.item.postURL = Contacts.url + '/' + Contacts.item.id;

                        Contacts.update(Contacts.item, {
                            preventDefaultParams: true
                        }).then(function() {
                            $scope.saved = false;

                            if (Contacts.item._links) {
                                $scope.updated = true;
                                Contacts.goToUpdate(Contacts.item);
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
                                country: 'USA',
                                addressLine1: contactForm.addressLine1.$modelValue,
                                postalCode: contactForm.zipCode.$modelValue
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
                                $scope.saved = true;
                                $scope.updated = false;
                                Contacts.goToUpdate(Contacts.item);
                            });
                        }
                    }
                }
            }
        }
    ]);
});
