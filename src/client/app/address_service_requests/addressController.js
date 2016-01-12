define(['angular', 'address', 'account', 'serviceRequest'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestAddresses')
    .controller('AddressController', [
        '$rootScope',
        '$scope',
        '$location',
        '$routeParams',
        'Addresses',
        'ServiceRequestService',
        'AccountService',
        '$q',
        'translationPlaceHolder',
        'allowMakeChange',
        'SRControllerHelperService',
        'BlankCheck',
        'UserService',
        '$http',
        function(
            $rootScope,
            $scope,
            $location,
            $routeParams,
            Addresses,
            ServiceRequestService,
            Account,
            $q,
            translationPlaceHolder,
            allowMakeChange,
            SRHelper,
            BlankCheck,
            User,
            $http) {

            $scope.translationPlaceHolder = translationPlaceHolder;
            //$scope.continueForm = false;
            //$scope.submitForm = false;
            //$scope.allowMakeChange = allowMakeChange;
            SRHelper.addMethods(Addresses, $scope, $rootScope);


            if ($routeParams.id) { //doing work on a current address
                //var promise = Addresses.getSelfResource($routeParams.id);
                /*var promise = $routeParams.id;
                $q.when(promise,
                    function(item){
                        $scope.address = item;
                    }
                );*/
                User.getLoggedInUserInfo().then(function(user) {
                    if (angular.isArray(User.item._links.accounts)) {
                        User.item._links.accounts = User.item._links.accounts[0];
                    }

                    User.getAdditional(User.item, Account).then(function() {
                        Account.getAdditional(Account.item, Addresses).then(function() {
                            var accountID = Account.item.accountId;
                            var accountLevel = Account.item.level;
                            var singleAddress = $routeParams.id;

                            $http.get('https://api.venus-dev.lexmark.com/mps/accounts/' + accountID + '/addresses/' + singleAddress + '?accountLevel=' + accountLevel).success(function(addressData) {
                                $scope.address = addressData;
                            }).error(function(data) {
                                NREUM.noticeError(data);
                            });

                        });
                    });
                });
            } else { //doing work on a new address
                $scope.address = {accountId: $rootScope.currentAccount, id:'new'};
            }



            var configureSR = function(ServiceRequest){
                    ServiceRequest.addRelationship('account', $scope.address);
                    ServiceRequest.addRelationship('address', $scope.address, 'self');
                    ServiceRequest.addRelationship('primaryContact', $scope.address, 'contact');

                    ServiceRequest.addField('type', 'DATA_ADDRESS_CHANGE'); //could be DATA_ADDRESS_ADD or DATA_ADDRESS_REMOVE
            };

            if (Addresses.item === null) {
                //$scope.redirectToList();
            } else if($rootScope.selectedContact && $rootScope.returnPickerObject && $rootScope.selectionId === Addresses.item.id){
                $scope.address = $rootScope.returnPickerObject;
                $scope.sr = $rootScope.returnPickerSRObject;
                ServiceRequest.addRelationship('primaryContact', $rootScope.selectedContact, 'self');
                $scope.address.primaryContact = angular.copy($rootScope.selectedContact);
                $scope.resetContactPicker();
            }else if($rootScope.contactPickerReset){
                $rootScope.address = Addresses.item;
                $rootScope.contactPickerReset = false;
            }else {

                $scope.address = Address.item;
                
                if (!BlankCheck.isNull(Addresses.item['contact'])) {
                    $scope.address.primaryContact = $scope.address['contact']['item'];
                }

                if (BlankCheck.isNullOrWhiteSpace($scope.address.storeFront)) {
                    $scope.address.storeFront = false;
                }

                if ($rootScope.returnPickerObject && $rootScope.selectionId !== Addresses.item.id) {
                    $scope.resetContactPicker();
                }

            }


            $scope.contact = {}; //set current user

            $scope.setStoreFrontName = function() {
                $scope.address.storeFrontName =  $scope.address.name;
            };

            $scope['continue'] = function() {
                $scope.continueForm = true;
            };

            $scope.goToReview = function(address) {
                $location.path('/service_requests/addresses/' + address.id + '/review');
            };

            $scope.goToViewAll = function(address) {
                $location.path('/service_requests/addresses');
            };


            $scope.goToVerify = function() {
               // Addresses.verify($scope.address, function(res) {
                    Addresses.addresss = $scope.address;
                    $location.path('/service_requests/addresses/' + $scope.address.id + '/verify');
                //});
            };

             $scope.save = function() {
                if ($scope.address.id) {
                    Addresses.update({
                        id: $scope.address.id,
                        accountId: $scope.address.accountId
                    }, $scope.address, $scope.goToViewAll);
                } else {
                    Addresses.save({
                        accountId: $scope.address.accountId
                    }, $scope.address, $scope.goToViewAll);
                }
            };

            $scope.removeAddress = function(address) {
                Addresses.remove($scope.address, function() {
                    $scope.addresses.splice($scope.addresses.indexOf(address), 1);
                });
            };

            $scope.cancel = function() {
                $location.path('/service_requests/addresses');
            };



    }]);
});
