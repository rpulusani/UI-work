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
                        $scope.contact.requestedByContact = Users.item.contact.item;
                        ServiceRequest.addRelationship('requester', $rootScope.currentUser, 'contact');
                        $scope.contact.primaryContact = $scope.contact.requestedByContact;
                        ServiceRequest.addRelationship('primaryContact', $scope.contact.requestedByContact, 'self');
                        $scope.requestedByContactFormatted =
                        FormatterService.formatContact($scope.contact.requestedByContact);
                    });
                });
            };

            if(Contacts.item){
                $scope.contact = Contacts.item;
                if($rootScope.alertState === 'saved'){
                    $rootScope.alertState = 'saved';
                }else if($rootScope.alertState === 'updated'){
                    $rootScope.alertState = 'updated';
                }
            }else{
                $scope.contact = {};
                $scope.contact.address = {};
                $scope.enteredAddress = {};
                $scope.comparisonAddress = {};
                $scope.checkedAddress = 0;
                $scope.needToVerify = false;
                $scope.getRequestor(ServiceRequest, Contacts);
            }

            var updateContactObjectForSubmit = function() {
                Contacts.item = $scope.contact;
                Contacts.addRelationship('account', $scope.contact.requestedByContact, 'account');
            };
           

            $scope.saveContact = function(contactForm) {
                $scope.checkAddress();
                if($scope.canReview === true && $scope.checkedAddress === 1){
                    updateContactObjectForSubmit();
                    Contacts.item.postURL = Contacts.url;
                    var deferred = Contacts.post({
                        item: $scope.contact
                    });

                    deferred.then(function(result){
                        $rootScope.alertState = 'saved';
                        $location.path(Contacts.route + '/' + $scope.contact.id + '/update');
                    }, function(reason){
                        NREUM.noticeError('Failed to create Contact because: ' + reason);
                    });

                }

            };

        }
    ]);
});
