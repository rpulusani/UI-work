

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
            $rootScope.currentOrderTab = value;
            $location.search('tab', value);
        };

        $scope.isActive = function(value){
            var passed = false;
            if($rootScope.currentOrderTab === value){
                passed = true;
            }
            return passed;
        };
        var tabId = $location.search().tab;
        if(tabId){
            $rootScope.currentOrderTab = tabId;
            $scope.isActive(tabId);
        }else{
            if ($rootScope.viewHardwareOrderAccess && $rootScope.viewSupplyOrderAccess) {
                $scope.active('orderAllTab');
            } else if ($rootScope.viewHardwareOrderAccess && !$rootScope.viewSupplyOrderAccess) {
                $scope.active('deviceOrderTab');
            } else if (!$rootScope.viewHardwareOrderAccess && $rootScope.viewSupplyOrderAccess) {
                $scope.active('supplyOrderTab');
            }
         
        }
    }
]);

