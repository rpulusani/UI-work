define(['angular', 'user'], function(angular) {
    'use strict';
    angular.module('mps.user')
    .controller('UserAddController', ['$scope', '$location', '$translate', '$routeParams', 
        '$rootScope', 'UrlHelper', 'UserService', 'AccountService', 'Roles', '$q', 'UserAdminstration', 'AllAccounts',
        function($scope, $location, $translate, $routeParams, $rootScope, UrlHelper, User, Account, Roles, $q, UserAdminstration, AllAccounts) {

            $scope.templateUrl = UrlHelper.user_template;
            
            $scope.user_info_active = true;
            $scope.account_access_active = false;
            $scope.user = {};
            $scope.userInfo = {};
            $scope.user.org = [];
            $scope.accountList = [];
            $scope.basicRoles = [];
            $scope.user.basicRoles = [];
            $scope.user.addonRoles = [];
            $scope.user.permissions = [];
            $scope.user.selectedRoleList = [];
            $scope.accounts = [];
            $scope.showAllAccounts = true;
            $scope.languageOptions = [
                {name: $translate.instant('LANGUAGES.ARABIC'), code:  'ar_XM'},
                {name: $translate.instant('LANGUAGES.BULGARIAN'), code:  'bg_BG'},
                {name: $translate.instant('LANGUAGES.CHINESE_SIMPLIFIED'), code:  'zh_CN'},
                {name: $translate.instant('LANGUAGES.CHINESE_TRADITIONAL'), code:  'zh_TW'},
                {name: $translate.instant('LANGUAGES.CROATIAN'), code:  'hr_HR'},
                {name: $translate.instant('LANGUAGES.CZECH'), code:  'cs_CZ'},
                {name: $translate.instant('LANGUAGES.DANISH'), code:  'da_DK'},
                {name: $translate.instant('LANGUAGES.DUTCH'), code:  'nl_NL'},
                {name: $translate.instant('LANGUAGES.ENGLISH'), code:  'en_GB'},
                {name: $translate.instant('LANGUAGES.ENGLISH_UK'), code:  'en_GB'},
                {name: $translate.instant('LANGUAGES.ENGLISH_US'), code:  'en_US'},
                {name: $translate.instant('LANGUAGES.FINNISH'), code:  'fi_FI'},
                {name: $translate.instant('LANGUAGES.FRENCH'), code:  'fr_FR'},
                {name: $translate.instant('LANGUAGES.FRENCH_CA'), code:  'fr_CA'},
                {name: $translate.instant('LANGUAGES.GERMAN'), code:  'de_DE'},
                {name: $translate.instant('LANGUAGES.GREEK'), code:  'el_GR'},
                {name: $translate.instant('LANGUAGES.HUNGARIAN'), code:  'hu_HU'},
                {name: $translate.instant('LANGUAGES.ITALIAN'), code:  'it_IT'},
                {name: $translate.instant('LANGUAGES.JAPANESE'), code:  'ja_JP'},
                {name: $translate.instant('LANGUAGES.KOREAN'), code:  'ko_KR'},
                {name: $translate.instant('LANGUAGES.NORWEGIAN'), code:  'no_NO'},
                {name: $translate.instant('LANGUAGES.POLISH'), code:  'pl_PL'},
                {name: $translate.instant('LANGUAGES.PORTUGUESE_BRAZIL'), code:  'pt_BR'},
                {name: $translate.instant('LANGUAGES.PORTUGUESE_PORTUGAL'), code:  'pt_PT'},
                {name: $translate.instant('LANGUAGES.ROMANIAN'), code:  'ro_RO'},
                {name: $translate.instant('LANGUAGES.RUSSIAN'), code:  'ru_RU'},
                {name: $translate.instant('LANGUAGES.SPANISH_SPAIN'), code:  'es_ES'},
                {name: $translate.instant('LANGUAGES.SPANISH_MEXICO'), code:  'es_MX'},
                {name: $translate.instant('LANGUAGES.SWEDISH'), code:  'sv_SE'},
                {name: $translate.instant('LANGUAGES.TURKISH'), code:  'tr_TR'},
                {name: $translate.instant('LANGUAGES.SLOVAK'), code:  'sk_SK'}
            ];
            var removeParams,
            addonRoleOptions = {
                'params': {
                    customerType: 'customer',
                    roleType: 'addon'
                }
            };

            Roles.get(addonRoleOptions).then(function() {
                if(Roles.data) {
                    var roleList = Roles.data;
                    for (var j=0; j<roleList.length; j++) {
                        var role = roleList[j];
                        if($scope.user.addonRoles.length < roleList.length) {
                            role.selected = false;
                            $scope.user.addonRoles.push(role); 
                        }
                    }
                }
            });
            
            User.getLoggedInUserInfo().then(function() {
                if (User.item._links.accounts) {
                    $scope.showAllAccounts = false;
                    if (angular.isArray(User.item._links.accounts)) {
                        var promises = [],
                        options = {},
                        promise, deferred;
                        for (var i=0; i<User.item._links.accounts.length; i++) {
                            var item = User.item.accounts[i];
                            item._links = {
                                self: {}
                            };
                            item._links.self = User.item._links.accounts[i];
                            deferred = $q.defer();
                            Account.setItem(item);
                            options = {
                                updateParams: false,
                                params:{
                                    accountId: Account.item.accountId,
                                    accountLevel: Account.item.level
                                }
                            };
                            promise = Account.item.get(options);
                            promises.push(promise);
                        }
                        var prLength = promises.length;
                        $q.all(promises).then(function(response) {
                            for (var j=0; j<response.length; j++) {
                                if($scope.accountList.length < prLength && response[j] && response[j].data) {
                                    $scope.accountList.push(response[j].data);
                                }
                            }
                        });
                    } else {
                        User.getAdditional(User.item, Account).then(function() {
                            if ($scope.accountList.length === 0) {
                                $scope.accountList.push(Account.item);
                            }
                        });
                    }
                }
            });

            $scope.setAccounts = function() {
                $scope.$broadcast('searchAccount');
            };

            $scope.removeAccount = function(item) {
                if ($scope.accounts && $scope.accounts.length > 0) {
                    for (var j=0;j<$scope.accounts.length; j++) {
                        if ($scope.accounts[j].accountId 
                            && $scope.accounts[j].accountId === item.accountId
                            && $scope.accounts[j].level === item.level
                            && $scope.accounts[j].name === item.name) {
                            $scope.accounts.splice(j, 1);
                        }
                    }
                }
                $scope.$broadcast('searchAccount');
            };

            $scope.$on('searchAccount', function(evt){
                $scope.accountList = [];
                if($scope.user.accountName && $scope.user.accountName.length >=3) {
                    var options = {
                        preventDefaultParams: true,
                        params:{    
                            searchTerm: $scope.user.accountName
                        }
                    };
                    AllAccounts.get(options).then(function(){
                        $scope.accountList = [];
                        if (AllAccounts.item._embedded && AllAccounts.item._embedded.accounts) {
                            var allAccountList = AllAccounts.item._embedded.accounts;
                            for (var i=0; i<allAccountList.length; i++) {
                                $scope.accountList.push(allAccountList[i]);
                            }
                        }
                    });
                }
            });

            $scope.setPermissions = function(role){
                Roles.setItem(role);
                var options = {
                    params:{
                        'applicationName': 'customerPortal'
                    }
                };

                Roles.item.get(options).then(function(){
                    if (Roles.item && Roles.item.permissions) {
                        for (var i=0; i<Roles.item.permissions.length; i++) {
                            if (role.selected && $scope.user.permissions.indexOf(Roles.item.permissions[i]) === -1) {
                                $scope.user.permissions.push(Roles.item.permissions[i]);
                            } else if ($scope.user.permissions && $scope.user.permissions.indexOf(Roles.item.permissions[i])!== -1) {
                                $scope.user.permissions.splice($scope.user.permissions.indexOf(Roles.item.permissions[i]), 1);
                            }
                        }
                    }
                    if (Roles.item && role.selected) {
                        $scope.user.selectedRoleList.push(role);
                    } else if ($scope.user.selectedRoleList && $scope.user.selectedRoleList.indexOf(role) !== -1) {
                        $scope.user.selectedRoleList.splice($scope.user.selectedRoleList.indexOf(role), 1);
                    }
                });
            };

            $scope.setPermissionsForBasic = function(role){
                Roles.setItem(role);
                var options = {
                    params:{
                        'applicationName': 'customerPortal'
                    }
                }, promises = [];

                promises.push(Roles.item.get(options));

                for (var i=0;i<$scope.user.basicRoles.length; i++) {
                    if ($scope.basicRole 
                        && $scope.user.basicRoles[i].roleId.toString() === $scope.basicRole.toString()) {
                        Roles.setItem($scope.user.basicRoles[i]);
                        var options = {
                            params:{
                                'applicationName': 'customerPortal'
                            }
                        };
                        promises.push(Roles.item.get(options));
                    }
                }
                
                $q.all(promises).then(function(response) {
                    if(response[1] && response[1].data && response[1].data.permissions) {
                        var permissionList = response[1].data.permissions;
                        for (var i=0; i<permissionList.length; i++) {
                            if ($scope.user.permissions && $scope.user.permissions.indexOf(permissionList[i])!== -1) {
                                $scope.user.permissions.splice($scope.user.permissions.indexOf(permissionList[i]), 1);
                            }
                        }
                    }

                    if(response[0] && response[0].data && response[0].data.permissions) {
                        var permissionList = response[0].data.permissions;
                        for (var i=0; i<permissionList.length; i++) {
                            if ($scope.user.permissions.indexOf(permissionList[i]) === -1) {
                                $scope.user.permissions.push(permissionList[i]);
                            }
                        }
                    }
                });
            };

            var updateAdminObjectForSubmit = function() {
                if ($location.path() === "/delegated_admin/invite_user") {
                    if ($scope.user.emails) {
                        $scope.userInfoList = [];
                        var emailList = $scope.user.emails.split(',');
                        for (var i=0;i<emailList.length;i++) {
                            UserAdminstration.newMessage();
                            $scope.userInfoList[i] = UserAdminstration.item;
                            UserAdminstration.addField('type', 'INVITED');
                            UserAdminstration.addField('invitedStatus', 'INVITED');
                            UserAdminstration.addField('active', false);
                            UserAdminstration.addField('resetPassword', false);
                            UserAdminstration.addField('email', emailList[i]);
                            UserAdminstration.addField('userId', emailList[i]);

                            for (var i=0;i<$scope.user.basicRoles.length; i++) {
                                if ($scope.basicRole 
                                    && $scope.user.basicRoles[i].description === $scope.basicRole) {
                                    $scope.user.selectedRoleList.push($scope.user.basicRoles[i]);
                                }
                            }
                            if ($scope.user.selectedRoleList) {
                                UserAdminstration.addMultipleRelationship('roles', $scope.user.selectedRoleList, 'self');
                            }

                            if ($scope.accounts && $scope.accounts.length > 0) {
                                UserAdminstration.addMultipleRelationship('accounts', $scope.accounts, 'self');
                            }
                        }
                    }
                } else {
                    UserAdminstration.newMessage();
                    $scope.userInfo = UserAdminstration.item;
                    UserAdminstration.addField('type', 'BUSINESS_PARTNER');
                    UserAdminstration.addField('active', true);
                    UserAdminstration.addField('firstName', $scope.user.firstName);
                    UserAdminstration.addField('lastName', $scope.user.lastName);
                    UserAdminstration.addField('password', $scope.user.password);
                    UserAdminstration.addField('email', $scope.user.email);
                    UserAdminstration.addField('userId', $scope.user.email);
                    UserAdminstration.addField('workPhone', $scope.user.workPhone);
                    var addressInfo = {
                        addressLine1: $scope.user.address.addressLine1,
                        addressLine2: $scope.user.address.addressLine2,
                        city: $scope.user.address.city,
                        stateCode: $scope.user.address.stateCode,
                        country: $scope.user.address.country,
                        postalCode: $scope.user.address.postalCode
                    };
                    UserAdminstration.addField('address', addressInfo);
                    UserAdminstration.addField('preferredLanguage', 'en_US');
                    UserAdminstration.addField('resetPassword', true);
                    for (var i=0;i<$scope.user.basicRoles.length; i++) {
                        if ($scope.basicRole 
                            && $scope.user.basicRoles[i].description === $scope.basicRole) {
                            $scope.user.selectedRoleList.push($scope.user.basicRoles[i]);
                        }
                    }
                    if ($scope.user.selectedRoleList) {
                        UserAdminstration.addMultipleRelationship('roles', $scope.user.selectedRoleList, 'self');
                    }

                    if ($scope.accounts && $scope.accounts.length > 0) {
                        UserAdminstration.addMultipleRelationship('accounts', $scope.accounts, 'self');
                    }
                }
            };

            $scope.setUserInfo = function() {
                $scope.user_info_active = true;
                $scope.account_access_active = false;
            };

            $scope.setAccountAccess = function() {
                $scope.user_info_active = false;
                $scope.account_access_active = true;
            };

            $scope.save = function() {
                updateAdminObjectForSubmit();
                UserAdminstration.item.postURL = UserAdminstration.url;
                var deferred = UserAdminstration.post({
                    item:  $scope.userInfo
                });

                deferred.then(function(result){
                    UserAdminstration.wasInvited = false;
                    UserAdminstration.wasSaved = true;
                    $location.path('/delegated_admin');
                }, function(reason){
                    NREUM.noticeError('Failed to create SR because: ' + reason);
                });
            };

            $scope.invite = function() {
                updateAdminObjectForSubmit();
                UserAdminstration.item.postURL = UserAdminstration.url;
                var deferredList = [];
                if ($scope.userInfoList && $scope.userInfoList.length > 0) {
                    for (var i=0;i<$scope.userInfoList.length;i++) {
                        var deferred = UserAdminstration.post({
                            item:  $scope.userInfoList[i]
                        });
                        deferredList.push(deferred);
                    }
                }
                
                $q.all(deferredList).then(function(result) {
                    UserAdminstration.wasSaved = false;
                    UserAdminstration.wasInvited = true;
                    $location.path('/delegated_admin');
                }, function(reason){
                    NREUM.noticeError('Failed to create SR because: ' + reason);
                }); 
            };
        }
    ]);
});
