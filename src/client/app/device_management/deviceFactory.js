define(['angular', 'deviceManagement'], function(angular) {
    'use strict';
    angular.module('mps.deviceManagement')
    .factory('Devices', ['serviceUrl', '$translate', '$rootScope', 'HATEOASFactory',
        function(serviceUrl, $translate,$rootScope, HATEOASFactory) {
            var Devices = {
                serviceName: "assets",
                singular: 'asset',
                embeddedName: "assets",
                columns: 'default',
                columnDefs: {
                    defaultSet: [
                        {'name': $translate.instant('DEVICE_MGT.SERIAL_NO'), 'field': 'serialNumber', dynamic: false,
                         'cellTemplate':'<div>' +
                                            '<a href="#" ng-click="grid.appScope.view(row.entity);">{{row.entity.serialNumber}}</a>' +
                                        '</div>'
                        },
                        {'name': $translate.instant('DEVICE_MGT.HOST_NAME'), 'field':'hostName'},
                        {'name': $translate.instant('DEVICE_MGT.PRODUCT_MODEL'), 'field':'productModel'},
                        {'name': $translate.instant('DEVICE_MGT.CUSTOMER_DEVICE_TAG'), 'field':'assetTag'},
                        {'name': $translate.instant('DEVICE_MGT.IP_ADDRESS'), 'field':'ipAddress'},
                        {'name': $translate.instant('ADDRESS.NAME'), 'field':'getAddressName()', 'notSearchable': true},
                        {'name': $translate.instant('LABEL.COST_CENTER'), 'field':'costCenter', visible: false},
                        {'name': $translate.instant('ADDRESS.BUILDING_NAME'), 'field':'physicalLocation1', visible: false},
                        {'name': $translate.instant('ADDRESS.FLOOR_NAME'), 'field':'physicalLocation2', visible: false},
                        {'name': $translate.instant('ADDRESS.SITE_NAME'), 'field':'physicalLocation3', visible: false}
                        /*
                        {'name': $translate.instant('LABEL.CITY'), 'field':'', visible: false},
                        {'name': $translate.instant('ADDRESS.STATE'), 'field':'', visible: false},
                        {'name': $translate.instant('ADDRESS.STORE_FRONT_NAME'), 'field':'', visible: false},
                        {'name': $translate.instant('ADDRESS.HOUSE_NUMBER'), 'field':'', visible: false},
                        {'name': $translate.instant('ADDRESS.ZIPCODE'), 'field':'', visible: false},
                        {'name': $translate.instant('DEVICE_MGT.CONSUMABLE_FIRSTNAME'), 'field':'', visible: false},
                        {'name': $translate.instant('DEVICE_MGT.CONSUMABLE_LASTNAME'), 'field':'', visible: false},
                        {'name': $translate.instant('DEVICE_MGT.DISTRICT'), 'field':'', visible: false},
                        {'name': $translate.instant('ADDRESS.PROVINCE'), 'field':'', notSearchable: true, visible: false},
                        */
                    ]
                },
                route: '/device_management',
                functionArray: [
                        {
                            name: 'getAddressName',
                            functionDef:  function() {
                                if(this._embedded && this._embedded.address){
                                    return this._embedded.address.name;
                                }else{
                                    return '';
                                }
                            }
                        }
                ]
            };

            return new HATEOASFactory(Devices);
        }
    ]);
});
