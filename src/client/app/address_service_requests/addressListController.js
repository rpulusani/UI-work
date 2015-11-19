define(['angular', 'address','account', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestAddresses')
    .controller('AddressListController', ['$scope', '$location', 'grid', 'Addresses', '$rootScope','$q',
        'PersonalizationServiceFactory', 'AccountService', 'UserService',
        function($scope,  $location,  Grid, Addresses, $rootScope, $q, Personalize, Account, User) {
            $rootScope.currentRowList = [];
            var personal = new Personalize($location.url(), $rootScope.idpUser.id);
            /* Actions */
            $scope.goToCreate = function() {
                Addresses.item = {};
                $location.path(Addresses.route + '/new');
            };

            $scope.goToUpdate = function() {
                var id = Grid.getCurrentEntityId($scope.currentRowList[0]);
                if(id !== null){
                    $location.path(Addresses.route + '/' + id + '/update');
                }
            };
            $scope.goToRemove = function(){
                var id = Grid.getCurrentEntityId($scope.currentRowList[0]);
                if(id !== null){
                    $location.path(Addresses.route + '/' + id + '/delete');
                }
            };
            /* grid Check Items   - should prototype*/
            $scope.isSingleSelected = function(){
                 if($scope.currentRowList.length === 1){
                    return true;
                 }else{
                    return false;
                 }
            };

            $scope.isMultipleSelected = function(){
                if($scope.currentRowList.length > 1){
                    return true;
                }else{
                    return false;
                }
            };

            /* grid configuration */
            $scope.gridOptions = {};
            $scope.gridOptions.onRegisterApi = Grid.getGridActions($rootScope, Addresses, personal);

            $rootScope.currentUser.deferred.promise.then(function(user) {
                user.item.data._links.accounts = user.item.data._links.accounts[0];

                User.getAdditional(user.item.data, Account).then(function() {
                    console.log(Account.item);
                    Account.getAdditional(Account.item, Addresses).then(function() {
                        console.log('Accounts worked')
                        Addresses.getPage().then(function() {
                            Grid.display(Addresses, $scope, personal);
                        }, function(reason) {
                            NREUM.noticeError('Grid Load Failed for ' + Addresses.serviceName +  ' reason: ' + reason);
                        });
                    });
                });
            });

            /*$rootScope.currentUser.deferred.promise.then(function(user){
                user.item.link.account().then(function() {
                    User.item.account.link.address().then(function() {
                        Grid.display(User.item.account.address.data);
                    });
                });
            });*/

            // $rootScope.currentUser.deferred.promise.then(function(user){
            //     User.getAdditional(user, Account).then(function(){
            //         console.log(Account);
            //         //Account.getAdditional(Account.data[0],Addresses).then(function(){
            //             //console.log(Addresses);
            //             Addresses.getPage().then(function(){
            //             //     Grid.display(Addresses, $scope, personal);
            //             // }, function(reason) {
            //             //     NREUM.noticeError('Grid Load Failed for ' + Addresses.serviceName +  ' reason: ' + reason);
            //             // });
            //         });
            //     });
            // });
        }
      ]);
});
