define(['angular', 'utility.blankCheckUtility', 'user', 'user.factory','utility.gridService'], function(angular) {
    'use strict';
    angular.module('mps.user')
    .controller('UsersController', ['$scope', '$location', 'gridService', '$routeParams', '$rootScope', 'BlankCheck', 'UserService','$q',
        function($scope, $location, GridService, $routeParams, $rootScope, BlankCheck, UserService, $q) {
            var inactive = "LABEL.INACTIVE",
                active = "LABEL.ACTIVE";
            $scope.allUsersActive = true;
            $scope.invitationsActive = false;
            

            $scope.gridOptions = {};
            $scope.gridOptions.onRegisterApi = GridService.getGridActions($rootScope, UserService);
            $scope.setGrid = function() {
                GridService.getGridOptions(UserService, '').then(
                function(options){
                    var params = [];
                    $scope.gridOptions = options;
                    $scope.pagination = GridService.pagination(UserService, $rootScope);
                    $scope.itemsPerPage = UserService.getPersonalizedConfiguration('itemsPerPage');
                    if ($scope.invitationsActive) {
                        params =[
                            {
                                name: 'size',
                                value: $scope.itemsPerPage
                            },
                            {
                                name: 'page',
                                value: 0
                            },
                            {
                                name: 'type',
                                value: 'INVITED'
                            }
                        ];
                    }

                    if ($scope.allUsersActive) {
                        params =[
                            {
                                name: 'size',
                                value: $scope.itemsPerPage
                            },
                            {
                                name: 'page',
                                value: 0
                            }
                        ];
                    }
                    

                    UserService.resource(params).then(
                        function(response){
                            $scope.gridOptions.data = UserService.getList();
                        }
                    );
                    },
                    function(reason){
                         NREUM.noticeError('Grid Load Failed: ' + reason);
                    }
                );
            };

            $scope.setGrid();

            $scope.columns = [{id: 1, name: 'Status'}, {id: 2, name: 'Creation date'}, {id: 3, name: 'User Id'}];

            $scope.search = function() {
                console.log('search users by text in column...');
            };

            $scope.setAllUsers = function() {
                $scope.allUsersActive = true;
                $scope.invitationsActive = false;
                $scope.setGrid();
            };

            $scope.setInvitations = function() {
                $scope.allUsersActive = false;
                $scope.invitationsActive = true;
                $scope.setGrid();
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
