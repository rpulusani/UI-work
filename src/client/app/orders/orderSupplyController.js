

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
        Orders
    ){

    var personal = new Personalize($location.url(),$rootScope.idpUser.id);
    OrderItems.data = [];
    if(Devices.item){
        Devices.getAdditional(Devices.item, AssetParts,'parts').then(function(){
            var Grid = new GridService();
            $scope.assetParts = AssetParts.data;
            $scope.catalogOptions = {};
            $scope.catalogOptions.onRegisterAPI = Grid.getGridActions($scope,
                            AssetParts, personal,'catalogAPI');
            Grid.setGridOptionsName('catalogOptions');
            $scope.catalogOptions.showBookmarkColumn = false;
            $scope.catalogOptions.enableRowHeaderSelection = false;
            $scope.catalogOptions.enableFullRowSelection = false;

            AssetParts.getThumbnails();
            $q.all(AssetParts.thumbnails).then(function(){
                Grid.display(AssetParts,$scope,personal, 92);
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


    $scope.submit = function(){
        Orders.newMessage();
        Orders.tempSpace = {};
        $location.path(OrderItems.route + '/purchase/review');
    };

}]);

