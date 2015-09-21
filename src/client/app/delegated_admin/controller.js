define(['angular', 'delegatedAdmin'], function(angular) {
    'use strict';
    angular.module('mps.delegatedAdmin')
    .controller('DelegatedAdminController', ['$scope', '$location', '$routeParams', '$rootScope',
        function($scope, $location, $routeParams, $rootScope) {

            // TODO: remove hardcode when api is ready.
            // UserService.query(function(users) {
            //     $scope.users = users;
            // });
            $scope.users = [
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

            $scope.columns = [{id: 1, name: 'Status'}, {id: 2, name: 'Creation date'}, {id: 3, name: 'User Id'}];

        }
    ]);
});
