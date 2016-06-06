
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
    '$filter',
    '$window',
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
        SecurityHelper,
        $filter,
        $window
    ) {
        var personal = new Personalize($location.url(), $rootScope.idpUser.id),
        filterSearchService = new FilterSearchService(Accounts, $scope, $rootScope, personal),
        Grid = new GridService(),
        tAccts = $rootScope.currentUser.transactionalAccount.data,
        i = 0,
        Security = new SecurityService();
        
        $scope.abc = Accounts;
        $scope.searchFunctionDef = function(params, removeParams){
        	
        	var filterData = [],i=0;
        	if(params.searchOn === undefined){
        		filterData = Accounts.data;
        	}else{
        		for (;i<Accounts.data.length;i++){
            		if(Accounts.data[i].account[params.searchOn].toLowerCase().indexOf(($window.decodeURIComponent(params.search)).toLowerCase()) != -1){
            			filterData.push(Accounts.data[i]);
            		}
            	}	
        	}
        	
        	if(filterData.length === 0){
        		$scope.gridLoading = false;
        	}
        	$scope.gridDataCnt = filterData.length;
        	$scope.gridOptions.data = filterData;
        	$scope.pagination = {};
        	$scope.pagination.totalItems = function (){ return $scope.gridDataCnt; };       	
        	
        };
        
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
            breadcrumbs: {
                1:$rootScope.preBreadcrumb,
                2:{
                    value:'ACCOUNT.BROWSE'
                }
            }
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
       
        	Accounts.page.totalElements = $scope.gridDataCnt;
       
        
         
        for (i; i < tAccts.length; i += 1) {
            Accounts.data[i] = tAccts[i];
        }
        $scope.gridDataCnt = Accounts.data.length;
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
