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
            GridService,
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

            var personal = new Personalize($location.url(),$rootScope.idpUser.id);

            $scope.goToCreate = function() {
                Addresses.item = {};
                $location.path(Addresses.route + '/new');
            };


            $scope.goToUpdate = function(address) { // may be able to remove
                ServiceRequest.reset();
                if(address !== null){
                    $location.path(Addresses.route + '/' + address.id + '/update');
                }else{
                var id = Grid.getCurrentEntityId($scope.currentRowList[0]);
                    if(id !== null){
                        $location.path(Addresses.route + '/' + id + '/update');
                    }
                }
            };


            $scope.view = function(address){
                if(address === null){
                    address = $rootScope.currentSelectedRow;
                    Addresses.setItem(address);
                }else{
                    Addresses.setItem(address);
                }
                var options = {
                    params:{
                        embed:'contact'
                    }
                };

                Addresses.item.get(options).then(function(){
                    $location.path(Addresses.route + '/' + address.id + '/update');
                });
            };

            $scope.goToRemove = function(){
                ServiceRequest.reset();
                var address = $rootScope.currentSelectedRow;
                Addresses.setItem(address);
                $location.path(Addresses.route + '/' + address.id + '/delete');
            };


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
            var Grid = new GridService();
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
                        var filterSearchService = new FilterSearchService(Addresses, $scope, $rootScope, personal);

                        filterSearchService.addBasicFilter('ADDRESS.ALL_ADDRESSES', {'embed': 'contact'}, false);

                        Addresses.getPage().then(function() {
                            Grid.display(Addresses, $scope, personal, false, function() {
                                $scope.$broadcast('setupColumnPicker', Grid);
                            });
                        }, function(reason) {
                            NREUM.noticeError('Grid Load Failed for ' + Addresses.serviceName +  ' reason: ' + reason);
                        });
                    });
                });

            });


        }
      ]);
});
