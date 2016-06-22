angular.module('mps.serviceRequests')
.controller('SRActivitiesController', [
    '$scope',
    '$location',
    '$rootScope',
    'grid',
    'PersonalizationServiceFactory',
    'FilterSearchService',
    'SRControllerHelperService','serviceUrl','HATEOASFactory',
    function(
        $scope,
        $location,
        $rootScope,
        GridService,
        Personalize,
        FilterSearchService,
        SRHelper,serviceUrl,HATEOASFactory) {
    	
    	
    	var Activity = {
        		serviceName: 'serviceActivityDetails',
        		embeddedName: 'serviceActivities', //get away from embedded name and move to a function to convert url name to javascript name
                columns: 'defaultSet',
                hideBookmark: true,
                url: serviceUrl + 'service-requests/serviceActivityDetails',
                columnDefs: {
                    defaultSet: [
                        {'name':'Serial Number', 'field':'serialNumber', 'notSearchable': true},
                        {'name': 'Device Type', 'field': 'deviceType', 'notSearchable': true},
                        {'name': 'Activity Number', 'field': 'activityNumber', 'notSearchable': true},
                        {'name': 'Status Detail', 'field' : 'statusDetail', 'notSearchable': true},
                        {'name': 'Building' , 'field' : 'physicalLocation1', 'notSearchable': true},
                        {'name': 'Floor' , 'field' :'physicalLocation2', 'notSearchable': true},
                        {'name': 'Office' , 'field' : 'physicalLocation3', 'notSearchable': true}                        
                    ]             
                
              }
       };
    	
    	$scope.activityGridOptions = new HATEOASFactory(Activity);
        $scope.activityGridOptions.data =[]; 
        
        var Grid = new GridService();
        var personal = new Personalize($location.url(),$rootScope.idpUser.id);
        $scope.activityGridOptions.showBookmarkColumn = false;
        Grid.setGridOptionsName('activityGridOptions');
        $scope.activityGridOptions.onRegisterAPI = Grid.getGridActions($scope,
        $scope.activityGridOptions, personal);
        Grid.display($scope.activityGridOptions,$scope,personal, 48);
        $scope.activityGridOptions.enableColumnMenus = false;
    	
    	$scope.gridLoading = true;
    	$scope.activityGridOptions.newMessage();
    	$scope.activityGridOptions.get({
        	params:{
        		requestId:$scope.sr.id
        	}
        }).then(function(){
        	
        	$scope.gridLoading = false;
        	if($scope.activityGridOptions.item && $scope.activityGridOptions.item._embedded && $scope.activityGridOptions.item._embedded.serviceActivities){
        		$scope.activityGridOptions.data = $scope.activityGridOptions.item._embedded.serviceActivities;
        	}else{
        		$scope.activityGridOptions.data = [];
        	}
        	
        });
    	
        
        
        
     }
]);

