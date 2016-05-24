

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
    if($scope.editable === "true" || $scope.editable === true){
        $scope.showEmpty = true;
    }else{
        $scope.showEmpty = false;
    }

    if($scope.taxable === "true" || $scope.taxable === true){
        $scope.showTax = true;
    }else{
        $scope.showTax = false;
    }

    $scope.$watch($scope.taxable, function(){
        $scope.$broadcast('OrderContentRefresh', {'OrderItems':OrderItems});
    });

    $scope.$watch($scope.ordernbr, function(){
        $scope.orderId = $scope.ordernbr;
    });

    $scope.removeItem  = function(row){
        var index = $scope.orderSummaryGridOptions.data.indexOf(row.entity);
        $scope.orderSummaryGridOptions.data.splice(index,1);
        OrderItems.data = $scope.orderSummaryGridOptions.data;
        if(OrderItems.data.length === 0){
            if($scope.configure && $scope.configure.actions){
                $scope.configure.actions.disabled = true;
            }
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
        if($scope.configure && $scope.configure.actions){
            $scope.configure.actions.disabled = true;
        }
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
            typeof $scope.submitAction === "function" && OrderItems.data.length > 0){
                $scope.submitAction();
        }
    };
    $scope.$on('OrderCatalogSubmit', function (event, service) {
        $scope.submit();
    });
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
        if($scope.maxQuantity !== 'undefined' && row.entity.quantity > $scope.maxQuantity && index === -1){
            message = {
              partNumber: row.entity.displayItemNumber,
              maxQuantity: $scope.maxQuantity,
              quantity: row.entity.quantity,
              key: 'DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.MAX_QTY_VALIDATION'
            };

            $scope.validationMessages.push(message);
            row.entity.quantityError = true;
            justAdded = true;
        }else if($scope.maxQuantity !== 'undefined' && row.entity.quantity <=  $scope.maxQuantity && index > -1){
            $scope.validationMessages.splice(index,1);
            row.entity.quantityError = false;
        }else if(index > -1){
            message = {
              partNumber: row.entity.displayItemNumber,
              maxQuantity: $scope.maxQuantity,
              quantity: row.entity.quantity,
              key: 'DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.MAX_QTY_VALIDATION'
            };
            $scope.validationMessages[index] = message;
        }
        $scope.calculate();
    };

    $scope.calculate = function(){
        var subTotal = 0.0;
        if(OrderItems && OrderItems.data){
            for(var i = 0; i < OrderItems.data.length; ++i){
                var lineTotal = formatter.itemSubTotal(OrderItems.data[i].price,
                    OrderItems.data[i].quantity);
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
            if(service.OrderItems.length){
                OrderItems.data = service.OrderItems;
            }else{
                OrderItems = service.OrderItems;
            }
            Grid.display(OrderItems,$scope,personal, 48);
            $scope.calculate();
        }
    });
    $scope.calculate();

}]);

