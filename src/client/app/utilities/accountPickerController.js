define(['angular', 'utility', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.utility')
    .controller('AccountPickerController', [
        '$scope', '$location', '$controller', 
        '$routeParams', 'grid', 'UserService', 
        'AccountService', 'BlankCheck', 'FormatterService', 
        '$rootScope','PersonalizationServiceFactory', 'HATEAOSConfig','FilterSearchService',
        function($scope, $location, $controller, $routeParams, GridService, Users, Accounts, BlankCheck, 
            FormatterService, $rootScope, Personalize, HATEOASConfig, FilterSearchService) {
            $scope.selectedAccount = [];
            $rootScope.currentRowList = [];
            var personal = new Personalize($location.url(), $rootScope.idpUser.id),
            filterSearchService = new FilterSearchService(Accounts, $scope, $rootScope, personal);

            if ($rootScope.currentRowList !== undefined && $rootScope.currentRowList.length >= 1) {
                $scope.selectedAccount = $rootScope.currentRowList[$rootScope.currentRowList.length - 1].entity;
            }

            if ($rootScope.selectedAccount) {
                $rootScope.selectedAccount = undefined;
            }

            Accounts.data = [];

            configureTemplates();
            $rootScope.$emit('refreshNav');
            $rootScope.$emit('toggleAccountNav');

            $scope.sourceController = function() {
                return $controller($routeParams.source + 'Controller', { $scope: $scope }).constructor;
            };

            $scope.selectAccount = function() {
                $rootScope.currentRowList[$rootScope.currentRowList.length - 1].entity;
                HATEOASConfig.updateCurrentAccount($rootScope.currentRowList[$rootScope.currentRowList.length - 1].entity);
                $rootScope.$emit('refreshNav');
                $location.path($rootScope.accountReturnPath);
            }

            $scope.goToCallingPage = function(){
                $location.path($rootScope.accountReturnPath);
            };

            $scope.discardSelect = function(){
                $rootScope.selectedAccount = undefined;
                $rootScope.formattedSelectedAccount= undefined;
                $location.path($rootScope.accountReturnPath);
            };

            var Grid = new GridService(),
            tAccts = $rootScope.currentUser.transactionalAccount.data,
            i = 0;

            $scope.gridOptions = {};
            $scope.gridOptions.multiSelect = false;
            $scope.gridOptions.onRegisterApi = Grid.getGridActions($rootScope, Users, personal);

            for (i; i < tAccts.length; i += 1) {
                Accounts.data[i] = tAccts[i].account;
            }

            Grid.display(Accounts, $scope, personal);

            function configureTemplates() {
                $scope.configure = {
                    header: {
                        translate: {
                            h1: 'ACCOUNT.BROWSE',
                            body: 'MESSAGE.LIPSUM',
                            readMore: ''
                        },
                        readMoreUrl: '',
                        showCancelBtn: false
                    }
                };
            }
        }
    ]);
});
