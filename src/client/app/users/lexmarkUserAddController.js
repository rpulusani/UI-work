define(['angular', 'user'], function(angular) {
    'use strict';
    angular.module('mps.user')
    .controller('LexmarkUserAddController', ['$scope', '$location', '$translate', '$routeParams', 
        '$rootScope', 'UrlHelper', 'UserService', 'AccountService', 'Roles', '$q', 'UserAdminstration', 
        'LexmarkUser', 'AllAccounts', 'FormatterService', 'BlankCheck',
        function($scope, $location, $translate, $routeParams, $rootScope, UrlHelper, User, Account, Roles, $q, UserAdminstration, 
            LexmarkUser, AllAccounts, FormatterService, BlankCheck) {

            $scope.templateUrl = UrlHelper.user_template;
            $scope.userCreate = true;
            $scope.newUser = true;
            $scope.user = {};
            $scope.accountList = [];
            $scope.basicRoles = [];
            $scope.accounts = [];
            $scope.AssignedAccountList = [];
            $scope.user.accountName = '';
            var options = {
                params:{
                    embed:'roles,accounts'
                }
            };

            UserAdminstration.item.get(options).then(function(response){
                if (response.status === 200) {
                    $scope.newUser = false;
                    console.log('UserAdminstration.item', UserAdminstration.item);
                }
                $scope.user = UserAdminstration.item;
                $scope.user_info_active = true;
                $scope.account_access_active = false;
                $scope.userInfo = {};
                $scope.user.org = [];
                $scope.user.permissions = [];
                $scope.user.selectedRoleList = [];
                $scope.userActive = false;
                $scope.showAllAccounts = true;

                if ($scope.user.active === true) {
                    $scope.userActive = true;
                } else if ($scope.user.item &&  $scope.user.item.active === true) {
                    $scope.userActive = true;
                }

                if ($scope.user && $scope.user.address) {
                    $scope.formattedUserAddress = FormatterService.formatAddress($scope.user.address);
                }

                if ($scope.user && $scope.user.firstName && $scope.user.lastName) {
                    $scope.user.fullName = $scope.user.firstName + ' ' + $scope.user.lastName;
                    $scope.formattedUserContact = FormatterService.formatContact($scope.user);
                }

                if ($scope.newUser === false) {
                    if (!BlankCheck.isNull($scope.user.item._embedded.roles)) {
                        $scope.user.selectedRoleList = $scope.user.item._embedded.roles;
                    }
                    if (!BlankCheck.isNull($scope.user.item._embedded.accounts)) {
                        $scope.accounts = $scope.user.item._embedded.accounts;
                        console.log('$scope.accounts before', $scope.accounts);
                        if ($scope.accounts.length > 0) {
                            for (var i=0;i<$scope.accounts.length;i++) {
                                $scope.accounts[i].name = $scope.accounts[i].name + ' [' + $scope.accounts[i].accountId +']';
                                console.log('$scope.accounts[i]', $scope.accounts[i]);
                                if ($scope.accounts[i].country) {
                                    $scope.accounts[i].name  = $scope.accounts[i].name + ' [' + $scope.accounts[i].country +']';
                                }
                                $scope.accounts[i]._links = {
                                    self: {
                                        href: {}
                                    }
                                };
                                if (angular.isArray($scope.user.item._links.accounts)) {
                                    $scope.accounts[i]._links.self.href = $scope.user.item._links.accounts[i].href;
                                } else {
                                    $scope.accounts[i]._links.self.href = $scope.user.item._links.accounts.href;
                                }
                            }
                        }
                        console.log('$scope.accounts after', $scope.accounts);
                    }
                }

                User.getLoggedInUserInfo().then(function() {
                    console.log('User.item', User.item);
                    if (User.item._links.accounts) {
                        $scope.showAllAccounts = false;
                        if (angular.isArray(User.item._links.accounts)) {
                            for (var i=0; i<User.item._links.accounts.length; i++) {
                                $scope.accountList.push(User.item.accounts[i]);
                            }
                        } else {
                            if ($scope.accountList.length === 0) {
                                $scope.accountList.push(User.item.accounts[0]);
                            }
                        }
                    }
                });
                
                $scope.user.addonRoles = [];
                var removeParams,
                addonRoleOptions = {
                    'params': {
                        customerType: 'lexmark',
                        roleType: 'addon'
                    }
                },
                permissionPromiseList = [];

                Roles.get(addonRoleOptions).then(function() {
                    if(Roles.data) {
                        var roleList = Roles.data;
                        for (var j=0; j<roleList.length; j++) {
                            var role = roleList[j];
                            if($scope.user.addonRoles.length < roleList.length) {
                                role.selected = false;
                                if ($scope.user.selectedRoleList && $scope.user.selectedRoleList.length > 0) {
                                    for (var i=0;i<$scope.user.selectedRoleList.length;i++) {
                                        if ($scope.user.selectedRoleList[i].roleId === role.roleId) {
                                            Roles.setItem(role);
                                            role.selected = true;
                                            var options = {
                                                params:{
                                                    'applicationName': 'customerPortal'
                                                }
                                            };
                                            var permissionPromise = Roles.item.get(options);
                                            permissionPromiseList.push(permissionPromise);
                                        }
                                    }
                                }
                                $scope.user.addonRoles.push(role); 
                            }
                        }
                        $q.all(permissionPromiseList).then(function(response) {
                            for (var i=0;i<permissionPromiseList.length;i++) {
                                if (response[i] && response[i].data && response[i].data.permissions) {
                                    for (var j=0; j<response[i].data.permissions.length; j++) {
                                        if ($scope.user.permissions.indexOf(response[i].data.permissions[j]) === -1) {
                                            $scope.user.permissions.push(response[i].data.permissions[j]);
                                        }
                                    }
                                }
                            }
                        });
                    }
                });
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
                UserAdminstration.addField('type', 'INTERNAL');
                UserAdminstration.addField('active', $scope.user.item.active);
                UserAdminstration.addField('firstName', $scope.user.firstName);
                UserAdminstration.addField('lastName', $scope.user.lastName);
                UserAdminstration.addField('email', $scope.user.email);
                UserAdminstration.addField('userId', $scope.user.email);
                if ($scope.user.workPhone) {
                    UserAdminstration.addField('workPhone', $scope.user.workPhone);
                }
                
                if ($scope.user.address) {
                    var addressInfo = {
                        addressLine1: $scope.user.address.addressLine1,
                        addressLine2: $scope.user.address.addressLine2,
                        city: $scope.user.address.city,
                        stateCode: $scope.user.address.stateCode,
                        country: $scope.user.address.country,
                        postalCode: $scope.user.address.postalCode
                    };
                }
                
                UserAdminstration.addField('address', addressInfo);
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

            var updateAdminObjectForUpdate = function(updateStatus) {
                UserAdminstration.reset();
                UserAdminstration.newMessage();
                $scope.userInfo = UserAdminstration.item;
                UserAdminstration.addField('ldapId', $scope.user.ldapId);
                UserAdminstration.addField('contactId', $scope.user.contactId);
                UserAdminstration.addField('idpId', $scope.user.idpId);
                UserAdminstration.addField('type', 'INTERNAL');
                UserAdminstration.addField('active', $scope.user.item.active);
                if (updateStatus && updateStatus === 'deactivate') {
                    UserAdminstration.addField('active', false);
                } else {
                    UserAdminstration.addField('active', true);
                }
                UserAdminstration.addField('firstName', $scope.user.firstName);
                UserAdminstration.addField('lastName', $scope.user.lastName);
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
                for (var i=0;i<$scope.user.basicRoles.length; i++) {
                    for (var j=0; j<$scope.user.selectedRoleList.length; j++) {
                        var selectedRole = $scope.user.selectedRoleList[j];
                        if ($scope.user.basicRoles[i].description === selectedRole.description) {
                            $scope.user.selectedRoleList.splice(j,1);
                        }
                    }
                }

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

            $scope.update = function() {
                updateAdminObjectForUpdate();
                UserAdminstration.item.postURL = UserAdminstration.url + '/' + $scope.userInfo.userId;
                var options = {
                    preventDefaultParams: true
                }
                var deferred = UserAdminstration.put({
                    item:  $scope.userInfo
                }, options);

                deferred.then(function(result){
                    $location.path('/delegated_admin/lexmark_user');
                }, function(reason){
                    NREUM.noticeError('Failed to update user because: ' + reason);
                });
            };

            $scope.save = function() {
                updateAdminObjectForSubmit();
                UserAdminstration.item.postURL = UserAdminstration.url;
                var deferred = UserAdminstration.post({
                    item:  $scope.userInfo
                });

                deferred.then(function(result){
                    $location.path('/delegated_admin/lexmark_user');
                }, function(reason){
                    NREUM.noticeError('Failed to create SR because: ' + reason);
                });
            };

            $scope.deactivate = function() {
                updateAdminObjectForUpdate('deactivate');
                UserAdminstration.item.postURL = UserAdminstration.url + '/' + $scope.userInfo.userId;
                var options = {
                    preventDefaultParams: true
                }
                var deferred = UserAdminstration.put({
                    item:  $scope.userInfo
                }, options);

                deferred.then(function(result){
                    $location.path('/delegated_admin/lexmark_user');
                }, function(reason){
                    NREUM.noticeError('Failed to update user because: ' + reason);
                });
            };

            $scope.saveLexmarkUser = function() {
                if ($scope.newUser === true) {
                    $scope.save();
                } else {
                    $scope.update();
                }
            }

            $scope.setUserInfo = function() {
                $scope.user_info_active = true;
                $scope.account_access_active = false;
            };

            $scope.setAccountAccess = function() {
                $scope.user_info_active = false;
                $scope.account_access_active = true;
            };
        }
    ]);
});
