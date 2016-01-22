define(['angular', 'user'], function(angular) {
    'use strict';
    angular.module('mps.user')
    .controller('ManageUserController', [
        '$rootScope',
        '$scope',
        '$location',
        '$routeParams',
        'BlankCheck',
        'UserAdminstration',
        'Roles',
        'AccountService',
        'UserService',
        'FormatterService',
        'PersonalizationServiceFactory',
        'SecurityHelper',
        '$q',
        function(
            $rootScope,
            $scope,
            $location,
            $routeParams,
            BlankCheck,
            UserAdminstration,
            Roles,
            Account,
            User,
            FormatterService,
            Personalize,
            SecurityHelper,
            $q
            ) {
            var redirect_to_list = function() {
               $location.path(UserAdminstration.route + '/');
            };

            if (UserAdminstration.item === null) {
                redirect_to_list();
            } else {
                $scope.user = UserAdminstration.item;
                $scope.user.org = [];
                $scope.accountList = [];
                $scope.basicRoles = [];
                $scope.user.basicRoles = [];
                $scope.user.addonRoles = [];
                $scope.user.permissions = [];
                $scope.user.selectedRoleList = [];
                $scope.userExistingRoles = [];
                $scope.selectedAccountList = [];
                $scope.accounts = [];

                if ($scope.user.item && $scope.user.item.address) {
                    $scope.user.address = $scope.user.item.address;
                }

                if (!BlankCheck.isNull($scope.user.item._embedded.roles)) {
                    $scope.userExistingRoles = $scope.user.item._embedded.roles;
                    for (var i=0;i<$scope.userExistingRoles.length;i++) {
                        $scope.user.selectedRoleList.push($scope.userExistingRoles[i]);
                    }
                }
                if (!BlankCheck.isNull($scope.user['accounts'])) {
                    $scope.accounts = $scope.user['accounts'];
                    if ($scope.accounts.length > 0) {
                        for (var i=0;i<$scope.accounts.length;i++) {
                            $scope.accounts[i]._links = {
                                self: {
                                    href: {}
                                }
                            };
                            $scope.accounts[i]._links.self.href = $scope.user._links.accounts.href;
                            $scope.selectedAccountList.push($scope.accounts[i]);
                        }
                    }
                }
                
                if ($scope.user && $scope.user.firstName && $scope.user.lastName) {
                    $scope.user.fullName = $scope.user.firstName + $scope.user.lastName;
                }

                var removeParams,
                basicRoleOptions =  {
                    'params': {
                        customerType: 'customer',
                        roleType: 'basic'
                    }
                },
                addonRoleOptions = {
                    'params': {
                        customerType: 'customer',
                        roleType: 'addon'
                    }
                }, 
                promise1 = Roles.get(basicRoleOptions),
                promise2 = Roles.get(addonRoleOptions),
                rolePromiseList = [promise1,promise2];

                
                $q.all(rolePromiseList).then(function(response) {
                    if(response[0] && response[0].data && response[0].data._embedded && response[0].data._embedded.roles) {
                        var roleList = response[0].data._embedded.roles;
                        for (var j=0; j<roleList.length; j++) {
                            var role = roleList[j];
                            if ($scope.user.basicRoles.length < roleList.length) {
                                if ($scope.userExistingRoles && $scope.userExistingRoles.length > 0) {
                                    for (var i=0;i<$scope.userExistingRoles.length;i++) {
                                        if ($scope.userExistingRoles[i].roleId === role.roleId) {
                                            $scope.user.selectedRoleList.push(role);
                                        }
                                    }
                                }
                                $scope.user.basicRoles.push(role); 
                            }
                        }
                    }
                
                    if(response[1] && response[1].data && response[1].data._embedded && response[1].data._embedded.roles) {
                        var roleList = response[1].data._embedded.roles;
                        for (var j=0; j<roleList.length; j++) {
                            var role = roleList[j];
                            if($scope.user.addonRoles.length < roleList.length) {
                                role.selected = false;
                                if ($scope.userExistingRoles && $scope.userExistingRoles.length > 0) {
                                    for (var i=0;i<$scope.userExistingRoles.length;i++) {
                                        if ($scope.userExistingRoles[i].roleId === role.roleId) {
                                            role.selected = true;
                                            $scope.setPermissions(role);
                                        }
                                    }
                                }
                                $scope.user.addonRoles.push(role); 
                            }
                        }
                    }
                });

                /*hardcoding roles until selectric solution*/
                $scope.user.basicRoles =[{"id"
                :1,"roleId":1,"description":"View Only - Operations","customerType":"customer","roleType":"basic"
                ,"_links":{"self":{"href"
                :"https://api.venus-dev.lexmark.com/mps/roles/1"}}},
                {"id":2,"roleId":2,"description":"View Only - Strategic"
                ,"customerType":"customer","roleType":"basic","_links":{"self":{"href"
                :"https://api.venus-dev.lexmark.com/mps/roles/2"}}}];
                
                User.getLoggedInUserInfo().then(function() {
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
                });

            }

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
                            if (role.selected) {
                                $scope.user.permissions.push(Roles.item.permissions[i]);
                            } else if ($scope.user.permissions && $scope.user.permissions.indexOf(Roles.item.permissions[i])!== -1) {
                                $scope.user.permissions.splice($scope.user.permissions.indexOf(Roles.item.permissions[i]), 1);
                            }
                        }
                    }
                    if (Roles.item && role.selected && $scope.user.selectedRoleList.indexOf(role) !== -1) {
                        $scope.user.selectedRoleList.push(role);
                    } else if ($scope.user.selectedRoleList && $scope.user.selectedRoleList.indexOf(role) !== -1) {
                        $scope.user.selectedRoleList.splice($scope.user.selectedRoleList.indexOf(role), 1);
                    }
                });
            };

            var updateAdminObjectForUpdate = function() {
                UserAdminstration.reset();
                UserAdminstration.newMessage();
                $scope.userInfo = UserAdminstration.item;
                UserAdminstration.addField('type', 'BUSINESS_PARTNER');
                UserAdminstration.addField('active', true);
                UserAdminstration.addField('firstName', $scope.user.firstName);
                UserAdminstration.addField('lastName', $scope.user.lastName);
                //UserAdminstration.addField('password', $scope.user.password);
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
                if ($scope.user.selectedRoleList) {
                    UserAdminstration.addMultipleRelationship('roles', $scope.user.selectedRoleList, 'self');
                }

                if ($scope.user.org) {
                    for (var countObj in $scope.user.org) {
                        var accountInfo = $scope.user.org[countObj];
                        $scope.selectedAccountList.push(accountInfo);
                    }
                }
                UserAdminstration.addMultipleRelationship('accounts', $scope.selectedAccountList, 'self');
            };

            $scope.update = function() {
                updateAdminObjectForUpdate();
                UserAdminstration.item.postURL = UserAdminstration.url + '/' + $scope.userInfo.userId;
                console.log('UserAdminstration', UserAdminstration);
                console.log('$scope.userInfo', $scope.userInfo);
                var options = {
                    preventDefaultParams: true
                }
                var deferred = UserAdminstration.put({
                    item:  $scope.userInfo
                }, options);

                deferred.then(function(result){
                    $location.path('/delegated_admin');
                }, function(reason){
                    NREUM.noticeError('Failed to update user because: ' + reason);
                });
            };
        }
    ]);
});
