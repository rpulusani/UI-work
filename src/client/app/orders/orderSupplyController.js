

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
        OrderControllerHelper
    ){

    var personal = new Personalize($location.url(),$rootScope.idpUser.id);
    $scope.displayOrderContent = false;
    OrderControllerHelper.addMethods(Orders, $scope, $rootScope);
    OrderItems.data = [];
    Orders.tempSpace = {
        'catalogCart': {}
    };
    if(Devices.item){
        Agreement.params.type = 'SUPPLIES';
        Devices.getAdditional(Devices.item,Agreement,'agreement').then(function(){
            Orders.tempSpace.catalogCart.agreement = Agreement.item;
            Devices.getAdditional(Devices.item, AssetParts,'parts').then(function(){
                var Grid = new GridService();
                $scope.assetParts = AssetParts.data;
                if (AssetParts.item && AssetParts.item.page && AssetParts.item.page.totalElements > 0) {
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
                    Grid.display(AssetParts,$scope,personal, 92);
                });
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
        Orders.tempSpace.catalogCart.contract = {
            'id': Devices.item.contractNumber
        };
        console.log(Orders.tempSpace);
        $location.path(OrderItems.route + '/purchase/review');
    };

}]);

