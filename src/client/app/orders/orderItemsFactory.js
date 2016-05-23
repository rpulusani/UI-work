

angular.module('mps.orders')
.factory('OrderItems', ['serviceUrl', '$translate', 'HATEOASFactory', 'FormatterService','$filter',
    function(serviceUrl, $translate, HATEOASFactory, formatter, $filter) {

        var OrderItems = {
                serviceName: 'orderItems',
                embeddedName: 'orderItems', //get away from embedded name and move to a function to convert url name to javascript name
                columns: 'defaultSet',
                columnDefs: {
                    defaultSet: [
                        {'name': 'id', 'field': 'itemNumber', visible:false, 'notSearchable': true,  enableCellEdit:false},
                        {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.TXT_GRID_SUPPLIES_TYPE'),
                            'field':'type', enableCellEdit:false},
                        {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.TXT_GRID_ORDER_PART_NUM'),
                            'field':'displayItemNumber', enableCellEdit:false},
                        {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.TXT_GRID_ORDER_PRICE'),
                            'field':'priceCurrencyFormat()', enableCellEdit:false},
                        {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.TXT_GRID_ORDER_QUANTITY'), 'field':'quantity',
                               'cellTemplate':'<div class="form__field" ng-class="{\'form__field--has-alert\': row.entity.quantityError}">' +
                                        '<input  type="number" min="1"  ng-model="row.entity.quantity" ng-change="grid.appScope.editOnChange(row)"/>' +
                                    '</div>',
                                'editableCellTemplate':'<div class="form__field" ng-class="{\'form__field--has-alert\': row.entity.quantityError}">' +
                                        '<input type="number" min="1"  ng-model="row.entity.quantity" ng-change="grid.appScope.editOnChange(row)"/>' +
                                    '</div>',
                                width: '125',
                                enableCellEdit:true,
                                enableCellEditOnFocus: true,
                                type: 'number'
                        },
                        {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.TXT_ORDER_SUBTOTAL'),
                            'cellClass': 'text--semi-bold',
                            'field':'itemSubTotal()',
                            enableCellEdit:false
                        },
                        {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.BTN_GRID_SUPPLIES_REMOVE'),
                            'field':'',
                            'cellTemplate':'<div style="text-align:center">' +
                                '<a href="#" ng-click="grid.appScope.removeItem(row);" ' +
                            '><span class="icon icon-16 icon-psw-delete"></span></a>' +
                            '</div>',
                            width: '100',
                            enableCellEdit:false
                        }
                    ],
                  pruchaseSet: [
                    {'name': 'id', 'field': 'itemNumber', visible:false, 'notSearchable': true,  enableCellEdit:false},
                    {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.TXT_GRID_SUPPLIES_TYPE'),
                        'field':'type', enableCellEdit:false},
                    {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.TXT_GRID_ORDER_PART_NUM'),
                        'field':'displayItemNumber', enableCellEdit:false},
                    {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.TXT_GRID_ORDER_PRICE'),
                        'field':'priceCurrencyFormat()', enableCellEdit:false},
                    {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.TXT_GRID_ORDER_QUANTITY'), 'field':'quantity',
                            width: '125',
                            type: 'number'
                    },
                    {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.TXT_ORDER_SUBTOTAL'),
                        'cellClass': 'text--semi-bold',
                        'field':'itemSubTotal()',
                        enableCellEdit:false
                    }
                  ],
                  pruchaseSubmitSet: [
                    {'name': 'id', 'field': 'itemNumber', visible:false, 'notSearchable': true,  enableCellEdit:false},
                    {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.TXT_ORDER_NUMBER'),
                        'field':'', 
                        'cellTemplate':'<div ng-bind="grid.appScope.orderId"></div>',
                        enableCellEdit:false},
                    {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.TXT_GRID_SUPPLIES_TYPE'),
                        'field':'type', enableCellEdit:false},
                    {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.TXT_GRID_ORDER_PART_NUM'),
                        'field':'displayItemNumber', enableCellEdit:false},
                    {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.TXT_GRID_ORDER_PRICE'),
                        'field':'priceCurrencyFormat()', enableCellEdit:false},
                    {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.TXT_GRID_ORDER_QUANTITY'), 'field':'quantity',
                            width: '125',
                            type: 'number'
                    },
                    {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.TXT_ORDER_SUBTOTAL'),
                        'cellClass': 'text--semi-bold',
                        'field':'itemSubTotal()',
                        enableCellEdit:false
                    }
                  ]
                },


                functionArray: [
                {
                        name: 'priceCurrencyFormat',
                        functionDef: function(){
                            if (this.billingModel === 'USAGE_BASED_BILLING'){
                                return $translate.instant('ORDER_MAN.COMMON.TEXT_INCLUDED_IN_LEASE');
                            } else {
                                return formatter.formatCurrency(this.price);
                            }
                        }
                    },
                    {
                        name: 'itemSubTotal',
                        functionDef: function(){
                        	if (this.billingModel === 'USAGE_BASED_BILLING'){
                        		return '-';
                        	} else {
                        		var subTotal = formatter.itemSubTotal(this.price, this.quantity);
                                return formatter.formatCurrency(subTotal);	
                        	}
                            
                        }
                    }

                ],

                route: '/orders',
                calculateSubTotal: function(){
                    var self = this,
                    subTotal = 0.0;
                    subTotal = self.subTotal();
                    return formatter.formatCurrency(subTotal);
                },
                getTax: function(){
                    var tax = 0.0;
                    // call out to some service
                    return tax;
                },
                formatTax: function(){
                    var self = this;
                    var tax = self.getTax();
                    return formatter.formatPercentage(tax);
                },
                subTotal: function(){
                    var self = this,
                    subTotal = 0.0;
                    for(var i = 0; i < self.data.length; ++i){
                        var lineTotal = formatter.itemSubTotal(self.data[i].price, self.data[i].quantity);
                        subTotal += lineTotal;
                    }
                    return subTotal;
                },
                calculateTotal: function(){
                   var self = this,
                    subTotal = 0.0,
                    total,
                    tax = self.getTax();
                    subTotal = self.subTotal();
                    total = subTotal + (subTotal * tax);
                    return formatter.formatCurrency(total);
                },
                buildSrArray: function(){
                    var arrayResult = [],
                    self = this;
                    for(var i = 0; i < self.data.length; ++i){
                        var item = {
                            'itemNumber': self.data[i].itemNumber,
                            'displayItemNumber': self.data[i].displayItemNumber,
                             'quantity': self.data[i].quantity,
                             'price': self.data[i].price,
                             'type': self.data[i].type
                        };
                        arrayResult.push(item);
                    }
                    return arrayResult;
                }
        };
    return  new HATEOASFactory(OrderItems);
}]);

