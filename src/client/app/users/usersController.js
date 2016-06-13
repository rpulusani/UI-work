

angular.module('mps.user')
.controller('UsersController', ['$scope', '$location', '$translate', 'grid', '$routeParams', '$rootScope', 'BlankCheck', 'UserAdminstration',
    'PersonalizationServiceFactory','FilterSearchService', 'FormatterService',
    function($scope, $location, $translate, Grid, $routeParams, $rootScope, BlankCheck, UserAdminstration,
        Personalize, FilterSearchService, formatter) {
        $rootScope.currentRowList = [];
        $rootScope.preBreadcrumb = {
            href:'/delegated_admin',
            value:'USER_MAN.MANAGE_USERS.TXT_MANAGE_USERS'
        }
        $scope.lexmarkUserAccess = false;
        $scope.showUserUpdatedMessage = false;
        if(UserAdminstration.wasUpdated){
            $scope.showUserUpdatedMessage = true;
            UserAdminstration.wasUpdated = false;
        }
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
                $scope.noOfUsersInvited = UserAdminstration.noOfInvitation;
                $scope.invited = true;
                UserAdminstration.wasInvited = false;
            }
        }
        UserAdminstration.columns = 'defaultSet';
        var personal = new Personalize($location.url(), $rootScope.idpUser.id),
        filterSearchService = new FilterSearchService(UserAdminstration, $scope, $rootScope, personal,'defaultSet');

        var removeParamsList = ['roles', 'activeStatus', 'fromDate', 'toDate'];
        filterSearchService.addBasicFilter('USER_MAN.MANAGE_USERS.TXT_FILTER_ALL_USERS', {'type': 'BUSINESS_PARTNER','embed': 'roles,accounts'}, removeParamsList,
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

        $scope.gridOptions.exporterFieldCallback = function(grid, row, col, value) {
            switch(col.name){
                case $translate.instant('USER_MAN.COMMON.TXT_GRID_COMPANY_ACCOUNT'):
                    value = $scope.getAccountsExportValue(value); 
                    break;
                case $translate.instant('USER_MAN.COMMON.TXT_GRID_ROLES'):
                    value = $scope.getRolesExportValue(value); 
                    break;
                case $translate.instant('USER_MAN.COMMON.TXT_GRID_STATUS'):
                    value = $scope.getStatusExportValue(value); 
                    break;
                default:
                    break;
            }            
            return value;
        }

        $scope.getAccountsExportValue = function(accounts) {
            if(accounts && accounts.length) {
                var accountList = [], accountListStr = '';
                var i=0;
                for(i=0; i<accounts.length; i++) {
                    accountList.push(accounts[i].name);
                }
                var accountListStr = accountList.join(", ");
                return accountListStr;
            }else {
                return '';
            }
        };

        $scope.getRolesExportValue = function(roles) {
            if(roles && roles.length) {
                var roleList = [], roleListStr = '';
                var i=0;
                for(i=0; i<roles.length; i++) {
                    roleList.push(roles[i].description);
                }
                roleListStr = roleList.join(", ");
                return roleListStr;
            }else {
                return '';
            }
        };

        $scope.getStatusExportValue = function(status) {
            return formatter.formatStatus(status);
        };
    }
]);

