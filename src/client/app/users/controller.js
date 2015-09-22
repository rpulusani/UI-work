define(['angular', 'user'], function(angular) {
    'use strict';
    angular.module('mps.user')
    .controller('UserController', ['$scope', '$location', '$routeParams', '$rootScope',
        function($scope, $location, $routeParams, $rootScope) {

            console.log('user controller');
        }
    ]);
});
