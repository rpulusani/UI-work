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

            $scope.getRequestor = function(ServiceRequest, Contacts) {
                Users.getLoggedInUserInfo().then(function() {
                    Users.item.links.contact().then(function() {
                        $scope.contacts.requestedByContact = Users.item.contact.item;
                        ServiceRequest.addRelationship('requester', $rootScope.currentUser, 'contact');
                        $scope.contacts.primaryContact = $scope.contacts.requestedByContact;
                        ServiceRequest.addRelationship('primaryContact', $scope.contacts.requestedByContact, 'self');
                        $scope.requestedByContactFormatted =
                        FormatterService.formatContact($scope.contacts.requestedByContact);
                    });
                });
            };

            if(Contacts.item === null){
                Contacts.goToList();
            }else{
                $scope.contacts = Contacts;
                $scope.contacts.item.address = {};
                $scope.enteredAddress = {};
                $scope.comparisonAddress = {};
                $scope.checkedAddress = 0;
                $scope.needToVerify = false;
                $scope.canReview = false;
                $scope.getRequestor(ServiceRequest, Contacts);
            }

            var updateContactObjectForSubmit = function() {
                Contacts.item = $scope.contacts.item;
                Contacts.addRelationship('account', $scope.requestedByContact, 'account');
            };
           

            $scope.saveContact = function(contactForm) {
                $scope.checkAddress();
                if($scope.canReview === true && $scope.checkedAddress === 1){
                    Contacts.setItem($scope.contacts.item);
                    Contacts.alertState = 'saved';
                    Contacts.goToUpdate();

                    //post
                    /*updateContactObjectForSubmit();
                    Contacts.item.postURL = Contacts.url;

                    var deferred = Contacts.post({
                        item: $scope.contacts
                    });

                    deferred.then(function(result){
                        Contacts.alertState = 'saved';
                        $location.path(Contacts.route + '/' + $scope.contacts.id + '/update');
                    }, function(reason){
                        NREUM.noticeError('Failed to create Contact because: ' + reason);
                    });*/
                }

            };

        }
    ]);
});
