define(['angular', 'utility.blankCheckUtility', 'user', 'user.factory'], function(angular) {
    'use strict';
    angular.module('mps.user')
    .controller('UsersController', ['$scope', '$location', '$routeParams', '$rootScope', 'BlankCheck', 'UserService',
        function($scope, $location, $routeParams, $rootScope, BlankCheck, UserService) {
            var inactive = "LABEL.INACTIVE",
                active = "LABEL.ACTIVE";
            $scope.allUsersActive = true;
            $scope.invitationsActive = false;
            $scope.userHAL = UserService.getHAL(function(){
                $scope.users = $scope.userHAL.users;
                console.log($scope.users);
            }); 

            $scope.columns = [{id: 1, name: 'Status'}, {id: 2, name: 'Creation date'}, {id: 3, name: 'User Id'}];

            $scope.search = function() {
                console.log('search users by text in column...');
            };

            $scope.setAllUsers = function() {
                $scope.allUsersActive = true;
                $scope.invitationsActive = false;
                $scope.userHAL = UserService.getHAL(function(){
                    $scope.users = $scope.userHAL.users;
                    console.log($scope.users);
                });
            };

            $scope.setInvitations = function() {
                $scope.allUsersActive = false;
                $scope.invitationsActive = true;
                $scope.invitedUserHAL = UserService.getHAL({type: 'INVITED'}, function(){
                    $scope.users = $scope.invitedUserHAL.users;
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
    .controller('UserController', ['$scope', '$location', '$routeParams', '$rootScope',
        function($scope, $location, $routeParams, $rootScope) {

            $scope.user_info_active = true;
            $scope.account_access_active = false;

            // TODO: remove hardcode when api is ready.
            // $scope.user = UserService.get();
            $scope.user = {status: 'Active', created: '09/01/15', id: 1234567890,
                           lastName: 'Public', firstName: 'John', emailAddress: 'jpublic@lexmark.com',
                           account: {name: 'Lexmark International, Inc'}, roles: 'End user'};
            $scope.userFullName = $scope.user.firstName + ' ' + $scope.user.lastName;

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
