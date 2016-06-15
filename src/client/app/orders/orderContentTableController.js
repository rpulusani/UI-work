angular.module('mps.orders')
.controller('OrderContentTableController', [
    '$scope',
    '$translate',
    'grid',
    'PersonalizationServiceFactory',
    'HATEOASFactory',
    '$location',
    '$rootScope',
    function($scope,$translate,GridService,Personalize,HATEOASFactory,$location,$rootScope){
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
        		}
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
        //$scope.calculate();
    
}]);

