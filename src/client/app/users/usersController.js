define(['angular', 'utility.blankCheckUtility', 'user', 'user.factory'], function(angular) {
    'use strict';
    angular.module('mps.user')
    .controller('UsersController', ['$scope', '$location', '$routeParams', '$rootScope', 'BlankCheck', 'UserService',
        function($scope, $location, $routeParams, $rootScope, BlankCheck, UserService) {
            var inactive = "LABEL.INACTIVE",
                active = "LABEL.ACTIVE";
            $scope.allUsersActive = true;
            $scope.invitationsActive = false;
            UserService.getHAL(function(response){
                $scope.users = response.data._embedded.users;
            }); 

            $scope.columns = [{id: 1, name: 'Status'}, {id: 2, name: 'Creation date'}, {id: 3, name: 'User Id'}];

            $scope.search = function() {
                console.log('search users by text in column...');
            };

            $scope.setAllUsers = function() {
                $scope.allUsersActive = true;
                $scope.invitationsActive = false;
                UserService.getHAL(function(response){
                    $scope.users = response.data._embedded.users;
                });
            };

            $scope.setInvitations = function() {
                $scope.allUsersActive = false;
                $scope.invitationsActive = true;
                UserService.getHAL({type: 'INVITED'}, function(response){
                    $scope.users = response.data._embedded.users;
                });
            };

            $scope.goToCreateUser = function() {
                $location.path('/delegated_admin/new_user');
            };

            $scope.getStatus = function(status) {
                return BlankCheck.checkNotBlank(status) && status === 'Y' ? active : inactive;
            };
        }
    ])
});
