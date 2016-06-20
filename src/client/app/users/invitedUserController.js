

angular.module('mps.user')
.controller('InvitedUsersController', ['$scope', '$location', '$translate', 'grid', '$routeParams', '$rootScope', 'BlankCheck', 'UserAdminstration',
    'PersonalizationServiceFactory','FilterSearchService', 'FormatterService',
    function($scope, $location, $translate, Grid, $routeParams, $rootScope, BlankCheck, UserAdminstration, Personalize, FilterSearchService, formatter) {
        UserAdminstration.setParamsToNull();
        $scope.error = false;
        $scope.selectRow = function() {
                var selectedUser = $scope.gridApi.selection.getSelectedRows();
                var rejected = [];
                $scope.error = false;
                for(var i=0;i<selectedUser.length;i++){
                	if(selectedUser[i].invitedStatus !== 'REJECTED'){
                		UserAdminstration.setItem(selectedUser[i]);
                        UserAdminstration.reset();
                        UserAdminstration.newMessage();
                        $scope.userInfo = UserAdminstration.item;
                        UserAdminstration.addField('type', 'INVITED');
                        UserAdminstration.addField('invitedStatus', 'REJECTED');
                        UserAdminstration.addField('active', false);
                        UserAdminstration.addField('resetPassword', false);
                        UserAdminstration.addField('email', selectedUser[i].email);
                        UserAdminstration.addField('userId', selectedUser[i].userId);
                        if (selectedUser[i]._links.roles) {
                            $scope.userInfo._links.roles = selectedUser[i]._links.roles;
                        }
                        if (selectedUser[i]._links.accounts) {
                            $scope.userInfo._links.accounts = selectedUser[i]._links.accounts;
                        }
                        UserAdminstration.item.postURL = UserAdminstration.url + '/' + selectedUser[i].userId;
    	                var options = {
    	                        preventDefaultParams: true
    	                    }
    	                    var deferred = UserAdminstration.put({
    	                        item:  $scope.userInfo
    	                    }, options);
    	
    	                    deferred.then(function(result){
    	                        UserAdminstration.wasInvited = false;
    	                        UserAdminstration.wasSaved = false;
    	                        setTimeout(function() {
    	                            $rootScope.currentRowList = [];
    	                            $scope.searchFunctionDef({'type': 'INVITED', 'embed': 'roles'}, undefined);
    	                        }, 500);
    	                    }, function(reason){
    	                        NREUM.noticeError('Failed to update user because: ' + reason);
    	                });
                    }else{
                    	$scope.error = true;
                    	rejected.push(selectedUser[i].email);
                    	
                    }
                }
                if($scope.error){
                	$scope.errorMessage = 'Cannot Cancel Invitaion for Rejected Status users '+rejected.toString();
                }else{
                	$scope.error = false;
                }
                	
            
        };
        UserAdminstration.columns = 'invitedSet';
        var personal = new Personalize($location.url(), $rootScope.idpUser.id),
        filterSearchService = new FilterSearchService(UserAdminstration, $scope, $rootScope, personal,'invitedSet');

        var removeParamsList = ['roles', 'invitedStatus', 'fromDate', 'toDate'];
        filterSearchService.addBasicFilter('USER_MAN.INVITE_USERS.TXT_FILTER_ALL_INVITED_USER', {'type': 'INVITED', 'embed': 'roles'}, removeParamsList,
            function(Grid) {
                $scope.$broadcast('setupPrintAndExport', $scope);
            }
        );
        filterSearchService.addPanelFilter('USER_MAN.COMMON.TXT_FILTER_STATUS', 'InvitedStatusFilter', undefined,
            function() {
                $scope.$broadcast('setupPrintAndExport', $scope);
            }
        );
        filterSearchService.addPanelFilter('USER_MAN.COMMON.TXT_FILTER_ROLE', 'RoleFilter', undefined,
            function() {
                $scope.$broadcast('setupPrintAndExport', $scope);
            }
        );

        $scope.goToCreateUser = function() {
            $location.path('/delegated_admin/new');
        };

        $scope.goToInviteUser = function() {
            $location.path('/delegated_admin/invite_user');
        };

        $scope.getStatus = function(status) {
            return BlankCheck.checkNotBlank(status) && status === 'Y' ? active : inactive;
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
