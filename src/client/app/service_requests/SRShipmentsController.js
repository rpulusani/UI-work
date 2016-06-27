

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
    	$scope.hasData = false;
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
    		}else{
    			$scope.shipments = [];    			
    		}
    		updateShipments();
    		
    		
    	
    	});
    	$scope.shipments = [];
    	
    	function updateShipments(){
    		var cancelledIndex = -1,requestedQty = 0,fulfilledQty = 0;
    		$scope.cancelledItems = [];
    		$scope.pending = {
    				total : 0,
    				pendCount : 0
    		}
    		for(var i=0;i<$scope.shipments.length;i++){
        		$scope.shipments[i].showDetails = false;
        		$scope.shipments[i].showHideMessage = 'Show Shipment details';
        		$scope.shipments[i].formattedShipToAddress = FormatterService.formatAddress($scope.shipments[i].shipToAddress);
        		if($scope.hasData === false && $scope.shipments[i].shipmentParts.length > 0){
        			$scope.hasData = true;
        		}
        		//Below is for removing the cancelled item
        		if($scope.shipments[i].cancelledQty > 0 && $scope.shipments[i].cancelledReason){
        			cancelledIndex = i;        			
        		}
        		/*var shipment = $scope.shipments[i];
        		for(var j = 0 ;j<Carriers.data.length;j++){
        			if(Carriers.data[j].name === shipment.carrier){
        				shipment.trackingUrl = Carriers.data[j].trackingUrl+"?no="+shipment.trackingNumber;
        			}
        		}*/
        		for(var j = 0;j<$scope.shipments[i].shipmentParts.length ; j++){
        			requestedQty = $scope.shipments[i].shipmentParts[j].requestedQuantity === null? 0: $scope.shipments[i].shipmentParts[j].requestedQuantity;
        			fulfilledQty = $scope.shipments[i].shipmentParts[j].quantity === null ? 0 :$scope.shipments[i].shipmentParts[j].quantity;
        			$scope.pending.total += requestedQty;
        			$scope.pending.pendCount += (requestedQty - fulfilledQty);
        		}
        		
        	}
    		if(cancelledIndex !== -1){    			
    			$scope.cancelledItems.push($scope.shipments[cancelledIndex]);
    			$scope.shipments.splice(cancelledIndex,1);  
    			
    		}
    		
    	}
    		
    	
    	 	
    	
    	
    	
    	
       
}]);

