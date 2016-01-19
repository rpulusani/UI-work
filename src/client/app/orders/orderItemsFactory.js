define(['angular', 'order', 'hateoasFactory.serviceFactory', 'utility.formatters'], function(angular) {
    'use strict';
    angular.module('mps.orders')
    .factory('OrderItems', ['serviceUrl', '$translate', 'HATEOASFactory', 'FormatterService',
        function(serviceUrl, $translate, HATEOASFactory, formatter) {
            var OrderItems = {
                    serviceName: 'orderItems',
                    embeddedName: 'orderItems', //get away from embedded name and move to a function to convert url name to javascript name
                    columns: 'defaultSet',
                    columnDefs: {
                        defaultSet: [
                            {'name': 'id', 'field': 'id', visible:false, 'notSearchable': true},
                            {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.TXT_GRID_SUPPLIES_TYPE'),
                                'field':'type'},
                            {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.TXT_GRID_ORDER_PART_NUM'),
                                'field':'partNumber'},
                            {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.TXT_GRID_ORDER_PRICE'), 'field':'price'},
                            {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.TXT_GRID_ORDER_QUANTITY'), 'field':'quantity'},
                            {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.TXT_ORDER_SUBTOTAL'), 'field':''},
                            {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.BTN_GRID_SUPPLIES_UPDATE'), 'field':'',
                                'cellTemplate':'<div>' +
                                            '<a href="#" ng-click="grid.appScope.updateItemTotal(row.entity);" ' +
                                            '><span class="icon icon--feature icon--refresh"></span></a>' +
                                        '</div>'},
                            {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.BTN_GRID_SUPPLIES_REMOVE'), 'field':'',
                                'cellTemplate':'<div>' +
                                    '<a href="#" ng-click="grid.appScope.removeItem(row.entity);" ' +
                                '><span class="icon icon--feature icon--stop-cancel"></span></a>' +
                            '</div>'}
                        ]
                    },

                    functionArray: [


                    ],

                    route: '/orders'
            };

        return  new HATEOASFactory(OrderItems);
    }]);
});
