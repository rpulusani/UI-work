angular.module('mps.serviceRequests')
.controller('SRAssociatedController', [
    '$scope',
    '$location',
    '$rootScope',
    'grid',
    'PersonalizationServiceFactory',
    'FilterSearchService',
    'Addresses','SRControllerHelperService','serviceUrl','HATEOASFactory','ServiceRequestService','OrderRequest','Devices',
    function(
        $scope,
        $location,
        $rootScope,
        GridService,
        Personalize,
        FilterSearchService,
        Addresses,SRHelper,serviceUrl,HATEOASFactory,ServiceRequest,Orders,Devices) {
    	
    	 var AssociateRequest = {
        		 serviceName: 'associatedRequestDetails',
        		 embeddedName: 'associatedServiceRequests', //get away from embedded name and move to a function to convert url name to javascript name
                columns: 'defaultSet',
                hideBookmark: true,
                url: serviceUrl + 'service-requests/associatedRequestDetails',
                columnDefs: {
                    defaultSet: [
                        {'name':'Date', 'field':'requestDate'},
                        {'name':'Request Number', 'field':'requestNumber',
                        	'cellTemplate':'<div>' +
                            '<a href="#" ng-click="grid.appScope.view(row.entity);" ' +
                            '>{{row.entity.requestNumber}}</a>' +
                        '</div>'
                        	
                        	},
                        {'name': 'Type', 'field': 'serviceRequestType'},
                        {'name': 'Status', 'field': 'serviceRequestStatus'}
                    ],             
                route: '/service_requests'
              }
        };
       
        $scope.visibleColumns = [];

        
        $scope.associateRequests = new HATEOASFactory(AssociateRequest);
        $scope.gridLoading = true;
        
        $scope.associateRequests.data = [];
        
        
    	var Grid = new GridService();
        var personal = new Personalize($location.url(),$rootScope.idpUser.id);
        $scope.associateRequests.showBookmarkColumn = false;
        Grid.setGridOptionsName('associateRequests');
        $scope.associateRequests.onRegisterAPI = Grid.getGridActions($scope,
        $scope.associateRequests, personal);
        
        $scope.associateRequests.enableColumnMenus = false;
        $scope.associateRequests.newMessage();
        $scope.associateRequests.get({
        	params:{
        		requestId:$scope.sr.requestNumber
        	}
        }).then(function(){
        	console.log($scope.associateRequests);
        	$scope.gridLoading = false;
        	if($scope.associateRequests.item._embedded && $scope.associateRequests.item._embedded.associatedServiceRequests){
        		$scope.associateRequests.data = $scope.associateRequests.item._embedded.associatedServiceRequests;
        		processData();        		
        	}else {
        		$scope.associateRequests.data = [];        		
        	}
        	$scope.$emit('associateRequestsCount',$scope.associateRequests.data.length);
        	
        	Grid.display($scope.associateRequests,$scope,personal, 48);
        	
       });
       
        
      $scope.view = function (SR){
    	  ServiceRequest.setItem(SR);
          var options = {
              params:{
                  embed:'primaryContact,requester,address,account,asset,sourceAddress,destinationAddress,secondaryContact,attachments'
              }
          };
          ServiceRequest.item.get(options).then(function(){
        	  var getItem = angular.copy(ServiceRequest.item.item);
        	  ServiceRequest.item = getItem;
        	  ServiceRequest.item.item = getItem;
              $location.path(Orders.route + '/' + SR.requestId + '/receipt'); 
              $location.search('tab','srDetailsActivitiesTab');
          });
      }  
      
      function processData(){
    	  var i=0;
    	  for(;i<$scope.associateRequests.data.length;i++){
    		  $scope.associateRequests.data[i]._links = {
    				  self: {
    					  href: serviceUrl+'orders/'+$scope.associateRequests.data[i].requestId
    				  }
    		  }
    	  }
      }
     }
]);

