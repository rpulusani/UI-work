define(['angular', 'address', 'address.factory', 'account', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestAddresses')
    .controller('AddressListController', [
        '$scope',
        '$location',
        'grid',
        'Addresses',
        '$rootScope',
        'PersonalizationServiceFactory',
        'FilterSearchService',
        'SecurityHelper',
        'ServiceRequestService',
        '$q',
        'AccountService',
        'UserService',
        function(
            $scope,
            $location,
            Grid,
            Addresses,
            $rootScope,
            Personalize,
            FilterSearchService,
            SecurityHelper,
            ServiceRequest,
            $q,
            Account,
            User) {
            $rootScope.currentRowList = [];
            $scope.visibleColumns = [];

            var personal = new Personalize($location.url(),$rootScope.idpUser.id),
            filterSearchService = new FilterSearchService(Addresses, $scope, $rootScope, personal);

            $scope.goToCreate = function() {
                Addresses.item = {};
                $location.path(Addresses.route + '/new');
            };

            $scope.goToUpdate = function(address) { // update unit test
                ServiceRequest.reset();
                var addressId = address;
                if(addressId === null){ // for button click
                    addressId = Grid.getCurrentEntityId($scope.currentRowList[0]);
                }else{ // for anchor link
                    addressId = address.id;
                }
                $location.path(Addresses.route + '/' + addressId + '/update');
            };
            
            $scope.goToRemove = function(){
                var id = Grid.getCurrentEntityId($scope.currentRowList[0]);
                if(id !== null){
                    $location.path(Addresses.route + '/' + id + '/delete');
                }
            };

            $scope.view = function(address){
                Addresses.setItem(address);
                var options = {
                    params:{
                    }
                };

                Addresses.item.get(options).then(function(){
                    $location.path(Addresses.route + '/' + address.id + '/update');
                });
            };

            filterSearchService.addBasicFilter('ADDRESS.ALL_ADDRESSES',
                function() {
                    $scope.$broadcast('setupColumnPicker', Grid);
                }
            );


            // grid Check Items - should prototype
            $scope.isSingleSelected = function(){
                 if ($scope.currentRowList.length === 1) {
                    return true;
                 } else {
                    return false;
                 }
            };

            $scope.isMultipleSelected = function(){
                if ($scope.currentRowList.length > 1) {
                    return true;
                } else {
                    return false;
                }
            };

            // grid configuration
            $scope.gridOptions = {};
            $scope.gridOptions.onRegisterApi = Grid.getGridActions($rootScope, Addresses, personal);
            //$scope.gridOptions.enableHorizontalScrollbar =  2;
            //$scope.gridOptions.enableVerticalScrollbar = 0;
            
            User.getLoggedInUserInfo().then(function(user) {
                if (angular.isArray(User.item._links.accounts)) {
                    User.item._links.accounts = User.item._links.accounts[0];
                }

                User.getAdditional(User.item, Account).then(function() {
                    Account.getAdditional(Account.item, Addresses).then(function() {
                        Addresses.getPage().then(function() {
                            Grid.display(Addresses, $scope, personal);
                        }, function(reason) {
                            NREUM.noticeError('Grid Load Failed for ' + Addresses.serviceName +  ' reason: ' + reason);
                        });
                    });
                });
            });
        }
      ]);
});
