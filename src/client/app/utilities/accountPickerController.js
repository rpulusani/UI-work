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
            var personal = new Personalize($location.url(), $rootScope.idpUser.id),
            filterSearchService = new FilterSearchService(Accounts, $scope, $rootScope, personal),
            Grid = new GridService(),
            tAccts = $rootScope.currentUser.transactionalAccount.data,
            i = 0;

            Accounts.data = [];

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

            $rootScope.$emit('refreshNav');
            $rootScope.$emit('toggleAccountNav');

            $scope.sourceController = function() {
                return $controller($routeParams.source + 'Controller', { $scope: $scope }).constructor;
            };

            $scope.selectAccount = function() {
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

            $scope.gridOptions = {};
            $scope.gridOptions.multiSelect = false;
            $scope.gridOptions.onRegisterApi = Grid.getGridActions($rootScope, Users, personal);

            for (i; i < tAccts.length; i += 1) {
                Accounts.data[i] = tAccts[i].account;
            }

            Grid.display(Accounts, $scope, personal);
        }
    ]);
});
