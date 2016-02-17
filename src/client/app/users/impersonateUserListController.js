define(['angular', 'utility.blankCheckUtility', 'user', 'user.factory', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.user')
    .controller('ImpersonateUserListController', ['$scope', '$location', '$translate', 'grid', '$routeParams', '$rootScope', 'BlankCheck', 'UserAdminstration',
        'PersonalizationServiceFactory','FilterSearchService', 'FormatterService', 'Impersonate',
        function($scope, $location, $translate, Grid, $routeParams, $rootScope, BlankCheck, UserAdminstration,
            Personalize, FilterSearchService, formatter, Impersonate) {
            $rootScope.currentRowList = [];
            UserAdminstration.setParamsToNull();
            var personal = new Personalize($location.url(), $rootScope.idpUser.id),
            filterSearchService = new FilterSearchService(UserAdminstration, $scope, $rootScope, personal,'impersonateSet');

            $scope.selectRow = function(btnType) {
                if (btnType === 'impersonate') {
                    $scope.impersonateUser($scope.gridApi.selection.getSelectedRows()[0]);
                }
            };

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

            $scope.impersonateUser = function(user) {
                Impersonate.query(user.email, function(data) {
                    console.log('impersonate info', data);
                });
            };
        }
    ]);
});
