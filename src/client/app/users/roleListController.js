define(['angular', 'user', 'utility.blankCheckUtility', 'account.roleFactory'], function(angular) {
    'use strict';
    angular.module('mps.user')
    .controller('RoleListController', ['$scope', 'BlankCheck', 'RoleService',
        function($scope, BlankCheck, RoleService) {
            if(BlankCheck.checkNotNullOrUndefined($scope.roles) && $scope.roles.length > 0) {
                var roleList = JSON.parse($scope.roles);
                if (roleList.length > 0) {
                    var i=0;
                    for(i ; i < roleList.length ; i++) {
                        var roleId = roleList[i].href.split('/').pop();
                        $scope.roleName = "";
                        $scope.selectedRole = RoleService.get({roleId: roleId}, function(response){
                            if (BlankCheck.checkNotNullOrUndefined(response.description)) {
                                if ($scope.roleName !== ''){
                                    $scope.roleName = $scope.roleName + ',' + response.description;
                                } else {
                                        $scope.roleName = response.description;
                                }
                            }
                        });
                    }
                }
            }
        }
    ]);
});
