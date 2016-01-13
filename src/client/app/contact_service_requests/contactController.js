define(['angular', 'contact'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestContacts')
    .controller('ContactController', ['$scope', 'Contacts', 'translationPlaceHolder',
        function($scope, Contacts, translationPlaceHolder) {
            $scope.translationPlaceHolder = translationPlaceHolder;

            $scope.contacts = Contacts;
            $scope.comparisonAddress = null;
            $scope.acceptedEnteredAddress = 1;
            $scope.needToVerify = false;

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
                        Contacts.item.lastName = contactForm.lastName.$modelValue;

                        if (contactForm.addressLine1.$modelValue) {
                            Contacts.item.address.country = 'USA';
                            Contacts.item.address.addressLine1 = contactForm.addressLine1.$modelValue;
                            Contacts.item.address.postalCode = contactForm.zipCode.$modelValue;
                        }

                        console.log(contactForm);
                        console.log(Contacts.item);

                        Contacts.verifyAddress(Contacts.item.address, function(statusCode, bodsData) {
                            if (statusCode === 200) {
                                $scope.needToVerify = true;
                                $scope.comparisonAddress = bodsData;
                            } else {
                                 Contacts.save(Contacts.item, {
                                    preventDefaultParams: true
                                }).then(function(r) {
                                    $scope.saved = true;
                                    $scope.updated = false;
                                    Contacts.goToUpdate(Contacts.item);
                                });
                            }
                        });
                    }
                }
            }
        }
    ]);
});
