define(['angular'], function(angular) {
    'use strict';
    angular.module('mps.delegatedAdmin', []).config(['$routeProvider', function ($routeProvider) {
        $routeProvider
        .when('/delegated_admin', {
            templateUrl: '/app/delegated_admin/templates/view.html',
            controller: 'DelegatedAdminController'
        })
        .when('/delegated_admin/new_user', {
            templateUrl: '/app/users/templates/new-user.html',
            controller: 'UserController'
        })
        .when('/delegated_admin/invite_user', {
            templateUrl: '/app/users/templates/invite-user.html',
            controller: 'UserController'
        })
        .when('/delegated_admin/:id/read', {
            templateUrl: '/app/users/templates/read.html',
            controller: 'UserController'
        })
    }]);
});
