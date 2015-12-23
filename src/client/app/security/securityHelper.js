define(['angular', 'security'], function(angular) {
    'use strict';
    angular.module('mps.security')
    .factory('SecurityHelper', [
        'SecurityService',
        function(
            SecurityService
            ) {
                var scope,
                SecurityHelper = function(incommingScope){
                    scope = incommingScope;
                    scope.security = new SecurityService();
                };
                SecurityHelper.prototype.singlePermissionCheck = function(permissionCheckHolderName,
                    permissionToBeChecked){
                        scope[permissionCheckHolderName] = false;
                        scope.security.isAllowed(permissionToBeChecked).then(function(passed){
                            scope[permissionCheckHolderName]  = passed;
                        });
                };
                SecurityHelper.prototype.setupPermissionList = function(permissionCheckList){
                    var self = this;
                    for(var i = 0; i < permissionCheckList.length; ++i){
                        self.singlePermissionCheck(permissionCheckList[i].name, permissionCheckList[i].permission);
                    }
                };

                return SecurityHelper;

        }
    ]);
});
