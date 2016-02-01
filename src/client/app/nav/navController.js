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

            $scope.getItemsByTag = function(tag){
                return Nav.getItemsByTag(tag);
            };

            $scope.dropdown = function(item) {
                var setupLinks = function() {
                    Users.taAcctCache = Users.item.transactionalAccount.data;
                    item.data = Users.taAcctCache;

                    console.log(item.data);

                    item.isExpanded = true;
                    item.dropdownIcon = 'icon-psw-disclosure_up_triangle';
                };


                if (!Users.taAcctCache) {
                    Users.taAcctCache = [];
                }

                if (!item.isExpanded) {
                    if (!Users.taAcctCache.length) {
                        Users.getLoggedInUserInfo().then(function(user) {
                            if (angular.isArray(Users.item._links.accounts)) {
                                Users.item._links.accounts = Users.item._links.accounts[0];
                            }
                            
                            // Plural within _embedded
                            Users.item.transactionalAccount.serviceName = 'transactionalAccounts';

                            Users.item.links.transactionalAccount().then(function(res) {
                                setupLinks();
                            });
                        });
                    } else {
                       setupLinks();
                    }
                } else {
                    item.isExpanded = false;
                    item.dropdownIcon = 'icon-psw-disclosure_down_triangle';
                }
            };

            $scope.switchAccount = function(child) {
                var i = 0,
                accts = Users.item.transactionalAccount.data;

                HATEAOSConfig.updateCurrentAccount(child.account);

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

            if($scope.items.length === 0){
                Nav.query(function(){
                    $scope.items = Nav.items;
                });
            }

            $scope.setActive = function(text){

            };
        }
    ]);
});
