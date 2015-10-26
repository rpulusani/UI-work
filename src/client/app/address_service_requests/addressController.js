define(['angular', 'address'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestAddresses')
    .controller('AddressController', ['$scope', '$location', '$routeParams', 'Addresses',
        '$rootScope', '$q', 'translationPlaceHolder', 'allowMakeChange',
        function($scope, $location, $routeParams,  Addresses, $rootScope, $q, translationPlaceHolder,
         allowMakeChange) {
            $scope.continueForm = false;
            $scope.submitForm = false;
            $scope.translationPlaceHolder = translationPlaceHolder;
            $scope.allowMakeChange = allowMakeChange;

            if ($routeParams.id) { //doing work on a current address
                var promise = Addresses.getSelfResource($routeParams.id);
                $q.when(promise,
                    function(item){
                        $scope.address = item;
                    }
                );
            } else { //doing work on a new address
                $scope.address = {accountId: $rootScope.currentAccount, id:'new'};
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
