

angular.module('mps.orders')
.controller('OrderTabController', [
    '$rootScope',
    '$scope',
    'SecurityHelper',
     '$location',
    function(
        $rootScope,
        $scope,
        SecurityHelper,
        $location
    ) {
        new SecurityHelper($rootScope).redirectCheck($rootScope.orderAccess);
        $scope.active = function(value){
            $rootScope.serviceTabSelected = value;
            $location.search('tab', value);
        };

        $scope.isActive = function(value){
            var passed = false;
            if($rootScope.serviceTabSelected === value){
                passed = true;
            }
            return passed;
        };
        var tabId = $location.search().tab;
        if(tabId){
            $rootScope.currentServiceRequestTab = tabId;
            $scope.isActive(tabId);
        }else{
         $scope.active('orderAllTab');
        }
    }
]);

