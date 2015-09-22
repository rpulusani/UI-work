define(['angular', 'user'], function(angular) {
    'use strict';
    angular.module('mps.user')
    .controller('UserController', ['$scope', '$location', '$routeParams', '$rootScope',
        function($scope, $location, $routeParams, $rootScope) {

            $scope.user_info_active = true;
            $scope.account_access_active = false;

            if ($routeParams.id) {
                // TODO: remove hardcode when api is ready.
                // $scope.user = UserService.get();
                $scope.user = {status: 'Active', created: '09/01/15', id: 1234567890,
                               lastName: 'Public', firstName: 'John', emailAddress: 'jpublic@lexmark.com',
                               account: {name: 'Lexmark International, Inc'}, roles: 'End user'};
                $scope.userFullName = $scope.user.firstName + ' ' + $scope.user.lastName;
            } else {
                $scope.user = {};
            }

            $scope.setUserInfo = function() {
                $scope.user_info_active = true;
                $scope.account_access_active = false;
            };

            $scope.setAccountAccess = function() {
                $scope.user_info_active = false;
                $scope.account_access_active = true;
            };

            $scope.save = function() {
                console.log('save new user');
            };
        }
    ]);
});
