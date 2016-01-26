define(['angular', 'utility.grid', 'order.orderContentsController'], function(angular) {
    'use strict';
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
            $q
        ){

        var personal = new Personalize($location.url(),$rootScope.idpUser.id);
        OrderItems.data = [];

        Devices.getAdditional(Devices.item,AssetParts).then(function(){
            var Grid = new GridService();
            $scope.assetParts = AssetParts.data;
            $scope.catalogOptions = {};
            $scope.catalogOptions.onRegisterAPI = Grid.getGridActions($scope,
                            AssetParts, personal);
            Grid.setGridOptionsName('catalogOptions');
            $scope.catalogOptions.showBookmarkColumn = false;
            AssetParts.getThumbnails();
            $q.all(AssetParts.thumbnails).then(function(){
                Grid.display(AssetParts,$scope,personal, 92);
            });
        });

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
            $scope.$broadcast('OrderContentRefresh', {
               'OrderItems': OrderItems.data // send whatever you want
            });
        };
        $scope.addToOrder = function(item){
            var newItem = angular.copy(item);
            newItem.quantity += 1;
            OrderItems.data.push(newItem);
            $scope.orderItems = OrderItems.data;
            $scope.$broadcast('OrderContentRefresh', {
                'OrderItems': OrderItems.data // send whatever you want
            });
        };


        $scope.submit = function(){
            $location.path(OrderItems.route + '/purchase/review');
        };

    }]);
});
