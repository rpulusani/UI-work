

angular.module('mps.security')
.factory('SecurityHelper', [
    'SecurityService',
    '$location',
    function(
        SecurityService,
        $location
        ) {
            var scope,
            SecurityHelper = function(incommingScope){
                scope = incommingScope;
                scope.security = new SecurityService();
            };
            SecurityHelper.prototype.redirectCheck =  function(passing){
                if(!passing){
                    $location.path('/');
                }
            };
            SecurityHelper.prototype.singlePermissionCheck = function(permissionCheckHolderName,
                permissionToBeChecked){
                    if(!permissionCheckHolderName){
                        throw new Error('permissionCheckHolderName is required parameter!');
                    }
                    if(!permissionToBeChecked){
                        throw new Error('permissionToBeChecked is required parameter!');
                    }
                    scope[permissionCheckHolderName] = false;
                    scope.security.isAllowed(permissionToBeChecked).then(function(passed){
                        scope[permissionCheckHolderName]  = passed;
                    });
            };
            SecurityHelper.prototype.setupPermissionList = function(permissionCheckList){
                var self = this;
                if(!permissionCheckList){
                        throw new Error('permissionCheckHolderName is required parameter!');
                }
                if(Object.prototype.toString.call( permissionCheckList ) !== '[object Array]'){
                    throw new Error('permissionCheckList is required to be an array!');
                }
                for(var i = 0; i < permissionCheckList.length; ++i){
                    if(permissionCheckList[i] && !permissionCheckList[i].name){
                        throw new Error('permissionCheckList is an array but at index: ' + i + ' is missing name property');
                    }
                    if(permissionCheckList[i] && !permissionCheckList[i].permission){
                        throw new Error('permissionCheckList is an array but at index: ' + i + ' is missing permission property');
                    }
                    self.singlePermissionCheck(permissionCheckList[i].name, permissionCheckList[i].permission);
                }
            };

            return SecurityHelper;

    }
]);

