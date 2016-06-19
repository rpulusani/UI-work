angular.module('mps.serviceRequests')
.controller('allTabsController', [
    '$scope',
    '$location',
    '$rootScope',
    function(
        $scope,
        $location,
        $rootScope
        ) {

    	$scope.active = function(value){
    		console.log('in active'); 
            $rootScope.currentSRTab = value;
            $location.search('tab', value);
            return false;
        };

        $scope.isActive = function(value){
            var passed = false;
            if($rootScope.currentSRTab === value){
                passed = true;
            }
            return passed;
        };

        var tabId = $location.search().tab;
        console.log('tabId '+tabId);
        if(tabId){
            $rootScope.currentSRTab = tabId;
            $scope.isActive(tabId);
        }else{
            $scope.active('srDetailsAssociateRequestsTabl');
        }
    }]);