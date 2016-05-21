

angular.module('mps.user')
.controller('UserTabController', [
    '$rootScope',
    '$scope',
    'SecurityHelper',
    function(
        $rootScope,
        $scope,
        SecurityHelper
    ) {
        if(!$rootScope.orderAccess){
            new SecurityHelper($rootScope).confirmPermissionCheck("orderAccess");    
        }
        $scope.active = function(value){
            $rootScope.serviceTabSelected = value;
        };

        $scope.isActive = function(value){
            var passed = false;
            if($rootScope.serviceTabSelected === value){
                passed = true;
            }
            return passed;
        };

        $scope.active('allUsers');
    }
]);

