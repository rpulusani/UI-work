define(['angular', 'contact'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestContacts')
    .controller('ContactUpdateAddressController', [
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
        '$timeout',
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
            HATEAOSConfig,
            $timeout) {

            SRHelper.addMethods(Contacts, $scope, $rootScope);

            $scope.checkAddress = function(contactForm) {
                if($scope.checkedAddress === 0){
                    $scope.enteredAddress = {
                        addressLine1: $scope.contact.address.addressLine1,
                        city: $scope.contact.address.city,
                        state:  $scope.contact.address.state,
                        country: $scope.contact.address.country,
                        postalCode: $scope.contact.address.postalCode
                    };
                    Addresses.verifyAddress($scope.enteredAddress, function(statusCode, bodsData) {
                        if (statusCode === 200) {
                            $scope.comparisonAddress = bodsData;
                            if($scope.contact.address.addressLine1 != $scope.comparisonAddress.addressLine1  ||
                                $scope.contact.address.city != $scope.comparisonAddress.city ||
                                $scope.contact.address.postalCode != $scope.comparisonAddress.postalCode) {
                                $scope.needToVerify = true;
                                $scope.checkedAddress = 1;
                                $scope.contactUpdate = true;
                            }else{
                                $scope.canReview = true;
                                $scope.checkedAddress = 1;
                                $scope.saveContact(contactForm);
                            }
                        }else{
                            //an error validating address has occurred with bods (log a different way?)
                            $scope.canReview = true;
                            $scope.checkedAddress = 1;
                            $scope.saveContact(contactForm);
                        }
                    });
                }
            };

            $scope.setAcceptedAddress =  function() {
              if ($scope.acceptedEnteredAddress === 'comparisonAddress') {
                    $scope.contact.address.country = $scope.comparisonAddress.country;
                    $scope.contact.address.addressLine1 = $scope.comparisonAddress.addressLine1;
                    $scope.contact.address.addressLine2 = $scope.comparisonAddress.addressLine2;
                    $scope.contact.address.city = $scope.comparisonAddress.city;
                    $scope.contact.address.state = $scope.comparisonAddress.state;
                    $scope.contact.address.postalCode = $scope.comparisonAddress.postalCode;
                } else {
                    $scope.contact.address.country = $scope.enteredAddress.country;
                    $scope.contact.address.addressLine1 = $scope.enteredAddress.addressLine1;
                    $scope.contact.address.addressLine2 = $scope.enteredAddress.addressLine2;
                    $scope.contact.address.city = $scope.enteredAddress.city;
                    $scope.contact.address.state = $scope.enteredAddress.state;
                    $scope.contact.address.postalCode = $scope.enteredAddress.postalCode;
                }
                $scope.canReview = true;
            };

            $scope.editAddress = function(addressType){
                $scope.needToVerify = false;
                if(addressType === 'comparisonAddress'){
                    $scope.contact.address.country = $scope.comparisonAddress.country;
                    $scope.contact.address.addressLine1 = $scope.comparisonAddress.addressLine1;
                    $scope.contact.address.addressLine2 = $scope.comparisonAddress.addressLine2;
                    $scope.contact.address.city = $scope.comparisonAddress.city;
                    $scope.contact.address.state = $scope.comparisonAddress.state;
                    $scope.contact.address.postalCode = $scope.comparisonAddress.postalCode;
                }
                $scope.canReview = true;
            };

            $scope.resetAddress = function(){
                $scope.contact.address = {};
                $scope.needToVerify = false;
                $scope.checkedAddress = 0;
            };

            $scope.getRequestor = function(ServiceRequest, Contacts) {
                Users.getLoggedInUserInfo().then(function() {
                    Users.item.links.contact().then(function() {
                        Contacts.tempSpace.requestedByContact = Users.item.contact.item;
                    });
                });
            };

            $scope.addressValuesChanged = function(){
                if($scope.contact.address.addressLine1 !== $scope.originalAddress.addressLine1 ||
                    $scope.contact.address.addressLine2 !== $scope.originalAddress.addressLine2 ||
                    $scope.contact.address.city !== $scope.originalAddress.city ||
                    $scope.contact.address.state !== $scope.originalAddress.state ||
                    $scope.contact.address.postalCode !== $scope.originalAddress.postalCode)
                    $scope.updatedAddress = true;
            };

            if(Contacts.item === null){
                $scope.redirectToList();
            }else{
                Contacts.tempSpace = {};
                $scope.contact = Contacts.item;
                $scope.comparisonAddress = {};
                $scope.checkedAddress = 0;
                $scope.needToVerify = false;
                $scope.canReview = false;
                $scope.updatedAddress = false;
                $scope.originalAddress = angular.copy($scope.contact.address);
            }


            $scope.saveContact = function(contactForm) {
                $scope.checkAddress(contactForm);
                //$scope.addressValuesChanged();
                if($scope.canReview === true && $scope.checkedAddress === 1){
                    $location.path(Contacts.route + '/update/' + $scope.contact.id + '/review');
                }
            };

        }
    ]);
});
