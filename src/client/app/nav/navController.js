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
        function(
            $scope,
            $rootScope,
            $location,
            $route,
            Nav,
            Users,
            Accounts
            ) {

            $scope.items = Nav.items;
            $scope.tags = Nav.getTags();
            $scope.$route = $route;

            $scope.getItemsByTag = function(tag){
                return Nav.getItemsByTag(tag);
            };

            $scope.dropdown = function(item) {
                if (!item.isExpanded) {
                    Users.getLoggedInUserInfo().then(function(user) {
                        if (angular.isArray(Users.item._links.accounts)) {
                            Users.item._links.accounts = Users.item._links.accounts[0];
                        }
                        
                        // Plural within _embedded
                        Users.item.transactionalAccount.serviceName = 'transactionalAccounts';

                        Users.item.links.transactionalAccount().then(function(res) {
                            item.data = Users.item.transactionalAccount.data;

                            item.isExpanded = true;
                            item.dropdownIcon = 'icon-psw-disclosure_up_triangle';
                        });
                    });
                } else {
                    item.isExpanded = false;
                    item.dropdownIcon = 'icon-psw-disclosure_down_triangle';
                }
            };

            $scope.switchAccount = function(child) {
                Users.item._links.accounts = child._links.account;
            }

            $scope.isActive = function(item){
                var passed = false;
                if(!item){
                    return undefined;
                }
                if($location.path() === item.action || $route.current.activeItem === item.action){
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
