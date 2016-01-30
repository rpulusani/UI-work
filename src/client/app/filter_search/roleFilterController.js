define(['angular', 'filterSearch'], function(angular) {
    'use strict';
    angular.module('mps.filterSearch')
    .controller('RoleFilterController', ['$scope', '$translate', 'Roles', '$q',
        function($scope, $translate, Roles, $q) {
            $scope.selectedRoleList = [];
            $scope.totalRoleList = [];

            var removeParams,
            basicRoleOptions =  {
                'params': {
                    customerType: 'customer',
                    roleType: 'basic'
                }
            },
            addonRoleOptions = {
                'params': {
                    customerType: 'customer',
                    roleType: 'addon'
                }
            }, 
            promise1 = Roles.get(basicRoleOptions),
            promise2 = Roles.get(addonRoleOptions),
            rolePromiseList = [promise1,promise2];

            
            $q.all(rolePromiseList).then(function(response) {
                if(response[0] && response[0].data && response[0].data._embedded && response[0].data._embedded.roles) {
                    var roleList = response[0].data._embedded.roles;
                    for (var j=0; j<roleList.length; j++) {
                        var role = roleList[j];
                        $scope.totalRoleList.push(role); 
                    }
                }
            
                if(response[1] && response[1].data && response[1].data._embedded && response[1].data._embedded.roles) {
                    var roleList = response[1].data._embedded.roles;
                    for (var j=0; j<roleList.length; j++) {
                        var role = roleList[j];
                        $scope.totalRoleList.push(role); 
                    }
                }
            });

            $scope.roleFilter = function(role){
                if (role.selected) {
                    $scope.selectedRoleList.push(role.roleId);
                } else {
                    if($scope.selectedRoleList.indexOf(role.roleId) !== -1) {
                        $scope.selectedRoleList.splice($scope.selectedRoleList.indexOf(role.roleId), 1);
                    }
                }
                if($scope.selectedRoleList && $scope.filterDef && typeof $scope.filterDef === 'function'){
                    var roles = $scope.selectedRoleList.join();
                    if ($scope.selectedRoleList.length > 0) {
                        $scope.params['roles'] = roles;
                        $scope.filterDef($scope.params,['activeStatus', 'invitedStatus']);
                    } else {
                        $scope.params = {};
                        $scope.filterDef($scope.params,['roles', 'activeStatus', 'invitedStatus']);
                    }
                }
            };


        }
    ]);
});
