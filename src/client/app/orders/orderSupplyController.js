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
        $scope.submitDisable = true;
        var partsChoosen = [
            {
        "itemNumber": "X860H21G",
        "displayItemNumber": "X860H21G",
        "description": "X86x Black Toner Cartridge High Regular",
        "type": "Black Cartridge",
        "billingModel": "Usage Based Billing",
        "agreementId": "1-59XQH2W",
        "contractNumber": "0040000092",
        "maxQuantity": 3,
        "price": 0,
        "quantity": 0
      },
      {
        "itemNumber": "X860H22G",
        "displayItemNumber": "X860H22G",
        "description": "X86x 1-Pack Photoconductor Kit High Regular",
        "type": "Photoconductor Kit 1 Pack",
        "billingModel": "Usage Based Billing",
        "agreementId": "1-59XQH2W",
        "contractNumber": "0040000092",
        "maxQuantity": 3,
        "price": 0,
        "quantity": 0
      },
      {
        "itemNumber": "40X0398",
        "displayItemNumber": "40X0398",
        "description": "X85x SVC Maint Kit, Fuser Kit",
        "type": "Maintenance Kit, Fuser",
        "billingModel": "Usage Based Billing",
        "agreementId": "1-59XQH2W",
        "contractNumber": "0040000092",
        "maxQuantity": 3,
        "price": 13.50,
        "quantity": 0
      },
      {
        "itemNumber": "40X2734",
        "displayItemNumber": "40X2734",
        "description": "X85x SVC Maint Kit, ADF MAINTENANCE",
        "type": "Maintenance Kit, ADF",
        "billingModel": "Usage Based Billing",
        "agreementId": "1-59XQH2W",
        "contractNumber": "0040000092",
        "maxQuantity": 3,
        "price": 0,
        "quantity": 0
      },
      {
        "itemNumber": "25A0013",
        "displayItemNumber": "25A0013",
        "description": "Common 3-Pack Finisher Staples Standard Regular",
        "type": "Staple Pack",
        "billingModel": "Usage Based Billing",
        "agreementId": "1-59XQH2W",
        "contractNumber": "0040000092",
        "maxQuantity": 3,
        "price": 0,
        "quantity": 0
      }
    ];
        $scope.validationMessages = [];
        $scope.removeItem  = function(row){
            var index = $scope.orderSummaryGridOptions.data.indexOf(row.entity);
            $scope.orderSummaryGridOptions.data.splice(index,1);
            OrderItems.data = $scope.orderSummaryGridOptions.data;
            $scope.calculate();
        };
        $scope.removeAllItems  = function(){
            $scope.orderSummaryGridOptions.data = [];
            OrderItems.data = $scope.orderSummaryGridOptions.data;
            $scope.calculate();
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
            if($scope.validationMessages.length === 0){

            }
        };
        $scope.editOnChange = function(row){
            var justAdded = false;
            var index = getValidationMessageIndex(row);
            if(row.entity.maxQuantity && row.entity.quantity > row.entity.maxQuantity && index === -1){
                var message = {
                  partNumber: row.entity.displayItemNumber,
                  maxQuantity: row.entity.maxQuantity
                };

                $scope.validationMessages.push(message);
                row.entity.quantityError = true;
                justAdded = true;
            }else if(row.entity.maxQuantity && row.entity.quantity <=  row.entity.maxQuantity && index > -1){
                $scope.validationMessages.splice(index,1);
                row.entity.quantityError = false;
            }
            $scope.calculate();
            $scope.submitDisable = $scope.validationMessages.length === 0? false: true;
        };

        $scope.calculate = function(){
            var subTotal = 0.0;
            for(var i = 0; i < $scope.orderSummaryGridOptions.data.length; ++i){
                var lineTotal = formatter.itemSubTotal($scope.orderSummaryGridOptions.data[i].price,
                    $scope.orderSummaryGridOptions.data[i].quantity);
                subTotal += lineTotal;
            }
            $scope.subTotal = formatter.formatCurrency(subTotal);
            $scope.tax = OrderItems.formatTax();
            $scope.total = formatter.formatCurrency(subTotal + (subTotal * OrderItems.getTax()));
        };
        var Grid = new GridService();
        var personal = new Personalize($location.url(),$rootScope.idpUser.id);
        $scope.orderSummaryGridOptions = {};
        $scope.orderSummaryGridOptions.showBookmarkColumn = false;
        Grid.setGridOptionsName('orderSummaryGridOptions');
        $scope.orderSummaryGridOptions.onRegisterAPI = Grid.getGridActions($scope,
                        OrderItems, personal);
        OrderItems.data = partsChoosen;
        Grid.display(OrderItems,$scope,personal, 45);
        $scope.calculate();

    }]);

});
