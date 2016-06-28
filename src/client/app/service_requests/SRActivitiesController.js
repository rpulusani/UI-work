angular.module('mps.serviceRequests')
.controller('SRActivitiesController', [
    '$scope',
    '$location',
    '$rootScope',
    'grid',
    'PersonalizationServiceFactory',
    'FilterSearchService',
    'SRControllerHelperService','serviceUrl','HATEOASFactory','FormatterService','BlankCheck',
    function(
        $scope,
        $location,
        $rootScope,
        GridService,
        Personalize,
        FilterSearchService,
        SRHelper,serviceUrl,HATEOASFactory,Formatter,BlankCheck) {
    	
    	
    	var Activity = {
        		serviceName: 'serviceActivityDetails',
        		embeddedName: 'serviceActivities', //get away from embedded name and move to a function to convert url name to javascript name
                columns: 'defaultSet',
                hideBookmark: true,
                url: serviceUrl + 'service-requests/serviceActivityDetails',
                columnDefs: {
                    defaultSet: [
                        {'name':'Serial Number', 'field':'assetDetails.serialNumber', 'notSearchable': true},
                        {'name': 'Device Type', 'field': 'assetDetails.productModel', 'notSearchable': true},
                        {'name': 'Activity Number', 'field': 'activityNumber', 'notSearchable': true},
                        {'name': 'Status Detail', 'field' : 'getStatusDetail()', 'notSearchable': true},
                        {'name': 'Building' , 'field' : 'assetDetails.physicalLocation1', 'notSearchable': true},
                        {'name': 'Floor' , 'field' :'assetDetails.physicalLocation2', 'notSearchable': true},
                        {'name': 'Office' , 'field' : 'assetDetails.physicalLocation3', 'notSearchable': true}                        
                    ]             
                
              },
              functionArray: [{
            	  
                      name: 'getStatusDetail',
                      functionDef: function(){
                    	  var value = "";
                    	  if(BlankCheck.checkNotBlank(this.statusDetail)){
                    		  if(this.statusDetail.toLowerCase().indexOf('cancelled') === -1 
                    				  && this.statusDetail.toLowerCase().indexOf('completed') === -1){
                    			  value = 'In Progress';  
                    		  }else{
                    			  value = this.statusDetail;
                    		  }
                    	  }
                    			  
                    	  return value;
                      }
                  
              }]
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
        		$scope.activityGridOptions.data = Grid.getDataWithDataFormatters($scope.activityGridOptions.item._embedded.serviceActivities, $scope.activityGridOptions.functionArray);
        	}else{
        		$scope.activityGridOptions.data = [];
        	}
        	$scope.activityGridOptions.height = Formatter.getHeightFromdata($scope.activityGridOptions.data); 
        });
    	
        
        
        
     }
]);

