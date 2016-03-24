

angular.module('mps.pageCount')
.factory('PageCountService', ['serviceUrl', '$translate', 'HATEOASFactory', 'FormatterService',
    function(serviceUrl, $translate, HATEOASFactory, formatter) {
        var PageCountService = {
                serviceName: 'meter-reads',
                embeddedName: 'assetMeterReads', //get away from embedded name and move to a function to convert url name to javascript name
                columns: 'defaultSet',
                columnDefs: {
                    defaultSet: [
                        {'name': 'id', 'field': 'assetId', visible:false, 'notSearchable': true},
                        {'name': $translate.instant('DEVICE_MGT.SERIAL_NO'), 'field':'serialNumber',
                          'cellTemplate':'<div>' +
                                        '<a href="#" ng-click="grid.appScope.view(row.entity);" ' +
                                        '>{{row.entity.serialNumber}}</a>' +
                                    '</div>'
                        },
                        {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE.TXT_PRODUCT_MODEL'), 'field': 'productModel'},
                        {'name': $translate.instant('DEVICE_MAN.DEVICE_PAGE_COUNTS.TXT_PAGE_COUNT_LAST_READ_DATE'), 'field': 'getFormattedLastReadDate()', 'notSearchable': true},
                        {'name': $translate.instant('DEVICE_MAN.DEVICE_PAGE_COUNTS.TXT_PAGE_COUNT_CURRENT_READ_DATE'), 'field': 'getFormattedTodaysDate()', 'notSearchable': true,
                         'cellTemplate':'<div class="ui-grid-cell-contents">' +
                                            '<input datepicker type="text" ng-model="row.entity.currentReadDate" date-val="row.entity.currentReadDate" time="true" time-interval="60"/> ' +
                                        '</div>',
                        enableCellEdit: true,
                        width: '150',
                        enableCellEditOnFocus: true
                        },
                        {'name': $translate.instant('DEVICE_MAN.DEVICE_PAGE_COUNTS.TXT_PAGE_COUNT_PRIOR_LIFETIME_PAGE_COUNT'), 'field':'ltpcValue', 'notSearchable': true, width: '100',},
                        {'name': $translate.instant('DEVICE_MAN.DEVICE_PAGE_COUNTS.TXT_PAGE_COUNT_NEW_LIFETIME_PAGE_COUNT'), 'field':'status', 'notSearchable': true,
                        'cellTemplate':'<div>' +
                                        '<input type="number" ng-model="row.entity.newLtpcCount" ' +
                                        '/>' +
                                    '</div>',
                        width: '150',
                        enableCellEdit: true,
                        enableCellEditOnFocus: true},
                        {'name': $translate.instant('DEVICE_MAN.DEVICE_PAGE_COUNTS.TXT_PAGE_COUNT_PRIOR_COLOR_COUNT'), 'field':'colorValue', 'notSearchable': true},
                        {'name': $translate.instant('DEVICE_MAN.DEVICE_PAGE_COUNTS.TXT_PAGE_COUNT_NEW_COLOR_COUNT'), 'field':'', 'notSearchable': true,
                         'cellTemplate':'<div ng-if="row.entity.colorMeterReadId">' +
                                        '<input type="number" ng-model="row.entity.newColorCount" ' +
                                        '/>' +
                                    '</div>',
                        enableCellEdit: true,
                        width: '150',
                        enableCellEditOnFocus: true
                        },
                        {'name': 'Save', 'field': 'assetId',
                         'cellTemplate':'<div>' +
                                '<a href="" ng-click="grid.appScope.save(row.entity);" ' +
                            '>Save</a>' +
                        '</div>', 'notSearchable': true}
                    ],
                },
                functionArray: [
                    {
                        name: 'getFormattedLastReadDate',
                        functionDef: function(){
                            return formatter.formatDate(this.lastReadDate);
                        }
                    },
                    {
                        name: 'getFormattedTodaysDate',
                        functionDef: function(){
                            return formatter.formatDate(new Date);
                        }
                    }
                ],
                url: serviceUrl + 'meter-reads',
                route: '/page_count'
        };

    return  new HATEOASFactory(PageCountService);
}]);

