define(['angular', 'utility.blankCheckUtility', 'user', 'user.factory'], function(angular) {
    'use strict';
    angular.module('mps.user')
    .controller('UsersController', ['$scope', '$location', '$translate', 'grid', '$routeParams', '$rootScope', 'BlankCheck', 'UserService',
        'PersonalizationServiceFactory',
        function($scope, $location, $translate, Grid, $routeParams, $rootScope, BlankCheck, UserService, Personalize) {
            var inactive = "LABEL.INACTIVE",
                active = "LABEL.ACTIVE";
            $scope.allUsersActive = true;
            $scope.invitationsActive = false;

            if ($routeParams.returnParam) {
                if ($routeParams.returnParam === 'submitted') {
                    $scope.alert = $translate.instant('USER.USER_CREATED_MSG');
                } else if($routeParams.returnParam === 'invited') {
                    $scope.alert = $translate.instant('USER.USER_INVITED_MSG');
                }
            }

            var personal = new Personalize($location.url(), $rootScope.idpUser.id);
            $scope.gridOptions = {};
            $scope.gridOptions.showBookmarkColumn = false;
            $scope.gridOptions.onRegisterApi = Grid.getGridActions($rootScope, UserService);

            $scope.setGrid = function() {

                $scope.additionalParams = [];
                if ($scope.invitationsActive) {
                    $scope.additionalParams = [
                        {
                            name: 'type',
                            value: 'INVITED'
                        }
                    ];
                }
                UserService.getPage(undefined,undefined,$scope.additionalParams).then(function() {
                Grid.display(UserService, $scope, personal);
                }, function(reason) {
                    NREUM.noticeError('Grid Load Failed for ' + UserService.serviceName +  ' reason: ' + reason);
                });
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

            $scope.goToInviteUser = function() {
                $location.path('/delegated_admin/invite_user');
            };

            $scope.getStatus = function(status) {
                return BlankCheck.checkNotBlank(status) && status === 'Y' ? active : inactive;
            };
        }
    ])
});
