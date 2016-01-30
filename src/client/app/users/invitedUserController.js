define(['angular', 'utility.blankCheckUtility', 'user', 'user.factory'], function(angular) {
    'use strict';
    angular.module('mps.user')
    .controller('InvitedUsersController', ['$scope', '$location', '$translate', 'grid', '$routeParams', '$rootScope', 'BlankCheck', 'UserAdminstration',
        'PersonalizationServiceFactory','FilterSearchService',
        function($scope, $location, $translate, Grid, $routeParams, $rootScope, BlankCheck, UserAdminstration, Personalize,FilterSearchService) {
            UserAdminstration.setParamsToNull();
            var personal = new Personalize($location.url(), $rootScope.idpUser.id),
            filterSearchService = new FilterSearchService(UserAdminstration, $scope, $rootScope, personal,'invitedSet');
            filterSearchService.addBasicFilter('USER.ALL_INVITED_USER', {'type': 'INVITED', 'embed': 'roles'}, false,
                function(Grid) {
                    $scope.$broadcast('setupPrintAndExport', $scope);
                }
            );
            filterSearchService.addPanelFilter('USER.FILTER_BY_STATUS', 'InvitedStatusFilter', undefined,
                function() {
                    $scope.$broadcast('setupPrintAndExport', $scope);
                }
            );
            filterSearchService.addPanelFilter('USER.FILTER_BY_ROLE', 'RoleFilter', undefined,
                function() {
                    $scope.$broadcast('setupPrintAndExport', $scope);
                }
            );

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