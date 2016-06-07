

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
        
        if(!$rootScope.orderAccess){
            new SecurityHelper($rootScope).confirmPermissionCheck("orderAccess");    
        }
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
        $rootScope.preBreadcrumb = {
                href:'/orders',
                value:'ORDER_MAN.MANAGE_ORDERS.TXT_MANAGE_ORDERS'
        }
    }
]);

