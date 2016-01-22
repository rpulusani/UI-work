define(['angular'], function(angular) {
    'use strict';
    angular.module('mps.user', []).config(['$routeProvider', 'UrlHelper',
    function ($routeProvider, UrlHelper) {

        var templateUrl = UrlHelper.user_template;

        $routeProvider
        .when('/delegated_admin', {
            templateUrl: '/app/users/templates/view.html',
            controller: 'UsersController'
        })
        .when('/delegated_admin/return/:returnParam', {
            templateUrl: '/app/users/templates/view.html',
            controller: 'UsersController',
            activeItem: '/delegated_admin'
        })
        .when('/delegated_admin/new', {
            templateUrl: '/app/users/templates/new.html',
            controller: 'UserAddController',
            activeItem: '/delegated_admin'
        })
        .when('/delegated_admin/invite_user', {
            templateUrl: '/app/users/templates/invite-user.html',
            controller: 'UserAddController',
            activeItem: '/delegated_admin'
        })
        .when('/delegated_admin/:id/read', {
            templateUrl: templateUrl('read'),
            controller: 'UserController',
            activeItem: '/delegated_admin'
        })
    }]);
});

