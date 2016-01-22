define(['angular', 'utility.blankCheckUtility', 'user', 'user.factory'], function(angular) {
    'use strict';
    angular.module('mps.user')
    .controller('UsersController', ['$scope', '$location', '$translate', 'grid', '$routeParams', '$rootScope', 'BlankCheck', 'UserAdminstration',
        'PersonalizationServiceFactory','FilterSearchService',
        function($scope, $location, $translate, Grid, $routeParams, $rootScope, BlankCheck, UserAdminstration, Personalize,FilterSearchService) {
            UserAdminstration.setParamsToNull();
            var personal = new Personalize($location.url(), $rootScope.idpUser.id),
            filterSearchService = new FilterSearchService(UserAdminstration, $scope, $rootScope, personal,'defaultSet');
            filterSearchService.addBasicFilter('USER.ALL_USER', {'type': 'BUSINESS_PARTNER','embed': 'roles'}, false,
                function() {
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

            $scope.getStatus = function(status) {
                return BlankCheck.checkNotBlank(status) && status === 'Y' ? active : inactive;
            };
        }
    ]);
});
