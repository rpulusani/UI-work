define(['angular', 'utility.blankCheckUtility', 'user', 'user.factory'], function(angular) {
    'use strict';
    angular.module('mps.user')
    .controller('UsersController', ['$scope', '$location', '$translate', 'grid', '$routeParams', '$rootScope', 'BlankCheck', 'UserService',
        'PersonalizationServiceFactory','FilterSearchService',
        function($scope, $location, $translate, Grid, $routeParams, $rootScope, BlankCheck, UserService, Personalize,FilterSearchService) {
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
            UserService.setParamsToNull();
            var personal = new Personalize($location.url(), $rootScope.idpUser.id),
            filterSearchService = new FilterSearchService(UserService, $scope, $rootScope, personal,'defaultSet');
            filterSearchService.addBasicFilter('USER.ALL_USER', {name: 'type', value: 'INVITED'}, false,
                function() {
                }
            );

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
                $location.path('/delegated_admin/new');
            };

            $scope.goToInviteUser = function() {
                $location.path('/delegated_admin/invite_user');
            };

            $scope.getStatus = function(status) {
                return BlankCheck.checkNotBlank(status) && status === 'Y' ? active : inactive;
            };
        }
    ]);
});
