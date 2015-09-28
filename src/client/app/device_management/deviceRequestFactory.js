define(['angular', 'deviceManagement'], function(angular) {
    'use strict';
    angular.module('mps.deviceManagement')
    .factory('Requests', ['$translate',
        function($translate) {
            var Requests = function() {
                this.columns = {
                    defaultSet: []
                };
            };

            Requests.prototype.getColumnDefinition = function(type) {
                this.columns = {
                    'defaultSet':[
                        {'name': $translate.instant('ORDER_MGT.DATE'), 'field': 'date'},
                        {'name': $translate.instant('ORDER_MGT.ORDER_NO'), 'field':'requestNumber'},
                        {'name': $translate.instant('ORDER_MGT.STATUS'), 'field':'status'},
                        {'name': $translate.instant('ORDER_MGT.PRIMARY_CONTACT'), 'field':'primaryContact'},
                        {'name': $translate.instant('ORDER_MGT.PRIMARY_EMAIL'), 'field':'primaryContactEmail'},
                        {'name': $translate.instant('ORDER_MGT.PRIMARY_PHONE'), 'field':'primaryContactPhone'}
                    ],
                    bookmarkColumn: 'getBookMark()'
                };

                return this.columns;
            };

            return new Requests();
        }
    ]);
});
