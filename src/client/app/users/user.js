define(['angular'], function(angular) {
    'use strict';
    angular.module('mps.user', []).config(['$routeProvider', 'UrlHelper',
    function ($routeProvider, UrlHelper) {

        var templateUrl = UrlHelper.user_template;

        $routeProvider
        .when('/delegated_admin', {
            templateUrl: templateUrl('view'),
            controller: 'UsersController'
        })
        .when('/delegated_admin/return/:returnParam', {
            templateUrl: templateUrl('view'),
            controller: 'UsersController',
            activeItem: '/delegated_admin'
        })
        .when('/delegated_admin/new_user', {
            templateUrl: templateUrl('new-user'),
            controller: 'UserController',
            activeItem: '/delegated_admin'
        })
        .when('/delegated_admin/invite_user', {
            templateUrl: templateUrl('invite-user'),
            controller: 'UserController',
            activeItem: '/delegated_admin'
        })
        .when('/delegated_admin/:id/read', {
            templateUrl: templateUrl('read'),
            controller: 'UserController',
            activeItem: '/delegated_admin'
        })
    }]);
});

