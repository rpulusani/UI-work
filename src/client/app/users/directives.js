define(['angular', 'user'], function(angular) {
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
    });
});
