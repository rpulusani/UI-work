

angular.module('mps.user')
.controller('ImpersonateUserListController', ['$scope', '$location', '$translate', 'grid', '$routeParams', '$rootScope', 'BlankCheck', 'UserAdminstration',
    'PersonalizationServiceFactory','FilterSearchService', 'FormatterService', 'Impersonate', '$http', 'gatekeeper-cookie-compat', '$window', 'SecurityHelper',
    function($scope, $location, $translate, Grid, $routeParams, $rootScope, BlankCheck, UserAdminstration,
        Personalize, FilterSearchService, formatter, Impersonate, $http, $cookies, $window, SecurityHelper) {

        if(!$rootScope.userManagementAccess){
            new SecurityHelper($rootScope).confirmPermissionCheck("userManagementAccess");    
        }
        
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
        filterSearchService.addBasicFilter('USER_MAN.MANAGE_USERS.TXT_FILTER_ALL_USERS', {'type': 'BUSINESS_PARTNER','embed': 'roles'}, removeParamsList,
            function() {
                $scope.$broadcast('setupPrintAndExport', $scope);
            }
        );
        filterSearchService.addPanelFilter('USER_MAN.COMMON.TXT_FILTER_STATUS', 'StatusFilter', undefined,
            function() {
                $scope.$broadcast('setupPrintAndExport', $scope);
            }
        );
        filterSearchService.addPanelFilter('USER_MAN.COMMON.TXT_FILTER_ROLE', 'RoleFilter', undefined,
            function() {
                $scope.$broadcast('setupPrintAndExport', $scope);
            }
        );

        $scope.impersonateUser = function(user) {
            Impersonate.query(user.email, function(data) {
                var authToken = 'Bearer ' + data.accessToken;
                $cookies.put('impersonateToken', authToken);
                $window.location.reload();
            });
        };

        $scope.gridOptions.exporterFieldCallback = function(grid, row, col, value) {
            if(col.name === $translate.instant('USER_MAN.COMMON.TXT_GRID_COMPANY_ACCOUNT')) {
                value = $scope.getAccountsExportValue(value);            
            }
            return value;
        }

        $scope.getAccountsExportValue = function(accounts) {
            if(accounts && accounts.length){
                var accountList = [], accountListStr = '';
                var i=0;
                for (i=0; i<accounts.length; i++) {
                    accountList.push(accounts[i].name);
                }
                var accountListStr = accountList.join(", ");
                return accountListStr;
            }else{
                return '';
            }
        };
    }
]);

