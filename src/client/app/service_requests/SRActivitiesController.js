angular.module('mps.serviceRequests')
.controller('SRActivitiesController', [
    '$scope',
    '$location',
    '$rootScope',
    'ActivityService',
    'grid',
    'PersonalizationServiceFactory',
    'FilterSearchService',
    'SRControllerHelperService',
    function(
        $scope,
        $location,
        $rootScope,
        ActivityService,
        GridService,
        Personalize,
        FilterSearchService,
        SRHelper) {
    	
    	$scope.gridLoading = true;
    	ActivityService.newMessage();
    	ActivityService.get({
        	params:{
        		requestId:$scope.sr.id
        	}
        }).then(function(){
        	
        	$scope.gridLoading = false;
        	if(ActivityService.item && ActivityService.item._embedded && ActivityService.item._embedded.serviceActivities){
        		$scope.activities = ActivityService.item._embedded.serviceActivities;
        	}else{
        		$scope.activities = [];
        	}
        	
        });
    	
        
        
        
     }
]);

