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
    	/*$scope.activities = [{
            "serialNumber": 123,
            "deviceType": 'type ',
            "activityNumber": "1-1LMA3JT6",
            "statusDetail": "Archive",
            "physicalLocation1": 1,
            "physicalLocation2": 3,
            "physicalLocation3": 4
          },{
              "serialNumber": 456,
              "deviceType": 'type2',
              "activityNumber": "1-1LMasdf",
              "statusDetail": "Archive",
              "physicalLocation1": 5,
              "physicalLocation2": 6,
              "physicalLocation3": 7
            }];*/
        
        
        
     }
]);

