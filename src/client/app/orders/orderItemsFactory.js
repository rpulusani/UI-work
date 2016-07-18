

angular.module('mps.orders')
.factory('OrderItems', ['serviceUrl', '$translate', 'HATEOASFactory', 'FormatterService','$filter','BlankCheck',
    function(serviceUrl, $translate, HATEOASFactory, formatter, $filter,BlankCheck) {

        var OrderItems = {
                serviceName: 'orderItems',
                embeddedName: 'orderItems', //get away from embedded name and move to a function to convert url name to javascript name
                columns: 'defaultSet',
                preventPersonalization: true,
                columnDefs: {
                    defaultSet: [
                        {'name': 'id', 'field': 'itemNumber', visible:false, 'notSearchable': true,  enableCellEdit:false},
                        {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.TXT_GRID_SUPPLIES_TYPE'),
                            'field':'type', enableCellEdit:false},
                        {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.TXT_GRID_ORDER_PART_NUM'),
                            'field':'displayItemNumber', enableCellEdit:false,
                            'cellTemplate': '<span ng-if="!row.entity.childItems">{{row.entity.displayItemNumber}}</span>'+
                                         '<span ng-if="row.entity.childItems && row.entity.childItems.length > 0"> ' +
                                         '<span class="floatL" ng-repeat="part in row.entity.childItems">'+
                                         '{{part.displayItemNumber}}'+ '<span ng-show=" ! $last ">'+'|'+ 
                                         '</span></span> </span>'
                        },
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
                        'field':'displayItemNumber', enableCellEdit:false,
                        'cellTemplate': '<span ng-if="!row.entity.childItems">{{row.entity.displayItemNumber}}</span>'+
                                         '<span ng-if="row.entity.childItems && row.entity.childItems.length > 0"> ' +
                                         '<span class="floatL" ng-repeat="part in row.entity.childItems">'+
                                         '{{part.displayItemNumber}}'+ '<span ng-show=" ! $last ">'+'|'+ 
                                         '</span></span> </span>'
                    },
                    {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.TXT_GRID_ORDER_PRICE'),
                        'field':'priceCurrencyFormat()', enableCellEdit:false},
                    {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.TXT_GRID_ORDER_QUANTITY'), 'field':'quantity',
                            width: '125',
                            type: 'number',
                            enableCellEdit:false
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
                        'field':'displayItemNumber', enableCellEdit:false,
                        'cellTemplate': '<span ng-if="!row.entity.childItems">{{row.entity.displayItemNumber}}</span>'+
                                         '<span ng-if="row.entity.childItems && row.entity.childItems.length > 0"> ' +
                                         '<span class="floatL" ng-repeat="part in row.entity.childItems">'+
                                         '{{part.displayItemNumber}}'+ '<span ng-show=" ! $last ">'+'|'+ 
                                         '</span></span> </span>'
                    },
                    {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.TXT_GRID_ORDER_PRICE'),
                        'field':'priceCurrencyFormat()', enableCellEdit:false},
                    {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.TXT_GRID_ORDER_QUANTITY'), 'field':'quantity',
                            width: '125',
                            type: 'number',
                            enableCellEdit:false
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
                formatTax: function(tax){
                	return formatter.formatPercent(tax);  
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
                },
                groupPartsByBillingModel : function(){
                	var partsBilling = {};
                	self = this;
                    for(var i = 0; i < self.data.length; ++i){
                        if (partsBilling[self.data[i].billingModel] === undefined){
                        	partsBilling[self.data[i].billingModel] = [];
                        }
                        partsBilling[self.data[i].billingModel].push(self.data[i]);
                    }
                    return partsBilling;
                },
                buildGroupedSrArray: function(orderItem,catalog){
                    var arrayResult = [];
                    for(var i = 0; i < orderItem.length; ++i){
                        var item = {
                            'itemNumber': catalog === 'accessories'? orderItem[i].displayItemNumber:orderItem[i].itemNumber,
                            'displayItemNumber': orderItem[i].displayItemNumber,
                             'quantity': orderItem[i].quantity,
                             'price': orderItem[i].price,
                             'type': orderItem[i].type,
                             'totalLinePrice' : orderItem[i].totalLinePrice,
                             'taxAmount' : orderItem[i].tax === undefined ? 0.0:orderItem[i].tax
                             
                        };
                        arrayResult.push(item);
                    }
                    return arrayResult;
                },
                checkSameBillingModel: function(){
                	var self = this,model = self.data[0].billingModel;
                	for(var i = 1; i < self.data.length; ++i){
                		if(model !== self.data[i].billingModel){
                			return false;
                		}
                	}
                	return true;
                }
        };
    return  new HATEOASFactory(OrderItems);
}]);

