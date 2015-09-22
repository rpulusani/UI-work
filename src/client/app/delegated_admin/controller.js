define(['angular', 'delegatedAdmin'], function(angular) {
    'use strict';
    angular.module('mps.delegatedAdmin')
    .controller('DelegatedAdminController', ['$scope', '$location', '$routeParams', '$rootScope',
        function($scope, $location, $routeParams, $rootScope) {

            $scope.all_users_active = true;
            $scope.invitations_active = false;

            // TODO: remove hardcode when api is ready.
            // UserService.query({activeStatus: 'Y'}, function(users) {
            //     $scope.all_users = users;
            // });
            $scope.all_users = [
                {status: 'Active', created: '09/01/15', id: 1234567890,
                 lastName: 'Public', firstName: 'John', email: 'jpublic@lexmark.com',
                 account: {name: 'Lexmark International, Inc'}, roles: 'End user'},
                {status: 'Active', created: '09/01/15', id: 1234567890,
                 lastName: 'Public', firstName: 'John', email: 'jpublic@lexmark.com',
                 account: {name: 'Lexmark International, Inc'}, roles: 'End user'},
                {status: 'Active', created: '09/01/15', id: 1234567890,
                 lastName: 'Public', firstName: 'John', email: 'jpublic@lexmark.com',
                 account: {name: 'Lexmark International, Inc'}, roles: 'End user'},
                {status: 'Active', created: '09/01/15', id: 1234567890,
                 lastName: 'Public', firstName: 'John', email: 'jpublic@lexmark.com',
                 account: {name: 'Lexmark International, Inc'}, roles: 'End user'},
                {status: 'Active', created: '09/01/15', id: 1234567890,
                 lastName: 'Public', firstName: 'John', email: 'jpublic@lexmark.com',
                 account: {name: 'Lexmark International, Inc'}, roles: 'End user'},
                {status: 'Active', created: '09/01/15', id: 1234567890,
                 lastName: 'Public', firstName: 'John', email: 'jpublic@lexmark.com',
                 account: {name: 'Lexmark International, Inc'}, roles: 'End user'}
            ];

            // TODO: remove hardcode when api is ready.
            // UserService.query({activeStatus: 'N'}, function(users) {
            //     $scope.invited_users = users;
            // });
            $scope.invited_users = [
                {status: 'Pending', created: '09/01/15', id: 1234567890,
                 lastName: 'Public', firstName: 'John', email: 'jpublic@lexmark.com',
                 account: {name: 'Lexmark International, Inc'}, roles: 'End user'},
                {status: 'Pending', created: '09/01/15', id: 1234567890,
                 lastName: 'Public', firstName: 'John', email: 'jpublic@lexmark.com',
                 account: {name: 'Lexmark International, Inc'}, roles: 'End user'},
                {status: 'Pending', created: '09/01/15', id: 1234567890,
                 lastName: 'Public', firstName: 'John', email: 'jpublic@lexmark.com',
                 account: {name: 'Lexmark International, Inc'}, roles: 'End user'},
                {status: 'Pending', created: '09/01/15', id: 1234567890,
                 lastName: 'Public', firstName: 'John', email: 'jpublic@lexmark.com',
                 account: {name: 'Lexmark International, Inc'}, roles: 'End user'},
                {status: 'Pending', created: '09/01/15', id: 1234567890,
                 lastName: 'Public', firstName: 'John', email: 'jpublic@lexmark.com',
                 account: {name: 'Lexmark International, Inc'}, roles: 'End user'}
            ];


            // TODO: retrieve company name from user object
            $scope.companyName = 'Lexmark';
            $scope.users = $scope.all_users;

            $scope.columns = [{id: 1, name: 'Status'}, {id: 2, name: 'Creation date'}, {id: 3, name: 'User Id'}];

            $scope.search = function() {
                console.log('search users by text in column...');
            };

            $scope.setAllUsers = function() {
                $scope.all_users_active = true;
                $scope.invitations_active = false;
                $scope.users = $scope.all_users;
            };

            $scope.setInvitations = function() {
                $scope.all_users_active = false;
                $scope.invitations_active = true;
                $scope.users = $scope.invited_users;
            };

            $scope.goToCreateUser = function() {
                console.log('majikayo');
                $location.path('/delegated_admin/new_user');
            };
        }
    ]);
});
