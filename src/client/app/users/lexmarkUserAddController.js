define(['angular', 'user'], function(angular) {
    'use strict';
    angular.module('mps.user')
    .controller('LexmarkUserAddController', ['$scope', '$location', '$translate', '$routeParams', 
        '$rootScope', 'UrlHelper', 'UserService', 'AccountService', 'Roles', '$q', 'UserAdminstration', 'AllAccounts',
        function($scope, $location, $translate, $routeParams, $rootScope, UrlHelper, User, Account, Roles, $q, UserAdminstration,
            AllAccounts) {

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
            $scope.AssignedAccountList = [];
            $scope.accounts = [];
            $scope.totalDisplayed = 20;
            $scope.accountCount = 'None';
            var removeParams,
            addonRoleOptions = {
                'params': {
                    customerType: 'lexmark',
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

            $scope.setAccounts = function() {
                $scope.$broadcast('searchAccount');
            };

            $scope.$on('searchAccount', function(evt){
                if($scope.accountName && $scope.accountName.length >=3) {
                    var options = {
                        preventDefaultParams: true,
                        params:{
                            searchTerm: $scope.accountName
                        }
                    };
                    AllAccounts.get(options).then(function(){
                        if (AllAccounts.item._embedded && AllAccounts.item._embedded.accounts) {
                            $scope.accountList = [];
                            var allAccountList = AllAccounts.item._embedded.accounts;
                            for (var i=0; i<allAccountList.length; i++) {
                                $scope.accountList.push(allAccountList[i]);
                            }
                        }
                    });
                }
            });

            $scope.$watch('accounts', function(accounts){
                if (accounts && accounts.length > 0) {
                    $scope.accountCount = accounts.length;
                }
            });

            $scope.setPermissions = function(role){
                Roles.setItem(role);
                var options = {
                    params:{
                        'applicationName': 'lexmark'
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
                        'applicationName': 'lexmark'
                    }
                }, promises = [];

                promises.push(Roles.item.get(options));

                for (var i=0;i<$scope.user.basicRoles.length; i++) {
                    if ($scope.basicRole 
                        && $scope.user.basicRoles[i].roleId.toString() === $scope.basicRole.toString()) {
                        Roles.setItem($scope.user.basicRoles[i]);
                        var options = {
                            params:{
                                'applicationName': 'lexmark'
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
