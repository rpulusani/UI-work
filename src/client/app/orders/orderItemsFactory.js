define(['angular', 'order', 'hateoasFactory.serviceFactory', 'utility.formatters'], function(angular) {
    'use strict';
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
                                            '<input  type="number" min="0" ng-model="row.entity.quantity" ng-change="grid.appScope.editOnChange(row)"/>' +
                                        '</div>',
                                    'editableCellTemplate':'<div class="form__field" ng-class="{\'form__field--has-alert\': row.entity.quantityError}">' +
                                            '<input type="number" min="0" ng-model="row.entity.quantity" ng-change="grid.appScope.editOnChange(row)"/>' +
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
                                'cellTemplate':'<div>' +
                                    '<a href="#" ng-click="grid.appScope.removeItem(row);" ' +
                                '><span class="icon icon--feature icon--stop-cancel"></span></a>' +
                                '</div>',
                                width: '100',
                                enableCellEdit:false
                            }
                        ]
                    },

                    functionArray: [
                    {
                            name: 'priceCurrencyFormat',
                            functionDef: function(){
                                return formatter.formatCurrency(this.price);
                            }
                        },
                        {
                            name: 'itemSubTotal',
                            functionDef: function(){
                                var subTotal = formatter.itemSubTotal(this.price, this.quantity);
                                return formatter.formatCurrency(subTotal);
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
                        var tax = 0.07449;
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
                    }
            };
        return  new HATEOASFactory(OrderItems);
    }]);
});
