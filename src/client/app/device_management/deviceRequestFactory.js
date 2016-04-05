
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
                        {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.TXT_GRID_ORDER_HIST_DATE'), 'field': 'date'},
                        {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.TXT_GRID_ORDER_HIST_NUM'), 'field':'requestNumber'},
                        {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.TXT_GRID_ORDER_HIST_STATUS'), 'field':'status'},
                        {'name': $translate.instant('ORDER_MAN.SUPPLY_ORDER_SUBMITTED.TXT_ORDER_CONTACT'), 'field':'primaryContact'},
                        {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_OVERVIEW.TXT_CONTACT_EMAIL'), 'field':'primaryContactEmail'},
                        {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_OVERVIEW.TXT_CONTACT_PHONE'), 'field':'primaryContactPhone'}
                ],
                bookmarkColumn: 'getBookMark()'
            };

            return this.columns;
        };

        return new Requests();
    }
]);
