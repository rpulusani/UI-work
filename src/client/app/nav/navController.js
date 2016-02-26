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
        '$cookies',
        '$http',
        '$window',
        'SecurityService',
        'SecurityHelper',
        function(
            $scope,
            $rootScope,
            $location,
            $route,
            Nav,
            Users,
            Accounts,
            HATEAOSConfig,
            $cookies,
            $http,
            $window,
            SecurityService,
            SecurityHelper
            ) {

            var Security = new SecurityService();

            $scope.items = Nav.items;
            $scope.tags = Nav.getTags();
            $scope.$route = $route;
            $scope.selectedAccount = $rootScope.currentAccount;
            $scope.dropdownItem = null;
            $scope.isInternal = false;

            $rootScope.currentUser.deferred.promise.then(function() {
                if ($rootScope.currentUser.type === 'INTERNAL') {
                    $scope.isInternal = true;
                }
            });

            $scope.removeImpersonate = function() {
                delete $cookies['impersonateToken'];
                $window.location.reload();
            };

            $scope.getItemsByTag = function(tag){
                return Nav.getItemsByTag(tag);
            };

            $scope.dropdown = function(item) {
                var setupLinks = function() {
                    var defaultCnt = 5,
                    i = 0;

                    item.data = [];
                    
                    if (Users.item.transactionalAccount.data.length < defaultCnt) {
                        defaultCnt = Users.item.transactionalAccount.data.length;
                    }

                    for (i; i < defaultCnt; i += 1) {
                        item.data[i] = Users.item.transactionalAccount.data[i];
                    }

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

            $scope.dropdownNonAccount = function(item) {
                var setupLinks = function() {
                    item.isExpanded = true;
                    item.dropdownIcon = 'icon-psw-disclosure_up_triangle';
                };

                if (!item.isExpanded) {
                    setupLinks();
                } else {
                    item.isExpanded = false;
                    item.dropdownIcon = 'icon-psw-disclosure_down_triangle';
                }
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
                                $rootScope.currentAccount.refresh = true;
                                console.log('resetting', $rootScope.currentAccount);
                            }
                        } else {
                            accts[i].isActive = false;
                        }
                    }

                    $scope.selectedAccount = $rootScope.currentAccount;

                    Security.getPermissions($rootScope.currentUser).then(function(permissions) {
                        Security.setWorkingPermission(permissions);
                        
                        new SecurityHelper($rootScope).setupPermissionList($rootScope.configurePermissions);
                        
                        $route.reload();
                    });
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
                var i = 0,
                accts = Users.item.transactionalAccount.data;

                for (i; i < accts.length; i += 1) {
                    accts[i].isActive = false;
                }
                
                $rootScope.currentAccount = angular.copy($rootScope.defaultAccount);
                $scope.selectedAccount = $rootScope.currentAccount;

                console.log('resetting', $rootScope.currentAccount);

                $rootScope.accountReturnPath = $location.path();
                $location.path('/accounts/pick_account/Account');
            }

            if ($scope.items.length === 0) {
                Nav.query(function(){
                    $scope.items = Nav.items;
                });
            }

            $rootScope.$on('userSetup', function(e, res) {
                $scope.accountTotal = {total: res.length};
            });

            $rootScope.$on('refreshNav', function(e, res) {
                $scope.selectedAccount = $rootScope.currentAccount;
            });

            $rootScope.$on('toggleAccountNav', function(e, res) {
                $scope.dropdownItem.isExpanded = false;
            });

            $scope.currentYear = new Date().getFullYear();

            $scope.setActive = function(text){

            };
        }
    ]);
});
