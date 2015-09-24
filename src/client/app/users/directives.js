define(['angular', 'user', 'account.accountFactory', 'account.roleFactory'], function(angular) {
    'use strict';
    angular.module('mps.user')
    .directive('userCoreFields', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/users/templates/user-core-fields.html',
            controller: 'UserController'
        };
    })
    .directive('userLocationFields', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/users/templates/user-location-fields.html',
            controller: 'UserController'
        };
    })
    .directive('userLoginFields', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/users/templates/user-login-fields.html',
            controller: 'UserController'
        };
    })
    .directive('selectedAccountList', function(){
         return {
            restrict: 'A',
            scope: {
                accounts: '@'
            },
            template: '{{accountName}}',
            controller: ['$scope', 'AccountService', function($scope, AccountService){
                var accountList = JSON.parse($scope.accounts);
                if (accountList.length > 0) {
                    var i=0;
                    for(i ; i < accountList.length ; i++) {
                        var accountId = accountList[i].href.split('/').pop();
                        $scope.accountName = "";
                        $scope.selectedAccount = AccountService.get({accountId: accountId}, function(response){
                            if ($scope.accountName !== ''){
                                $scope.accountName = $scope.accountName + ',' + response.name;
                            } else {
                                $scope.accountName = response.name;
                            }
                        });
                    }
                }
            }]
        };
    })
    .directive('selectedRoleList', function(){
         return {
            restrict: 'A',
            scope: {
                roles: '@'
            },
            template: '{{roleName}}',
            controller: ['$scope', 'RoleService', function($scope, RoleService){
                var roleList = JSON.parse($scope.roles);
                if (roleList.length > 0) {
                    var i=0;
                    for(i ; i < roleList.length ; i++) {
                        var roleId = roleList[i].href.split('/').pop();
                        $scope.roleName = "";
                        $scope.selectedRole = RoleService.get({roleId: roleId}, function(response){
                            if ($scope.roleName !== ''){
                                $scope.roleName = $scope.roleName + ',' + response.description;
                            } else {
                                $scope.roleName = response.description;
                            }
                        });
                    }
                }
            }]
        };
    })
    .directive('userList', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/users/templates/user-list.html',
            controller: 'UsersController',
            link: function(scope, el, attr){
                    require(['lxk.fef'], function() {
                    var $ = require('jquery'),
                        sets = $(el).find("[data-js=tab]");
                    sets.each(function(i,set){
                        $(set).set({
                        });
                    });            
                });
            }
        };
    });
});
