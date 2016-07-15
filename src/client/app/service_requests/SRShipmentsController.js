

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
    		var requestedQty = 0,fulfilledQty = 0,finalList = [],alreadyProcessedItems = [],cancelledQuantity = 0;
    		$scope.cancelledItems = [];
    		$scope.pending = {
    				pendCount : 0
    		}
    		for(var i=0;i<$scope.shipments.length;i++){
        		$scope.shipments[i].showDetails = false;
        		$scope.shipments[i].showHideMessage = 'Show Shipment details';
        		$scope.shipments[i].shipDate = FormatterService.formatDate($scope.shipments[i].shipDate); 
        		$scope.shipments[i].deliveryDate = FormatterService.formatDate($scope.shipments[i].deliveryDate); 
        		$scope.shipments[i].formattedShipToAddress = FormatterService.formatAddress($scope.shipments[i].shipToAddress);
        		if($scope.hasData === false && $scope.shipments[i].shipmentParts.length > 0){
        			$scope.hasData = true;
        		}
        		//Below is for removing the cancelled item
        		if($scope.shipments[i].status === 'CANCELLED'){
        			$scope.cancelledItems.push($scope.shipments[i]);
        			continue;
        		}
        		/*var shipment = $scope.shipments[i];
        		for(var j = 0 ;j<Carriers.data.length;j++){
        			if(Carriers.data[j].name === shipment.carrier){
        				shipment.trackingUrl = Carriers.data[j].trackingUrl+"?no="+shipment.trackingNumber;
        			}
        		}*/
        		
        		for(var j = 0;j<$scope.shipments[i].shipmentParts.length ; j++){
        			if(alreadyProcessedItems.indexOf($scope.shipments[i].shipmentParts[j].orderLineId) === -1){
        				requestedQty = $scope.shipments[i].shipmentParts[j].requestedQuantity === null? 0: $scope.shipments[i].shipmentParts[j].requestedQuantity;
        			}else{
        				requestedQty = 0;
        			}        			
        			fulfilledQty = $scope.shipments[i].shipmentParts[j].quantity === null ? 0 :$scope.shipments[i].shipmentParts[j].quantity;
        			cancelledQuantity = $scope.shipments[i].shipmentParts[j].cancelledQuantity === null ? 0 :$scope.shipments[i].shipmentParts[j].cancelledQuantity;

        			$scope.pending.pendCount += (requestedQty - fulfilledQty);
        			alreadyProcessedItems.push($scope.shipments[i].shipmentParts[j].orderLineId);
        		}
        		
        		if($scope.shipments[i].status === 'SUBMITTED'){
         			continue;
         		}        		
        		finalList.push($scope.shipments[i]);
        	}
    		
    		$scope.shipments = finalList;
    		$scope.$emit('shipmentsCount',$scope.shipments.length);
        	
    	}
    		
    	
    	 	
    	
    	
    	
    	
       
}]);

