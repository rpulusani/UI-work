

angular.module('mps.serviceRequests')
.controller('SRShipmentsController', [
    '$translate',
    '$location',
    'BlankCheck',
    'FormatterService',
    '$rootScope',
    '$scope',
    'Carriers',
    'ShipmentsService',
    function(
        $translate,
        $location,
        BlankCheck,
        FormatterService,
        $rootScope,
        $scope,
        Carriers,
        Shipments
        ) {
    	$scope.gridLoading = true; 	
    	$scope.showHideDetails = function(shipment){
    		
    		shipment.showDetails = (shipment.showDetails === false?true:false);
    		if(shipment.showDetails){
    			shipment.showHideMessage = 'Hide Shipment Details';
    		}else{
    			shipment.showHideMessage = 'Show Shipment details';
    		}
    	};
    	//Carriers.query();// Need to queue this with the shipments call.
    	Shipments.newMessage();
    	Shipments.get({
        	params:{
        		requestId:$scope.sr.requestNumber
        	}
        }).then(function(){
        	$scope.gridLoading = false;
    		if(Shipments.item && Shipments.item._embedded && Shipments.item._embedded.shipments){
    			$scope.shipments = Shipments.item._embedded.shipments;
    			updateShipments();
    		}else{
    			$scope.shipments = [];
    			
    		}
    		
    		
    		
    	
    	});
    	$scope.shipments = [];
    	
    	function updateShipments(){
    		for(var i=0;i<$scope.shipments.length;i++){
        		$scope.shipments[i].showDetails = false;
        		$scope.shipments[i].showHideMessage = 'Show Shipment details';
        		$scope.shipments[i].formattedShipToAddress = FormatterService.formatAddress($scope.shipments[i].shipToAddress);
        		/*var shipment = $scope.shipments[i];
        		for(var j = 0 ;j<Carriers.data.length;j++){
        			if(Carriers.data[j].name === shipment.carrier){
        				shipment.trackingUrl = Carriers.data[j].trackingUrl+"?no="+shipment.trackingNumber;
        			}
        		}*/
        		
        	}
    	}
    		
    	
    	 	
    	
    	
    	
    	
       
}]);

