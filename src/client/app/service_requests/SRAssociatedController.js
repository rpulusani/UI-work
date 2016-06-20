angular.module('mps.serviceRequests')
.controller('SRAssociatedController', [
    '$scope',
    '$location',
    '$rootScope',
    'AssociateRequestService',
    'grid',
    'PersonalizationServiceFactory',
    'FilterSearchService',
    'Addresses','SRControllerHelperService',
    function(
        $scope,
        $location,
        $rootScope,
        AssociateRequestService,
        GridService,
        Personalize,
        FilterSearchService,
        Addresses,SRHelper) {
    	
    	
       
        $scope.visibleColumns = [];

        
        $scope.associateRequests = AssociateRequestService;
        $scope.gridLoading = true;
        
        $scope.associateRequests.data = [];
        
        
    	var Grid = new GridService();
        var personal = new Personalize($location.url(),$rootScope.idpUser.id);
        $scope.associateRequests.showBookmarkColumn = false;
        Grid.setGridOptionsName('associateRequests');
        $scope.associateRequests.onRegisterAPI = Grid.getGridActions($scope,
        $scope.associateRequests, personal);
        
        $scope.associateRequests.enableColumnMenus = false;
        
        AssociateRequestService.get({
        	params:{
        		requestId:$scope.sr.requestNumber
        	}
        }).then(function(){
        	
        	$scope.gridLoading = false;
        	if(AssociateRequestService.item._embedded && AssociateRequestService.item._embedded.associatedServiceRequests){
        		$scope.associateRequests.data = AssociateRequestService.item._embedded.associatedServiceRequests;
        	}else {
        		$scope.associateRequests.data = [];
        		/*$scope.associateRequests.data.push({ 
        			'date' : '02/20/2016',
        			'requestNumber' : '1-12345',
        			'type' : 'Update',
        			'status' : 'Submitted'
        		});
        		$scope.associateRequests.data.push({
        			'date' : '02/21/2016',
        			'requestNumber' : '1-00012345',
        			'type' : 'Remove',
        			'status' : 'Process'
        		});*/
        	}
        	Grid.display($scope.associateRequests,$scope,personal, 48);
        	
       });
       
        
        
     }
]);

