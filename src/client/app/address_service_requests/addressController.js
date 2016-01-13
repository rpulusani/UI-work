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
        'SecurityHelper',
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
            SecurityHelper) {

            new SecurityHelper($rootScope).redirectCheck($rootScope.addressAccess);

            var redirect_to_list = function() {
               $location.path(Addresses.route + '/');
            };

            $scope.translationPlaceHolder = translationPlaceHolder;
            //$scope.continueForm = false;
            //$scope.submitForm = false;
            //$scope.allowMakeChange = allowMakeChange;
            
            SRHelper.addMethods(Addresses, $scope, $rootScope);

            if (Addresses.item === null) {
                redirect_to_list();
            }
            if(!$routeParams.id){
                $scope.address = {accountId: $rootScope.currentAccount, id:'new'};
            }else{
                $scope.address = Addresses.item;
            }

            var configureSR = function(ServiceRequest){
                    ServiceRequest.addRelationship('account', $scope.address);
                    ServiceRequest.addRelationship('address', $scope.address, 'self');
                    ServiceRequest.addRelationship('primaryContact', $scope.address, 'contact');

                    ServiceRequest.addField('type', 'DATA_ADDRESS_CHANGE'); //could be DATA_ADDRESS_ADD or DATA_ADDRESS_REMOVE
            };


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
