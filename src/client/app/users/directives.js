define(['angular', 'user', 'account.accountFactory', 'account.roleFactory'], function(angular) {
    'use strict';
    angular.module('mps.user')
    .directive('userRoles', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/users/templates/user-roles.html',
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
            controller: 'AccountListController'
        };
    })
    .directive('selectedRoleList', function(){
         return {
            restrict: 'A',
            scope: {
                roles: '@'
            },
            template: '{{roleName}}',
            controller: 'RoleListController'
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
                        sets = $(el).find("[data-js=tab], [data-js=set], [data-js=accordion]");
                    sets.each(function(i,set){
                        $(set).set({});
                    });
                });
            }
        };
    });
});
