define(['angular', 'order', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.orders')
    .controller('OrderSupplyController', [
        'grid',
        '$scope',
        '$rootScope',
        'OrderItems',
        'PersonalizationServiceFactory',
        '$location',
        function(
            GridService,
            $scope,
            $rootScope,
            OrderItems,
            Personalize,
            $location
        ){
        var partsChoosen = [
            {
                partNumber: 'cat',
                type: 'Sasha',
                price: '0.00',
                quantity: 1
            },
            {
                partNumber: 'cat',
                type: 'Sasha',
                price: '0.00',
                quantity: 1
            }

        ];
        var Grid = new GridService();
        var personal = new Personalize($location.url(),$rootScope.idpUser.id);
        $scope.orderSummaryGridOptions = {};
        Grid.setGridOptionsName('orderSummaryGridOptions');
        $scope.orderSummaryGridOptions.onRegisterAPI = Grid.getGridActions($rootScope,
                        OrderItems, personal);
        OrderItems.data = partsChoosen;
        Grid.display(OrderItems,$scope,personal, 45);

    }]);

});
