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
                addBookmarkFn: true,
                columnDefs: {
                    defaultSet: [
                        {'name': $translate.instant('DEVICE_MGT.SERIAL_NO'), 'field': 'serialNumber', dynamic: false,
                         'cellTemplate':'<div>' +
                                            '<a href="#" ng-click="grid.appScope.view(row.entity);" ' +
                                            'ng-if="grid.appScope.deviceView">{{row.entity.serialNumber}}</a>' +
                                            '<span ng-if="!grid.appScope.deviceView">{{row.entity.serialNumber}}</span>' +
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
                        {'name': $translate.instant('ADDRESS.SITE_NAME'), 'field':'physicalLocation3', visible: false},
                        {'name': $translate.instant('ADDRESS.CITY'), 'field':'_embedded.address.city', visible: false},
                        {'name': $translate.instant('ADDRESS.STATE'), 'field':'_embedded.address.state', visible: false},
                        {'name': $translate.instant('ADDRESS.STORE_NAME'), 'field':'_embedded.address.storeFrontName', visible: false},
                        {'name': $translate.instant('ADDRESS.ZIP'), 'field':'_embedded.address.postalCode', visible: false},
                        {'name': $translate.instant('CONTACT.FIRST_NAME'), 'field':'_embedded.contact.firstName', visible: false},
                        {'name': $translate.instant('CONTACT.LAST_NAME'), 'field':'_embedded.contact.lastName', visible: false},
                        {'name': $translate.instant('ADDRESS.DISTRICT'), 'field':'_embedded.address.district', visible: false},
                        {'name': $translate.instant('ADDRESS.STATE_PROVINCE'), 'field':'_embedded.address.province', notSearchable: true, visible: false},
                        {'name': $translate.instant('ADDRESS.HOUSE_NUMBER'), 'field':'_embedded.address.houseNumber', visible: false}
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
