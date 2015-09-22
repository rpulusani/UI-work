define(['angular'], function(angular) {
    'use strict';
    angular.module('mps.user', []).config(['$routeProvider', function ($routeProvider) {
        $routeProvider
        .when('/delegated_admin', {
            templateUrl: '/app/users/templates/view.html',
            controller: 'UsersController'
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

