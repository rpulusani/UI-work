define(['angular', 'filterSearch'], function(angular) {
    'use strict';
    angular.module('mps.filterSearch')
    .controller('OrderStatusFilterController', ['$scope', '$translate', 'OrderStatus',
        function($scope, $translate, OrderStatus) {
            $scope.selectedStatusList = [];
            $scope.orderStatuses = [];
            OrderStatus.get().then(function (response) {
                if (OrderStatus.item && OrderStatus.item._embedded 
                    && OrderStatus.item._embedded.requestStatuses) {
                    var statusList = OrderStatus.item._embedded.requestStatuses;
                    for (var i=0; i<statusList.length; i++) {
                        var tempStatus = {};
                        tempStatus.name = statusList[i];
                        tempStatus.selected = false;
                        $scope.orderStatuses.push(tempStatus);
                    }
                }
            });

            $scope.orderStatusFilter = function(orderStatus){
                console.log('orderStatus', orderStatus);
                //console.log('$scope.orderStatusCheck', $scope.orderStatusCheck.selected);
                if (orderStatus.selected) {
                    $scope.selectedStatusList.push(orderStatus.name);
                } else {
                    if($scope.selectedStatusList.indexOf(orderStatus.name) !== -1) {
                        $scope.selectedStatusList.splice($scope.selectedStatusList.indexOf(orderStatus.name), 1);
                    }
                }
                if($scope.selectedStatusList && $scope.filterDef && typeof $scope.filterDef === 'function'){
                    var orderStatusList = $scope.selectedStatusList.join();
                    if ($scope.selectedStatusList.length > 0) {
                        $scope.params['status'] = orderStatusList;
                        $scope.filterDef($scope.params,['from', 'to', 'bookmark']);
                    } else {
                        $scope.params = {};
                        $scope.filterDef($scope.params,['status', 'from', 'to', 'bookmark']);
                    }
                }
            };
        }
    ]);
});