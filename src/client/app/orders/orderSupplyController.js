

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
    'ContractFactory',
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
        Contracts
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
    	Orders.backFrom = '';
    }
    
    $scope.gridLoading = true;
    $scope.maxQuantity = 0;
    
    if(Devices.item){
        Agreement.params.type = 'SUPPLIES';
        
        if(!$rootScope.currentAccount){
        	$rootScope.currentAccount = {};
        }
        $rootScope.currentAccount.accountId = Devices.item._embedded.account.accountId; 
        $rootScope.currentAccount.accountLevel = 'siebel';
        
        Devices.getAdditional(Devices.item,Agreement,'agreement').then(function(){
            Orders.tempSpace.catalogCart.agreement = Agreement.data[0];
            if(Orders.tempSpace.catalogCart.agreement.length == 1){
            	$scope.maxQuantity = Orders.tempSpace.catalogCart.agreement.maxQuantity;	
            }
            
            Contracts.params.type =  Agreement.params.type;
            Agreement.getAdditional(Agreement.data[0],Contracts,'contracts',true).then(function(){
            	Orders.tempSpace.catalogCart.contract = Contracts.data[0];            	
            });
            
            Devices.getAdditional(Devices.item, AssetParts,'parts').then(function(){
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
            if(item.itemNumber === OrderItems.data[i].itemNumber){
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
        $location.path(OrderItems.route + '/purchase/review');
    };
    
    $scope.goToSuppliesCatalogCreate = function(){
        Orders.newMessage();
        Orders.tempSpace = {};
        $location.path(Orders.route + '/catalog/supplies');
    };

}]);

