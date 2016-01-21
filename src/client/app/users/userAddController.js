define(['angular', 'user'], function(angular) {
    'use strict';
    angular.module('mps.user')
    .controller('UserAddController', ['$scope', '$location', '$translate', '$routeParams', 
        '$rootScope', 'UrlHelper', 'UserService', 'AccountService', 'Roles', '$q', 'UserAdminstration',
        function($scope, $location, $translate, $routeParams, $rootScope, UrlHelper, User, Account, Roles, $q, UserAdminstration) {

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
                        if($scope.user.basicRoles.length < roleList.length) {
                            var tempRole = {};
                            tempRole.id = role.id;
                            tempRole.description = role.description;
                            $scope.user.basicRoles.push(tempRole); 
                        }
                    }
                }
            
                if(response[1] && response[1].data && response[1].data._embedded && response[1].data._embedded.roles) {
                    var roleList = response[1].data._embedded.roles;
                    for (var j=0; j<roleList.length; j++) {
                        var role = roleList[j];
                        if($scope.user.addonRoles.length < roleList.length) {
                            role.selected = false;
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
                    if (Roles.item && role.selected) {
                        $scope.user.selectedRoleList.push(role);
                    } else if ($scope.user.selectedRoleList && $scope.user.selectedRoleList.indexOf(role) !== -1) {
                        $scope.user.selectedRoleList.splice($scope.user.selectedRoleList.indexOf(role), 1);
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
                            UserAdminstration.addField('firstName', emailList[i]);
                            UserAdminstration.addField('email', emailList[i]);
                            UserAdminstration.addField('userId', emailList[i]);
                            if ($scope.user.selectedRoleList || $scope.basicRole) {
                                if ($scope.basicRole) {
                                    $scope.user.selectedRoleList.push($scope.basicRole);
                                }
                                UserAdminstration.addMultipleRelationship('roles', $scope.user.selectedRoleList, 'self');
                            }

                            if ($scope.user.org) {
                                var selectedAccountList = [];
                                for (var countObj in $scope.user.org) {
                                    var accountInfo = $scope.user.org[countObj];
                                    selectedAccountList.push(accountInfo);
                                }
                                UserAdminstration.addMultipleRelationship('accounts', selectedAccountList, 'self');
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
                        stateCode: $scope.address.state,
                        country: $scope.address.country,
                        postalCode: $scope.user.address.postalCode
                    };
                    UserAdminstration.addField('address', addressInfo);
                    UserAdminstration.addField('preferredLanguage', 'en_US');
                    UserAdminstration.addField('resetPassword', true);
                    if ($scope.user.selectedRoleList || $scope.basicRole) {
                        if ($scope.basicRole) {
                            $scope.user.selectedRoleList.push($scope.basicRole);
                        }
                        UserAdminstration.addMultipleRelationship('roles', $scope.user.selectedRoleList, 'self');
                    }

                    if ($scope.user.org) {
                        var selectedAccountList = [];
                        for (var countObj in $scope.user.org) {
                            var accountInfo = $scope.user.org[countObj];
                            selectedAccountList.push(accountInfo);
                        }
                        UserAdminstration.addMultipleRelationship('accounts', selectedAccountList, 'self');
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
                
                $q.all(rolePromiseList).then(function(result) {
                    $location.path('/delegated_admin');
                }, function(reason){
                    NREUM.noticeError('Failed to create SR because: ' + reason);
                }); 
            };
        }
    ]);
});
