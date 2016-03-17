

angular.module('mps.user')
.controller('InvitedUsersController', ['$scope', '$location', '$translate', 'grid', '$routeParams', '$rootScope', 'BlankCheck', 'UserAdminstration',
    'PersonalizationServiceFactory','FilterSearchService',
    function($scope, $location, $translate, Grid, $routeParams, $rootScope, BlankCheck, UserAdminstration, Personalize,FilterSearchService) {
        UserAdminstration.setParamsToNull();

        $scope.selectRow = function() {
                var selectedUser = $scope.gridApi.selection.getSelectedRows()[0];
            UserAdminstration.setItem(selectedUser);
                UserAdminstration.reset();
                UserAdminstration.newMessage();
                $scope.userInfo = UserAdminstration.item;
                UserAdminstration.addField('type', 'INVITED');
                UserAdminstration.addField('invitedStatus', 'REJECTED');
                UserAdminstration.addField('active', false);
                UserAdminstration.addField('resetPassword', false);
                UserAdminstration.addField('email', selectedUser.email);
                UserAdminstration.addField('userId', selectedUser.userId);
                if (selectedUser._links.roles) {
                    $scope.userInfo._links.roles = selectedUser._links.roles;
                }
                if (selectedUser._links.accounts) {
                    $scope.userInfo._links.accounts = selectedUser._links.accounts;
                }
                UserAdminstration.item.postURL = UserAdminstration.url + '/' + selectedUser.userId;
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
        };

        var personal = new Personalize($location.url(), $rootScope.idpUser.id),
        filterSearchService = new FilterSearchService(UserAdminstration, $scope, $rootScope, personal,'invitedSet');

        var removeParamsList = ['roles', 'invitedStatus', 'fromDate', 'toDate'];
        filterSearchService.addBasicFilter('USER.ALL_INVITED_USER', {'type': 'INVITED', 'embed': 'roles'}, removeParamsList,
            function(Grid) {
                $scope.$broadcast('setupPrintAndExport', $scope);
            }
        );
        filterSearchService.addPanelFilter('USER.FILTER_BY_STATUS', 'InvitedStatusFilter', undefined,
            function() {
                $scope.$broadcast('setupPrintAndExport', $scope);
            }
        );
        filterSearchService.addPanelFilter('USER.FILTER_BY_ROLE', 'RoleFilter', undefined,
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
    }
]);
