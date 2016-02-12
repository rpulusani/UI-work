define([
    'nav',
    'nav.navFactory'
], function(nav){

    'use strict';

    nav
    .controller('NavController', ['$scope',
        '$rootScope',
        '$location',
        '$route',
        'Nav',
        'UserService',
        'AccountService',
        'HATEAOSConfig',
        function(
            $scope,
            $rootScope,
            $location,
            $route,
            Nav,
            Users,
            Accounts,
            HATEAOSConfig
            ) {

            $scope.items = Nav.items;
            $scope.tags = Nav.getTags();
            $scope.$route = $route;
            $scope.selectedAccount = $rootScope.currentAccount;
            $scope.dropdownItem = null;

            $scope.getItemsByTag = function(tag){
                return Nav.getItemsByTag(tag);
            };

            $scope.dropdown = function(item) {
                var setupLinks = function() {
                    item.data = [];
                    item.data[0] = Users.item.transactionalAccount.data[0];
                    item.data[1] = Users.item.transactionalAccount.data[1];
                    item.data[2] = Users.item.transactionalAccount.data[2];
                    item.data[3] = Users.item.transactionalAccount.data[3];
                    item.data[4] = Users.item.transactionalAccount.data[4];

                    item.isExpanded = true;
                    item.dropdownIcon = 'icon-psw-disclosure_up_triangle';
                };

                if (!item.isExpanded) {
                    setupLinks();
                } else {
                    item.isExpanded = false;
                    item.dropdownIcon = 'icon-psw-disclosure_down_triangle';
                }

                  $scope.dropdownItem = item;
            };

            $scope.switchAccount = function(child) {
                var i = 0,
                accts = Users.item.transactionalAccount.data;

                Users.createItem(child);

                HATEAOSConfig.updateCurrentAccount(child.account);

                $rootScope.currentAccount.refresh = true;

                $scope.acctSelected = true;

                HATEAOSConfig.getCurrentAccount().then(function() {
                    Users.item._links.accounts = child._links.account;
                    
                    for (i; i < accts.length; i += 1) {
                        if (accts[i]._links.account.href === Users.item._links.accounts.href) {
                            if (!accts[i].isActive) {
                                accts[i].isActive = true;
                            } else {
                                accts[i].isActive = false;
                                $rootScope.currentAccount = angular.copy($rootScope.defaultAccount);
                            }
                        } else {
                            accts[i].isActive = false;
                        }
                    }

                    $scope.selectedAccount = $rootScope.currentAccount;

                    $route.reload();
                });
            };

            $scope.isActive = function(item){
                var passed = false;
                if(!item){
                    return undefined;
                }
                if($location.path() === item.action || $route.current.activeItem === item.action || item.isActive === true){
                    passed = true;
                    $rootScope.sectionTitle = item.text;
                }
                return passed;
            };

            $scope.goToAccountPicker = function() {
                $rootScope.accountReturnPath = window.location.href;
                $location.path('/accounts/pick_account/Account');
            }

            if ($scope.items.length === 0) {
                Nav.query(function(){
                    $scope.items = Nav.items;
                });
            }

            $rootScope.$on('userSetup', function(e, res) {
                $scope.accountTotal = {total: res.length};
                $scope.$apply();
            });

            $rootScope.$on('refreshNav', function(e, res) {
                $scope.selectedAccount = $rootScope.currentAccount;
            });

            $rootScope.$on('toggleAccountNav', function(e, res) {
                $scope.dropdownItem.isExpanded = false;
            });

            $scope.setActive = function(text){

            };
        }
    ]);
});
