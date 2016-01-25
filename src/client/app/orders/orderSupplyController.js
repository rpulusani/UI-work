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
    if(!OrderItems.data){
            OrderItems.data = [];
    }

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
            Grid.display(AssetParts,$scope,personal, 80);
        });
    });

    $scope.addToOrder = function(item){
        OrderItems.data.push(item);
        $scope.orderItems = OrderItems.data;
        $scope.$broadcast('OrderContentRefresh', {
            'OrderItems': OrderItems.data // send whatever you want
        });
    };


    $scope.submit = function(){
        $location.path(OrderItems.route + '/device/'+ Devices.item.id +'/supplies/new_order/review');
    };



        }]);
});
