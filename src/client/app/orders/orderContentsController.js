define(['angular', 'order', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.orders')
    .controller('OrderContentsController', [
        'grid',
        '$scope',
        '$rootScope',
        'OrderItems',
        'PersonalizationServiceFactory',
        '$location',
        'FormatterService',
        function(
            GridService,
            $scope,
            $rootScope,
            OrderItems,
            Personalize,
            $location,
            formatter
        ){
        $scope.validationMessages = [];

        if($scope.editable === "true"){
            $scope.showEmpty = true;
        }else{
            $scope.showEmpty = false;
        }

        $scope.removeItem  = function(row){
            var index = $scope.orderSummaryGridOptions.data.indexOf(row.entity);
            $scope.orderSummaryGridOptions.data.splice(index,1);
            OrderItems.data = $scope.orderSummaryGridOptions.data;
            if(OrderItems.data.length === 0){
                $scope.datasource = [];
                $scope.validationMessages =[];
                $scope.$broadcast('OrderContentRefresh', {
                    'OrderItems': [] // send whatever you want
                });
            }
            $scope.calculate();
        };
        $scope.removeAllItems  = function(){
            $scope.orderSummaryGridOptions.data = [];
            OrderItems.data = $scope.orderSummaryGridOptions.data;
            $scope.calculate();
            $scope.datasource = [];
            $scope.validationMessages =[];
            $scope.$broadcast('OrderContentRefresh', {
                'OrderItems': [] // send whatever you want
            });
        };

        function getValidationMessageIndex(row){
            var index = -1;
            for(var i = 0; i < $scope.validationMessages.length; ++i){
                if($scope.validationMessages[i].partNumber == row.entity.displayItemNumber){
                    index = i;
                    break;
                }
            }
            return index;
        }
        $scope.submit = function(){
            if($scope.validationMessages.length === 0 &&
                $scope.submitAction !== null &&
                typeof $scope.submitAction === "function"){
                    $scope.submitAction();
            }
        };
        function getDataRow(entity){
            var row;
            if(OrderItems && OrderItems.data){
                for(var i =0; i < OrderItems.data.length; ++i){
                    if(OrderItems.data[i].itemNumber === entity.itemNumber){
                        row = OrderItems.data[i];
                        break;
                    }
                }
            }

            return row;
        }
        $scope.editOnChange = function(row){
            var justAdded = false;
            var message;
            var index = getValidationMessageIndex(row);
            var dataRow = getDataRow(row.entity);
            if(dataRow){
                dataRow.quantity = row.entity.quantity;
            }
            if(row.entity.maxQuantity && row.entity.quantity > row.entity.maxQuantity && index === -1){
                message = {
                  partNumber: row.entity.displayItemNumber,
                  maxQuantity: row.entity.maxQuantity,
                  quantity: row.entity.quantity
                };

                $scope.validationMessages.push(message);
                row.entity.quantityError = true;
                justAdded = true;
            }else if(row.entity.maxQuantity && row.entity.quantity <=  row.entity.maxQuantity && index > -1){
                $scope.validationMessages.splice(index,1);
                row.entity.quantityError = false;
            }else if(index > -1){
                message = {
                  partNumber: row.entity.displayItemNumber,
                  maxQuantity: row.entity.maxQuantity,
                  quantity: row.entity.quantity
                };
                $scope.validationMessages[index] = message;
            }
            $scope.calculate();
        };

        $scope.calculate = function(){
            var subTotal = 0.0;
            if($scope.orderSummaryGridOptions && $scope.orderSummaryGridOptions.data){
                for(var i = 0; i < $scope.orderSummaryGridOptions.data.length; ++i){
                    var lineTotal = formatter.itemSubTotal($scope.orderSummaryGridOptions.data[i].price,
                        $scope.orderSummaryGridOptions.data[i].quantity);
                    subTotal += lineTotal;
                }
            }
            $scope.subTotal = formatter.formatCurrency(subTotal);
            $scope.tax = OrderItems.formatTax();
            $scope.total = formatter.formatCurrency(subTotal + (subTotal * OrderItems.getTax()));
        };

        $scope.submitDisable = function(){
            var disabled = true;

            if($scope.validationMessages.length === 0 && OrderItems && OrderItems.data && OrderItems.data.length > 0){
                disabled = false;
            }else{
                disabled = true;
            }

            return disabled;
        };
        $scope.$on('OrderContentRefresh', function (event, service) {
            if(service.OrderItems){
                var Grid = new GridService();
                var personal = new Personalize($location.url(),$rootScope.idpUser.id);
                $scope.orderSummaryGridOptions = {};
                $scope.orderSummaryGridOptions.showBookmarkColumn = false;
                Grid.setGridOptionsName('orderSummaryGridOptions');
                $scope.orderSummaryGridOptions.onRegisterAPI = Grid.getGridActions($scope,
                OrderItems, personal);
                OrderItems = service.OrderItems;
                Grid.display(OrderItems,$scope,personal, 48);
                $scope.calculate();
            }
        });
        $scope.calculate();

    }]);

});
