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
        
        $scope.shipmentCount = 0;
        $scope.serviceActivitiesCount = 0;
        $scope.associatedRequestsCount = 0;
        
        $scope.isActive = function(value){
            var passed = false;
            if($rootScope.currentSRTab === value){
                passed = true;
            }
            return passed;
        };
        var tabId = $location.search().tab;
        if(tabId){
            $rootScope.currentSRTab = tabId;
            $scope.isActive(tabId);
        }else{
            $scope.active('srDetailsAssociateRequestsTabl');
        }
        $scope.$on('activityCount', function(event,data){
        	$scope.serviceActivitiesCount = data;
        });
        
        $scope.$on('shipmentsCount', function(event,data){
        	$scope.shipmentCount = data;
        });
        $scope.$on('associateRequestsCount', function(event,data){
        	$scope.associatedRequestsCount = data;
        });
        
        
        
        
    }]);