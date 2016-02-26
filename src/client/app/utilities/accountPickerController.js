define(['angular', 'utility', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.utility')
    .controller('AccountPickerController', [
        '$scope', 
        '$location', 
        '$controller', 
        '$routeParams',
        'grid',
        'UserService', 
        'AccountService',
        'BlankCheck',
        'FormatterService', 
        '$rootScope',
        'PersonalizationServiceFactory',
        'HATEAOSConfig',
        'FilterSearchService',
        'SecurityService',
        'SecurityHelper',
        function(
            $scope, 
            $location,
            $controller,
            $routeParams,
            GridService,
            Users,
            Accounts,
            BlankCheck, 
            FormatterService,
            $rootScope,
            Personalize,
            HATEOASConfig,
            FilterSearchService,
            SecurityService,
            SecurityHelper
        ) {
            var personal = new Personalize($location.url(), $rootScope.idpUser.id),
            filterSearchService = new FilterSearchService(Accounts, $scope, $rootScope, personal),
            Grid = new GridService(),
            tAccts = $rootScope.currentUser.transactionalAccount.data,
            i = 0,
            Security = new SecurityService();

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
                HATEOASConfig.updateCurrentAccount($rootScope.currentRowList[$rootScope.currentRowList.length - 1].entity.account);
                
                Users.createItem($rootScope.currentRowList[$rootScope.currentRowList.length - 1].entity);

                $rootScope.currentAccount.refresh = true;

                HATEOASConfig.getCurrentAccount().then(function() {
                    Security.getPermissions($rootScope.currentUser).then(function(permissions) {
                        Security.setWorkingPermission(permissions);
                        
                        new SecurityHelper($rootScope).setupPermissionList($rootScope.configurePermissions);

                        $rootScope.$emit('refreshNav');
                        $location.path($rootScope.accountReturnPath);
                    });
                });
            }

            $scope.goToCallingPage = function(){
                $location.path($rootScope.accountReturnPath);
            };

            $scope.discardSelect = function(){
                $location.path($rootScope.accountReturnPath);
            };

            $scope.gridOptions = {};
            $scope.gridOptions.multiSelect = false;
            $scope.gridOptions.onRegisterApi = Grid.getGridActions($rootScope, Users, personal);

            for (i; i < tAccts.length; i += 1) {
                Accounts.data[i] = tAccts[i];
            }

            setTimeout(function() {
                Grid.display(Accounts, $scope, personal);
            }, 0);
        }
    ]);
});
