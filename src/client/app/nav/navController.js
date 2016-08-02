'use strict';
 angular.module('mps.nav')
.controller('NavController', ['$scope',
    '$rootScope',
    '$location',
    '$route',
    'Nav',
    'UserService',
    'AccountService',
    'Addresses',
    'HATEAOSConfig',
    '$cookies',
    '$http',
    '$window',
    '$timeout',
    'SecurityService',
    'SecurityHelper',
    'DTMUpdater',
    function(
        $scope,
        $rootScope,
        $location,
        $route,
        Nav,
        Users,
        Accounts,
        Addresses,
        HATEAOSConfig,
        $cookies,
        $http,
        $window,
        $timeout,
        SecurityService,
        SecurityHelper,
        DTMUpdater
        ) {

        var Security = new SecurityService();
        var $ = require('jquery');

        $scope.items = Nav.items;
        $scope.tags = Nav.getTags();
        $scope.$route = $route;
        $scope.selectedAccount = $rootScope.currentAccount;
        $scope.dropdownItem = null;
        $scope.isInternal = false;
        $scope.userDisplayName = "";

        $rootScope.currentUser.deferred.promise.then(function() {
            if ($rootScope.currentUser.type === 'INTERNAL') {
                $scope.isInternal = true;
            }
        });
        
        if($rootScope.idpUser && $rootScope.idpUser.$promise) {
            $rootScope.idpUser.$promise.then(function() {
                if($rootScope.idpUser.custom_attributes) {
                    var custom_attr = $rootScope.idpUser.custom_attributes;
                    if(custom_attr.display_name) {
                        $scope.userDisplayName = custom_attr.display_name;
                    } else if(custom_attr.first_name && custom_attr.last_name) {
                        $scope.userDisplayName = custom_attr.first_name + ' ' + custom_attr.last_name;
                    } else if(custom_attr.first_name) {
                        $scope.userDisplayName = custom_attr.first_name;
                    } else if(custom_attr.last_name) {
                        $scope.userDisplayName = custom_attr.last_name;
                    }
                }
                else {
                    $scope.userDisplayName = $rootScope.idpUser.email;
                }
            });
        }

        $scope.removeImpersonate = function() {
            var impersonateURL = $cookies['impersonateUrl'];
            delete $cookies['impersonateToken'];
            delete $cookies['impersonateUrl'];
            $window.location.href = impersonateURL;
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
            $timeout(function(){
                resizeSiteContent();
            },10);
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
            Users.createItem(child);

            HATEAOSConfig.updateCurrentAccount(child.account);

            $rootScope.currentAccount.refresh = true;

            $scope.acctSelected = true;

            $rootScope.$emit('toggleAccountNav');
            HATEAOSConfig.getCurrentAccount().then(function() {
                var i = 0,
                accts = Users.item.transactionalAccount.data;

                Users.item._links.accounts = child._links.account;

                for (i; i < accts.length; i += 1) {
                    if (accts[i]._links.account.href === Users.item._links.accounts.href) {
                        if (!accts[i].isActive) {
                            accts[i].isActive = true;
                        } else {
                            accts[i].isActive = false;
                            $rootScope.currentAccount = angular.copy($rootScope.defaultAccount);
                            $rootScope.currentAccount.refresh = true;
                        }
                    } else {
                        accts[i].isActive = false;
                    }
                }

                i = 0;

                $scope.selectedAccount = $rootScope.currentAccount;
                $scope.selectedAccount.isDefault = false;
                Security.getPermissions($rootScope.currentUser).then(function(permissions) {
                    Security.setWorkingPermission(permissions);

                    new SecurityHelper($rootScope).setupPermissionList($rootScope.configurePermissions);

                    setTimeout(function() {
                        for (i; i < $scope.items.length; i += 1) {
                            $scope.items[i].permissionFlag = $rootScope[$scope.items[i].permission];
                        }

                        $route.reload();
                        DTMUpdater.update($rootScope.currentUser, $rootScope.globalAccount, Addresses);
                    }, 0);
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

        $scope.defaultExpanded = function(item){
            if(item.dropdown){
                var dropdownTags = {};
                var ind = 0;
                var tagsCnt = 0;
                var tagItem = "";
                dropdownTags = $scope.getItemsByTag(item.id);
                if(dropdownTags.length > 0){
                    tagsCnt = dropdownTags.length;
                    for (ind=0; ind<tagsCnt; ind++){
                        tagItem = dropdownTags[ind];
                        
                        if($location.path() === tagItem.action || 
                            $route.current.activeItem === tagItem.action){
                            $scope.dropdownNonAccount(item);
                            return true;
                        }
                    }
                }
            }
            return false;
        };

        $scope.goToAccountPicker = function(param) {
            var i = 0,
            accts = Users.item.transactionalAccount.data;

            for (i; i < accts.length; i += 1) {
                accts[i].isActive = false;
            }
            $rootScope.currentAccount = undefined;
         
            $rootScope.currentUser.permissions.params = {};
         

                $scope.selectedAccount = {};
                $scope.selectedAccount.isDefault = true;
                i = 0;
                Security.getPermissions($rootScope.currentUser).then(function(permissions) {
                    Security.setWorkingPermission(permissions);

                    new SecurityHelper($rootScope).setupPermissionList($rootScope.configurePermissions);

                    if(param)
                    {
                        $rootScope.accountReturnPath = $location.path();
                        setTimeout(function() {
                            for (i; i < $scope.items.length; i += 1) {
                                $scope.items[i].permissionFlag = $rootScope[$scope.items[i].permission];
                            }

                        }, 0);

                        $location.path('/accounts/pick_account/Account');
                    }
                    else
                    {
                        setTimeout(function() {
                            for (i; i < $scope.items.length; i += 1) {
                                $scope.items[i].permissionFlag = $rootScope[$scope.items[i].permission];
                            }

                            $route.reload();
                        }, 0);
                    }
                });
           
        };        

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
            if($scope.dropdownItem){
                $scope.dropdownItem.isExpanded = false;
            }
        });

        $scope.currentYear = new Date().getFullYear();

        $scope.setActive = function(text){

        };

        $rootScope.$on('$routeChangeSuccess', function(scope, next, current) {
            if (current) {
                if (next.loadedTemplateUrl && (!$rootScope.lastCheckedRoute || $rootScope.lastCheckedRoute !== next.loadedTemplateUrl)) {
                    DTMUpdater.update();
                    $rootScope.lastCheckedRoute = next.loadedTemplateUrl;
                }
            }
        });
        
        //ensuring the site content area is always as big as possible while supporting autoscroll
        if (!$rootScope.windowResized) {
            resizeSiteContent();
            $rootScope.windowResized = true;
        }
        function resizeSiteContent(){
            if($(window).width() > 767){ // Resize only when opened to tablet (landscape) and desktop.
                var windowHeight = $(window).height();
                var headerHeight = angular.element('.site-header').outerHeight();
                var navHeight = angular.element('.rail-nav').outerHeight();
                var contentHeight = ((windowHeight - headerHeight) <= navHeight) ? navHeight : (windowHeight - headerHeight);
                angular.element('.site-content').css('height', contentHeight + 'px');
                if(!navHeight){
                    $timeout(function(){
                        resizeSiteContent();
                    },5000);
                }
            }
        }
        $(window).resize(function(){
            resizeSiteContent();
        });
    }
]);

