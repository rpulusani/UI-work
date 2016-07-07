
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
    'SecurityHelper',
    'ErrorMsgs',
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
        $timeout,
        SecurityHelper,
        ErrorMsgs) {

        $scope.bodsError = false;
        $scope.bodsErrorKey = '';

        SRHelper.addMethods(Contacts, $scope, $rootScope);
        $scope.setTransactionAccount('ContactUpdateAddress', Contacts);
        new SecurityHelper($rootScope).redirectCheck($rootScope.contactAccess);

        $scope.checkAddress = function(contactForm) {
        	if($scope.checkedAddress === 0 && $scope.editContact.$valid){
        		 $scope.validForm = true;
                $scope.enteredAddress = {
                    addressLine1: $scope.contact.address.addressLine1,
                    addressLine2: $scope.contact.address.addressLine2,
                    city: $scope.contact.address.city,
                    state:  $scope.contact.address.state,
                    country: $scope.contact.address.country,
                    postalCode: $scope.contact.address.postalCode
                };
                Addresses.verifyAddress($scope.enteredAddress, function(statusCode, bodsData) {
                    if (statusCode === 200) {
                        $scope.bodsError = false;
                        $scope.comparisonAddress = bodsData;
                        if($scope.contact.address.addressLine1 != $scope.comparisonAddress.addressLine1  ||
                            $scope.contact.address.city != $scope.comparisonAddress.city ||
                            $scope.contact.address.postalCode != $scope.comparisonAddress.postalCode) {
                            $scope.needToVerify = true;
                            $scope.checkedAddress = 1;
                            $scope.contactUpdate = true;
                            $scope.acceptedEnteredAddress = 'comparisonAddress';
                            $scope.setAcceptedAddress();
                        }else{
                            $scope.canReview = true;
                            $scope.checkedAddress = 1;
                            $scope.contact.address.addressCleansedFlag = 'Y';
                            $scope.saveContact(contactForm);
                        }
                    }else{
                        //an error validating address has occurred with bods (log a different way?)
                        $scope.needToVerify = true;
                        $scope.contactUpdate = false;
                        $scope.bodsError = true;
                        $scope.checkedAddress = 1;
                        var localKey = '';
                        if (bodsData && bodsData.message) {
                            localKey = bodsData.message.substring(0, 4);
                            ErrorMsgs.query(function(data) {
                                for (var i=0;i<data.length;i++) {
                                    if (data[i].id === localKey) {
                                        $scope.bodsErrorKey = data[i].key;
                                    }
                                }
                            });
                        }
                        $scope.acceptedEnteredAddress = 'enteredAddress';
                        $scope.setAcceptedAddress();
                    }
                });
            }else {
                $scope.validForm = false;
                window.scrollTo(0,0);
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
                $scope.contact.address.addressCleansedFlag = 'Y';
            } else {
                $scope.contact.address.country = $scope.enteredAddress.country;
                $scope.contact.address.addressLine1 = $scope.enteredAddress.addressLine1;
                $scope.contact.address.addressLine2 = $scope.enteredAddress.addressLine2;
                $scope.contact.address.city = $scope.enteredAddress.city;
                $scope.contact.address.state = $scope.enteredAddress.state;
                $scope.contact.address.postalCode = $scope.enteredAddress.postalCode;
                $scope.contact.address.addressCleansedFlag = 'N';
            }
            $scope.canReview = true;
        };

        $scope.editAddress = function(addressType){
            $scope.checkedAddress = 0;
            $scope.needToVerify = false;
            if(addressType === 'comparisonAddress'){
                $scope.contact.address.country = $scope.comparisonAddress.country;
                $scope.contact.address.addressLine1 = $scope.comparisonAddress.addressLine1;
                $scope.contact.address.addressLine2 = $scope.comparisonAddress.addressLine2;
                $scope.contact.address.city = $scope.comparisonAddress.city;
                $scope.contact.address.state = $scope.comparisonAddress.state;
                $scope.contact.address.postalCode = $scope.comparisonAddress.postalCode;
            }
            $scope.canReview = false;
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
            if($scope.contact && $scope.contact.address){
                if($scope.contact.address.addressLine1 !== $scope.originalAddress.addressLine1 ||
                    $scope.contact.address.addressLine2 !== $scope.originalAddress.addressLine2 ||
                    $scope.contact.address.city !== $scope.originalAddress.city ||
                    $scope.contact.address.state !== $scope.originalAddress.state ||
                    $scope.contact.address.postalCode !== $scope.originalAddress.postalCode){
                        $scope.updatedAddress = true;
                }
            }
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
                $scope.contact.address.countryIsoCode=$scope.contact.address.isoCountryCode;
                $scope.contact.address.isoCountryCode = undefined;
            	$scope.contact.address.stateOrPostalMandatory=undefined;
            	$scope.contact.address.zipMandatory=undefined;
            	Contacts.setBuildingFloorOffice($scope.contact,$scope.address);
               	$location.path(Contacts.route + '/update/' + $scope.contact.id + '/review');
            }
        };

    }
]);
