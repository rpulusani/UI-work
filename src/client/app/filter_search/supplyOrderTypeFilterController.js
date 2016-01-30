define(['angular', 'filterSearch'], function(angular) {
    'use strict';
    angular.module('mps.filterSearch')
    .controller('SupplyOrderTypeFilterController', ['$scope', '$translate', 'OrderTypes',
        function($scope, $translate, OrderTypes) {
            var option =  {
                'params': {
                    category: 'SUPPLY_ORDER'
                }
            };

            OrderTypes.get(option).then(function (response) {
                if (OrderTypes.item && OrderTypes.item._embedded 
                    && OrderTypes.item._embedded.requestTypes) {
                    $scope.supplyOrderTypes = OrderTypes.item._embedded.requestTypes;
                }
            });

            $scope.$watch('supplyType', function(supplyType) {
                if (supplyType) {
                    $scope.params['type'] = supplyType;
                    $scope.filterDef($scope.params, ['status', 'from', 'to', 'bookmark']);
                }
            });
        }
    ]);
});