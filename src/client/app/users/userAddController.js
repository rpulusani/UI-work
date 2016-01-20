define(['angular', 'user'], function(angular) {
    'use strict';
    angular.module('mps.user')
    .controller('UserAddController', ['$scope', '$location', '$translate', '$routeParams', 
        '$rootScope', 'UrlHelper', 'UserService', 'AccountService', 'Roles', '$q',
        function($scope, $location, $translate, $routeParams, $rootScope, UrlHelper, User, Account, Roles, $q) {

            $scope.templateUrl = UrlHelper.user_template;
            
            $scope.user_info_active = true;
            $scope.account_access_active = false;
            $scope.user = {};
            $scope.user.orgLevel = {};
            $scope.accountList = [];
            $scope.basicRoles = [];
            $scope.user.basicRoles = [];
            $scope.user.addonRoles = [];

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
                    //console.log('$scope.user.basicRoles', $scope.user.basicRoles);
                }
            
                if(response[1] && response[1].data && response[1].data._embedded && response[1].data._embedded.roles) {
                    var roleList = response[1].data._embedded.roles;
                    for (var j=0; j<roleList.length; j++) {
                        var role = roleList[j];
                        if($scope.user.addonRoles.length < roleList.length) {
                            $scope.user.addonRoles.push(role); 
                        }
                    }
                    //console.log('$scope.user.addonRoles', $scope.user.addonRoles);
                }
            });
            // $scope.$watch('basicRoles', function() {
            //     console.log('$scope.basicRoles in watch', $scope.basicRoles);
            //     console.log('$scope.basicRoles.length', $scope.basicRoles.length);
            //     if ($scope.basicRoles) {
            //         $scope.user.basicRoles = $scope.basicRoles;
            //         console.log('$scope.user.basicRoles in watch', $scope.user.basicRoles);
            //     }
            // });
            
            
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

            $scope.setUserInfo = function() {
                $scope.user_info_active = true;
                $scope.account_access_active = false;
            };

            $scope.setAccountAccess = function() {
                $scope.user_info_active = false;
                $scope.account_access_active = true;
            };

            $scope.save = function() {
                console.log('save new user not implemented');
                $location.path('/delegated_admin/return/submitted');
            };

            $scope.invite = function() {
                console.log('invite new user');
                $location.path('/delegated_admin/return/invited');
            };
        }
    ]);
});
