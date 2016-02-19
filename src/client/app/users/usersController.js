define(['angular', 'utility.blankCheckUtility', 'user', 'user.factory', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.user')
    .controller('UsersController', ['$scope', '$location', '$translate', 'grid', '$routeParams', '$rootScope', 'BlankCheck', 'UserAdminstration',
        'PersonalizationServiceFactory','FilterSearchService', 'FormatterService',
        function($scope, $location, $translate, Grid, $routeParams, $rootScope, BlankCheck, UserAdminstration,
            Personalize, FilterSearchService, formatter) {
            $rootScope.currentRowList = [];
            $scope.lexmarkUserAccess = false;
            if ($rootScope.currentUser.type === 'INTERNAL') {
                $scope.lexmarkUserAccess = true;
            }
            UserAdminstration.setParamsToNull();
             if (UserAdminstration.item) {
                $scope.saved = false;
                $scope.invited = false;
                $scope.user = UserAdminstration.item;
                $scope.fullName = formatter.getFullName($scope.user.firstName, $scope.user.lastName);
                if (UserAdminstration.wasSaved) {
                    $scope.saved = true;
                }

                if (UserAdminstration.wasInvited) {
                    $scope.invited = true;
                }
            }
            var personal = new Personalize($location.url(), $rootScope.idpUser.id),
            filterSearchService = new FilterSearchService(UserAdminstration, $scope, $rootScope, personal,'defaultSet');

            var removeParamsList = ['roles', 'activeStatus', 'fromDate', 'toDate'];
            filterSearchService.addBasicFilter('USER.ALL_USER', {'type': 'BUSINESS_PARTNER','embed': 'roles'}, removeParamsList,
                function() {
                    $scope.$broadcast('setupPrintAndExport', $scope);
                }
            );
            filterSearchService.addPanelFilter('USER.FILTER_BY_STATUS', 'StatusFilter', undefined,
                function() {
                    $scope.$broadcast('setupPrintAndExport', $scope);
                }
            );
            filterSearchService.addPanelFilter('USER.FILTER_BY_ROLE', 'RoleFilter', undefined,
                function() {
                    $scope.$broadcast('setupPrintAndExport', $scope);
                }
            );

            $scope.view = function(user){
                UserAdminstration.setItem(user);
                var options = {
                    params:{
                        embed:'roles,accounts'
                    }
                };

                UserAdminstration.item.get(options).then(function(){
                    $location.path(UserAdminstration.route + '/' + user.userId + '/review');
                });
            };

            $scope.goToCreateUser = function() {
                $location.path('/delegated_admin/new');
            };

            $scope.goToInviteUser = function() {
                $location.path('/delegated_admin/invite_user');
            };

            $scope.goToLexmrkUser = function() {
                $location.path('/delegated_admin/lexmark_user');
            };
        }
    ]);
});
