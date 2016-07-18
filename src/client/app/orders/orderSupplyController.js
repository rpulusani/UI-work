

angular.module('mps.orders')
.controller('OrderSupplyController', [
    'grid',
    '$scope',
    '$rootScope',
    'OrderItems',
    'PersonalizationServiceFactory',
    '$location',
    'FormatterService',
    'Devices',
    'AssetPartsFactory',
    '$q',
    'uiGridConstants',
    'OrderRequest',
    'AgreementFactory',
    'OrderControllerHelperService',
    'ContractFactory','BlankCheck',
    function(
        GridService,
        $scope,
        $rootScope,
        OrderItems,
        Personalize,
        $location,
        formatter,
        Devices,
        AssetParts,
        $q,
        uiGridConstants,
        Orders,
        Agreement,
        OrderControllerHelper,
        Contracts,BlankCheck
    ){

    var personal = new Personalize($location.url(),$rootScope.idpUser.id);
    $scope.displayOrderContent = false;
    OrderControllerHelper.addMethods(Orders, $scope, $rootScope);
    if (Orders.backFrom !== 'change'){
    	OrderItems.data = [];
        Orders.tempSpace = {
            'catalogCart': {}
        };
    }else{
        OrderItems.columns = 'defaultSet';
    	Orders.backFrom = '';
    }
    
    $scope.gridLoading = true;
    $scope.maxQuantity = 0;
    
    if(Devices.item){
        
        if(Devices.getRelationship('agreement',Devices.item) !== undefined){
	           if(!$rootScope.currentAccount){
	             	$rootScope.currentAccount = {};
	           }
        	   $rootScope.currentAccount.accountId = Devices.item._embedded.account.accountId; 
               $rootScope.currentAccount.accountLevel = 'siebel';
               Agreement.params = {
               		assetFlag : true,
               		assetId : Devices.item.id,
               		type : 'SUPPLIES'
               };
               Devices.getAdditional(Devices.item,Agreement,'agreement').then(function(){
               	
               	Orders.tempSpace.catalogCart.agreement = Agreement.item;
               	$scope.supplyMaxQuantity = (Orders.tempSpace.catalogCart.agreement.supplyMaxQuantity === 0)?1:Orders.tempSpace.catalogCart.agreement.supplyMaxQuantity;
               	$scope.serviceMaxQuantity = (Orders.tempSpace.catalogCart.agreement.serviceMaxQuantity === 0)?1:Orders.tempSpace.catalogCart.agreement.serviceMaxQuantity;
                 
                  
                   
                   Contracts.params.type =  Agreement.params.type;
                   Agreement.getAdditional(Agreement.item,Contracts,'contracts',true).then(function(){
                   	Orders.tempSpace.catalogCart.contract = Contracts.data[0];            	
                   });
                   
                   
                 
                   	AssetParts.params = {
                       		search : Devices.item.specialUsage,
                       		searchOn : 'specialUsage',
                       		supplyParam: false,
                            serviceParam: false,
							contractNumber: Devices.item.contractNumber
                       };
                 
                   	 if(BlankCheck.checkNotBlank(Orders.tempSpace.catalogCart.agreement.supplyCatalogType)
                       		 && Orders.tempSpace.catalogCart.agreement.supplyCatalogType.toLowerCase().indexOf('supply')!== -1){
                   		 AssetParts.params.supplyParam = true;
                        }
                        if(BlankCheck.checkNotBlank(Orders.tempSpace.catalogCart.agreement.serviceCatalogType)
                       		 && Orders.tempSpace.catalogCart.agreement.serviceCatalogType.toLowerCase().indexOf('service')!== -1){
                       	 AssetParts.params.serviceParam = true;
                        }
                        
                   Devices.getAdditional(Devices.item, AssetParts,'parts').then(function(){
                   	AssetParts.params = {};
                       var Grid = new GridService();
                       $scope.assetParts = AssetParts.data;
                       if (AssetParts.data && AssetParts.data.length > 0) {
                           $scope.displayOrderContent = true;                    
                       }
                       $scope.catalogOptions = {};
                       $scope.catalogOptions.onRegisterAPI = Grid.getGridActions($scope,
                                       AssetParts, personal,'catalogAPI');
                       Grid.setGridOptionsName('catalogOptions');
                       $scope.catalogOptions.showBookmarkColumn = false;
                       $scope.catalogOptions.enableRowHeaderSelection = false;
                       $scope.catalogOptions.enableFullRowSelection = false;
                       $scope.hideShowPriceColumn(AssetParts);
                       AssetParts.getThumbnails();
                       $q.all(AssetParts.thumbnails).then(function(){
                       	Grid.display(AssetParts,$scope,personal, 92, function(){
                       		setTimeout(function(){
                       			$scope.gridLoading = false;	
                       		},0);                    	
                           });
                           
                       });
                       $rootScope.currentAccount = undefined;
                   });

               });
        }
     
        
    }

    $scope.selectRow = function(row){
        row.enableSelection = true;
        row.setSelected(true);
    };
    $scope.deSelectRow = function(row){
        row.enableSelection = false;
        row.setSelected(false);
    };

    $scope.removeItemRow = function(item){
       var row = $scope.catalogAPI.gridApi.grid.getRow(item);
       $scope.deSelectRow(row);
    };

    $scope.isAdded = function(item){
        var added = false;

        for(var i = 0; i < OrderItems.data.length; ++i){
            if(item.itemNumber === OrderItems.data[i].itemNumber && item.billingModel === OrderItems.data[i].billingModel){
                added = true;
                break;
            }
        }
        return added;
    };
    $scope.removeFromOrder = function(item){
        var index = -1;
        for(var i = 0; i < OrderItems.data.length; ++i){
            if(item.itemNumber === OrderItems.data[i].itemNumber){
                index = i;
                break;
            }
        }
        OrderItems.data.splice(index,1);
        OrderItems.columns = 'defaultSet';
        $scope.$broadcast('OrderContentRefresh', {
           'OrderItems': OrderItems // send whatever you want
        });
    };
    $scope.addToOrder = function(item){
        var newItem = angular.copy(item);
        newItem.quantity += 1;
        OrderItems.data.push(newItem);
        $scope.orderItems = OrderItems.data;
        OrderItems.columns = 'defaultSet';
        $scope.$broadcast('OrderContentRefresh', {
            'OrderItems': OrderItems // send whatever you want
        });
    };

    function getBillingModels(){
        var bmList = [],
            found = false;
        for(var i = 0; i < OrderItems.data.length; ++i){
            found = false;
            if(OrderItems.data[i].billingModel && bmList.length > 0){
                for(var j = 0; j < bmList.length; ++j){
                    if(OrderItems.data[i].billingModel === bmList[j]){
                        found = true;
                        break;
                    }
                }

            }
            if(!found){
                bmList.push(OrderItems.data[i].billingModel);
            }
        }

        return bmList;
    }

    $scope.submit = function(){
        Orders.newMessage();
        Orders.tempSpace.catalogCart.billingModels = getBillingModels();
        Orders.tempSpace.catalogCart.catalog ='supplies';
        Orders.sourcePage = $location.path(); 
        $location.path(OrderItems.route + '/purchase/review');
    };
    
    $scope.goToSuppliesCatalogCreate = function(){
        Orders.newMessage();
        Orders.tempSpace = {};
        $location.path(Orders.route + '/catalog/supplies');
    };

}]);

