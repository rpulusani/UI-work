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
        'Devices',
        function(
            GridService,
            $scope,
            $rootScope,
            OrderItems,
            Personalize,
            $location,
            formatter,
            Devices
        ){

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

    OrderItems.data = partsChoosen;
    $scope.orderItems = OrderItems.data;
    $scope.submit = function(){
        $location.path(OrderItems.route + '/device/'+ Devices.item.id +'/supplies/new_order/review');
    };



        }]);
});
