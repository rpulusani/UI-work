

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
    	Shipments.get({
        	params:{
        		requestId:$scope.sr.requestNumber
        	}
        }).then(function(){
    		console.log(Shipments);
    		$scope.gridLoading = false;
    		if(Shipments.item && Shipments.item._embedded && Shipments.item._embedded.shipments){
    			$scope.shipments = Shipments.item._embedded.shipments;
    			updateShipments();
    		}else{
    			$scope.shipments = [];
    			/*$scope.shipments = [{        		
        		status : 'Shipped',deliveredDate : '12/06/2016',company: 'UPS',
        		trackingNumber : '12345555',shipmentDate : '1/1/2016',deliveryDate : '13/06/2016',carrier : 'PostNet',
        		shipToAddress : {
        			 	"name" : " 1301 NORTH ILLINOIS AVE., HARRISBURG, AZ","storeFrontName" : null,
        		        "addressLine1" : " 1301 NORTH ILLINOIS AVE.","addressLine2" : null,"houseNumber" : null,
        		        "city" : "HARRISBURG","stateFullName" : null,"province" : null,"county" : null,
        		        "district" : null,"country" : "USA","countryIsoCode" : null,"postalCode" : "72432-3021",
        		        "zoneId" : null,"zoneName" : null,"lbsIdentifierFlag" : null,"region" : "AR",
        		        "latitude" : null,"longitude" : null,"lbsGridX" : null,"lbsGridY" : null,
        		        "account" : null,"assets" : null,"soldToNumber" : null,"addressCleansedFlag" : null,
        		        "physicalLocation1" : null,"physicalLocation2" : null,"physicalLocation3" : null,
        		        "id" : null,"state" : "AZ"
        		} ,
        		contents : [{
        			quantity : '2',
        			partNumber : '1-1234',
        			partType : 'Yellow Cartridge',
        			description: 'Cs Corp EA Yel Tnr Cart'
        		},
        		{
        			quantity : '3',
        			partNumber : '1-5667',
        			partType : 'Magenta Cartridge',
        			description: 'Cs Corp EA Yel Tnr Cart'
        		},
        		{
        			quantity : '2',
        			partNumber : '1-TxGH',
        			partType : 'Black Cartridge',
        			description: 'Cs Corp EA Yel Tnr Cart'
        		},
        		{
        			quantity : '2',
        			partNumber : '1-XYZ',
        			partType : 'Green Cartridge',
        			description: 'Cs Corp EA Yel Tnr Cart'
        		}]
        	},
        	{
        		
        		status : 'Delivered',
        		deliveredDate : '12/06/2016',
        		company: 'USPS',
        		trackingNumber : '9065678',
        		shipmentDate : '1/1/2016',
        		deliveryDate : '13/06/2016',
        		carrier : 'upsdp',
        		shipToAddress : {
        			 	"name" : " 1301 NORTH ILLINOIS AVE., HARRISBURG, AZ",
        		        "storeFrontName" : null,
        		        "addressLine1" : " 1301 NORTH ILLINOIS AVE.",
        		        "addressLine2" : null,
        		        "houseNumber" : null,
        		        "city" : "HARRISBURG",
        		        "stateFullName" : null,
        		        "province" : null,
        		        "county" : null,
        		        "district" : null,
        		        "country" : "USA",
        		        "countryIsoCode" : null,
        		        "postalCode" : "72432-3021",
        		        "zoneId" : null,
        		        "zoneName" : null,
        		        "lbsIdentifierFlag" : null,
        		        "region" : "AR",
        		        "latitude" : null,
        		        "longitude" : null,
        		        "lbsGridX" : null,
        		        "lbsGridY" : null,
        		        "account" : null,
        		        "assets" : null,
        		        "soldToNumber" : null,
        		        "addressCleansedFlag" : null,
        		        "physicalLocation1" : null,
        		        "physicalLocation2" : null,
        		        "physicalLocation3" : null,
        		        "id" : null,
        		        "state" : "AZ"
        		} ,
        		contents : [{
        			quantity : '2',
        			partNumber : '1-1234',
        			partType : 'Yellow Cartridge',
        			description: 'Cs Corp EA Yel Tnr Cart'
        		},
        		{
        			quantity : '3',
        			partNumber : '1-5667',
        			partType : 'Magenta Cartridge',
        			description: 'Cs Corp EA Yel Tnr Cart'
        		},
        		{
        			quantity : '2',
        			partNumber : '1-TxGH',
        			partType : 'Black Cartridge',
        			description: 'Cs Corp EA Yel Tnr Cart'
        		},
        		{
        			quantity : '2',
        			partNumber : '1-XYZ',
        			partType : 'Green Cartridge',
        			description: 'Cs Corp EA Yel Tnr Cart'
        		}]
        	}];
    	*/		updateShipments();
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

