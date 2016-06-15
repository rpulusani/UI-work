angular.module('mps.orders')
.controller('OrderContentTableController', [
    '$scope',
    '$translate',
    'grid',
    'PersonalizationServiceFactory',
    'HATEOASFactory',
    '$location',
    '$rootScope','FormatterService','BlankCheck',
    function($scope,$translate,GridService,Personalize,HATEOASFactory,$location,$rootScope,formatter,BlankCheck){
        var template = {
        		serviceName: 'orderItems',
                embeddedName: 'orderItems', 
                columns: 'defaultSet',
        		columnDefs: {
        			defaultSet:[
        	        			{'name': 'id', 'field': 'itemNumber', visible:false, 'notSearchable': true,  enableCellEdit:false},
        	                    {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.TXT_GRID_SUPPLIES_TYPE'),
        	                        'field':'type', enableCellEdit:false},
        	                    {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.TXT_GRID_ORDER_PART_NUM'),
        	                        'field':'displayItemNumber', enableCellEdit:false},
        	                    {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.TXT_GRID_ORDER_PRICE'),
        	                        'field':'priceCurrencyFormat()', enableCellEdit:false},
        	                    {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.TXT_GRID_ORDER_QUANTITY'), 'field':'quantity',
        	                            width: '125',
        	                            type: 'number'
        	                    },
        	                    {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.TXT_ORDER_SUBTOTAL'),
        	                        'cellClass': 'text--semi-bold',
        	                        'field':'itemSubTotal()',
        	                        enableCellEdit:false
        	                    }
        	        		]
        		},
        		 functionArray: [
        		                 {
        		                         name: 'priceCurrencyFormat',
        		                         functionDef: function(){
        		                             if (this.billingModel === 'USAGE_BASED_BILLING'){
        		                                 return $translate.instant('ORDER_MAN.COMMON.TEXT_INCLUDED_IN_LEASE');
        		                             } else {
        		                                 return formatter.formatCurrency(this.price);
        		                             }
        		                         }
        		                     },
        		                     {
        		                         name: 'itemSubTotal',
        		                         functionDef: function(){
        		                         	if (this.billingModel === 'USAGE_BASED_BILLING'){
        		                         		return '-';
        		                         	} else {
        		                         		var subTotal = formatter.itemSubTotal(this.price, this.quantity);
        		                                 return formatter.formatCurrency(subTotal);	
        		                         	}
        		                             
        		                         }
        		                     }

        		                 ]
        };
        $scope.orderSummaryGridOptions = new HATEOASFactory(template);
        
        $scope.orderSummaryGridOptions.data = $scope.items;
        
        
    	var Grid = new GridService();
        var personal = new Personalize($location.url(),$rootScope.idpUser.id);
        $scope.orderSummaryGridOptions.showBookmarkColumn = false;
        Grid.setGridOptionsName('orderSummaryGridOptions');
        $scope.orderSummaryGridOptions.onRegisterAPI = Grid.getGridActions($scope,
        $scope.orderSummaryGridOptions, personal);
        Grid.display($scope.orderSummaryGridOptions,$scope,personal, 48);
        $scope.calculate = function(){
        	
        	if($scope.tax !== null && $scope.tax !== undefined){
        		var subTotal = 0.0;
                if($scope.orderSummaryGridOptions.data){
                    for(var i = 0; i < $scope.orderSummaryGridOptions.data.length; ++i){
                        var lineTotal = formatter.itemSubTotal($scope.orderSummaryGridOptions.data[i].price,
                        		$scope.orderSummaryGridOptions.data[i].quantity);
                        subTotal += lineTotal;
                    }
                }
                $scope.subTotal = formatter.formatCurrency(subTotal);
                if (BlankCheck.checkNotNullOrUndefined($scope.tax) &&  $scope.tax !== ''){
                	var taxNumeric = $scope.tax;
                	var amount = subTotal + taxNumeric;
                	$scope.total = formatter.formatCurrency(amount);
                	var taxPercent = (((amount - subTotal)/amount)*100);
                	
                	$scope.displaytax = formatter.formatPercent(taxPercent);
                }	
        	}
            
            
        };
        $scope.calculate();
        
        
    
}]);

