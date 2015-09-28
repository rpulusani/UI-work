define(['angular', 'user', 'account.roleFactory'], function(angular) {
    'use strict';
    angular.module('mps.user')
    .controller('RoleListController', ['$scope', 'RoleService',
        function($scope, RoleService) {
            var roleList = JSON.parse($scope.roles);
            if (roleList.length > 0) {
                var i=0;
                for(i ; i < roleList.length ; i++) {
                    var roleId = roleList[i].href.split('/').pop();
                    $scope.roleName = "";
                    $scope.selectedRole = RoleService.get({roleId: roleId}, function(response){
                        if ($scope.roleName !== ''){
                            $scope.roleName = $scope.roleName + ',' + response.description;
                        } else {
                            $scope.roleName = response.description;
                        }
                    });
                }
            }
        }
    ]);
});
