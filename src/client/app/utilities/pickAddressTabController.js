angular.module('mps.utility')
.controller('PickAddressTabController', [
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
        $scope.active = function(value){
            $rootScope.currentAddressTab = value;
            $location.search('tab', value);
        };

        $scope.isActive = function(value){
            var passed = false;
            if($rootScope.currentAddressTab === value){
                passed = true;
            }
            return passed;
        };
        var tabId = $location.search().tab;
        if(tabId){
            $rootScope.currentAddressTab = tabId;
            $scope.isActive(tabId);
        }else{
            $scope.active('pickAddressTab');
        }
    }
]);

