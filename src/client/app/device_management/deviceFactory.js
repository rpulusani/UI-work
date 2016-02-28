
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
                        {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE.TXT_SERIAL_NUMBER'), 'field': 'serialNumber', dynamic: false,
                     'cellTemplate':'<div>' +
                                        '<a href="#" ng-click="grid.appScope.view(row.entity);" ' +
                                        'ng-if="grid.appScope.deviceView">{{row.entity.serialNumber}}</a>' +
                                        '<span ng-if="!grid.appScope.deviceView">{{row.entity.serialNumber}}</span>' +
                                    '</div>'

                    },
                        {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_OVERVIEW.TXT_HOSTNAME'), 'field':'hostName'},
                        {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE.TXT_PRODUCT_MODEL'), 'field':'productModel'},
                        {'name': $translate.instant('DEVICE_MAN.COMMON.TXT_DEVICE_TAG'), 'field':'assetTag'},
                        {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_OVERVIEW.TXT_IP_ADDR'), 'field':'ipAddress'},
                        {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_OVERVIEW.TXT_CONTACT_ADDRESS'), 'field':'getAddressName()', 'notSearchable': true},
                        {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_OVERVIEW.TXT_DEVICE_COST_CENTER'), 'field':'costCenter', visible: false},
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_INSTALL_BUILDING'), 'field':'physicalLocation1', visible: false},
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_INSTALL_FLOOR'), 'field':'physicalLocation2', visible: false},
                    {'name': $translate.instant('ADDRESS.SITE_NAME'), 'field':'physicalLocation3', visible: false},
                        {'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_CITY'), 'field':'_embedded.address.city', visible: false},
                        {'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_STATE'), 'field':'_embedded.address.state', visible: false},
                    {'name': $translate.instant('ADDRESS.STORE_NAME'), 'field':'_embedded.address.storeFrontName', visible: false},
                        {'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_ZIP_CODE'), 'field':'_embedded.address.postalCode', visible: false},
                        {'name': $translate.instant('CONTACT_MAN.COMMON.TXT_FIRST_NAME'), 'field':'_embedded.contact.firstName', visible: false},
                        {'name': $translate.instant('CONTACT_MAN.COMMON.TXT_LAST_NAME'), 'field':'_embedded.contact.lastName', visible: false},
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
