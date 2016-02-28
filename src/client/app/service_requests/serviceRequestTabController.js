angular.module('mps.serviceRequests')
.controller('ServiceRequestTabController', [
    '$rootScope',
    '$scope',
    '$routeParams',
    'SecurityHelper',
    '$location',
    function(
        $rootScope,
        $scope,
        $routeParams,
        SecurityHelper,
        $location
    ) {
        new SecurityHelper($rootScope).redirectCheck($rootScope.serviceRequestAccess);

        $scope.active = function(value){
            $rootScope.currentServiceRequestTab = value;
            $location.search('tab', value);
        };

        $scope.isActive = function(value){
            var passed = false;
            if($rootScope.currentServiceRequestTab === value){
                passed = true;
            }
            return passed;
        };

        var tabId = $location.search().tab;
        if(tabId){
            $rootScope.currentServiceRequestTab = tabId;
            $scope.isActive(tabId);
        }else{
            $scope.active('serviceRequestsAllTab');
        }

    }
]);

