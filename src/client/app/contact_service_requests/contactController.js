define(['angular', 'contact'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestContacts')
    .controller('ContactController', ['$scope', 'Contacts', 'translationPlaceHolder',
        function($scope, Contacts, translationPlaceHolder) {
            $scope.translationPlaceHolder = translationPlaceHolder;

            $scope.contacts = Contacts;
            $scope.comparisonAddress = null;
            $scope.acceptedEnteredAddress = 1;

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
                        Contacts.item.firstName = $scope.firstName;
                        Contacts.item.lastName = $scope.lastName;

                        if ($scope.address.addressLine1) {
                            Contacts.item.address.country = 'USA';
                            Contacts.item.address.addressLine1 = $scope.address.addressLine1;
                            Contacts.item.address.postalCode = $scope.address.postalCode;
                        }

                        Contacts.verifyAddress(Contacts.item.address, function(statusCode, bodsData) {
                            if (statusCode === 200) {
                                $scope.comparisonAddress = bodsData;
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
