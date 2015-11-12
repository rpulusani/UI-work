define(['angular', 'deviceManagement'], function(angular) {
    'use strict';
    angular.module('mps.deviceManagement')
    .factory('Orders', ['$translate',
        function($translate) {
            console.log(123123213);
            var Orders = function() {
                this.columns = {
                    defaultSet: []
                };
            };

            Orders.prototype.getColumnDefinition = function(type) {
                this.columns = {
                    'defaultSet':[
                        {'name': $translate.instant('ORDER_MGT.DATE'), 'field': 'date'},
                        {'name': $translate.instant('ORDER_MGT.ORDER_NO'), 'field':'orderNumber'},
                        {'name': $translate.instant('ORDER_MGT.STATUS'), 'field':'status'},
                        {'name': $translate.instant('ORDER_MGT.PRIMARY_CONTACT'), 'field':'primaryContact'},
                        {'name': $translate.instant('ORDER_MGT.DESCRIPTION'), 'field':'description'}
                    ],
                    bookmarkColumn: 'getBookMark()'
                };

                return this.columns;
            };

            return new Orders();
        }
    ]);
});
