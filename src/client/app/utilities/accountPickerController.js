
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
            },
            breadcrumbs: false
        };
        
        $rootScope.$emit('refreshNav');
        $rootScope.$emit('toggleAccountNav');

        $scope.sourceController = function() {
            return $controller($routeParams.source + 'Controller', { $scope: $scope }).constructor;
        };

        $scope.selectAccount = function() {
            var url = Accounts.getRelationship('account', $rootScope.currentSelectedRow);
            HATEOASConfig.updateCurrentAccount($rootScope.currentSelectedRow.account, url);
            Users.createItem($rootScope.currentSelectedRow);
            $rootScope.currentAccount.refresh = true;

            HATEOASConfig.getCurrentAccount().then(function() {
                Security.getPermissions($rootScope.currentUser).then(function(permissions) {
                    Security.setWorkingPermission(permissions);
                    new SecurityHelper($rootScope).setupPermissionList($rootScope.configurePermissions);

                    $rootScope.$emit('refreshNav');

                    $location.path($rootScope.accountReturnPath);
                });
            });
        };

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
        
        if (Accounts.data.length === 1){
        	if(Accounts.data[0].account.level.toUpperCase() === 'SIEBEL'){
        		$rootScope.currentSelectedRow = Accounts.data[0]; 
        		$scope.selectAccount();
        	}
        }
        
        setTimeout(function() {
            Grid.display(Accounts, $scope, personal);
         }, 0);

    }
]);
