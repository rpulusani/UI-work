
angular.module('mps.deviceManagement')
.factory('Devices', ['$translate', '$rootScope', 'HATEOASFactory',
    function($translate, $rootScope, HATEOASFactory) {
        var Devices = {
            serviceName: "assets",
            singular: 'asset',
            embeddedName: "assets",
            columns: 'default',
            addBookmarkFn: true,
            columnDefs: {
                defaultSet: [
                             	{'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE.TXT_SERIAL_NUMBER'), 'field': 'serialNumber',
                             			'cellTemplate':'<div>' +
                             			'<a href="#" ng-click="grid.appScope.view(row.entity);" ' +
                             			'ng-if="grid.appScope.deviceView">{{row.entity.serialNumber}}</a>' +
                             			'<span ng-if="!grid.appScope.deviceView">{{row.entity.serialNumber}}</span>' +
                             			'</div>'
                        },     
                        {'name': $translate.instant('DEVICE_MAN.COMMON.TXT_DEVICE_TAG'), 'field':'assetTag'},
                        {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_OVERVIEW.TXT_HOSTNAME'), 'field':'hostName'},
                        {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_OVERVIEW.TXT_IP_ADDR'), 'headerCellTemplate':'<div>{{"DEVICE_MAN.MANAGE_DEVICE_OVERVIEW.TXT_IP_ADDR" | translate}}</div>', 'field':'ipAddress'},
                        
                        {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE.TXT_PRODUCT_MODEL'), 'field':'productModel'},
                        {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_OVERVIEW.TXT_DEVICE_COST_CENTER'), 'field':'costCenter', visible:false},
                        {'name': $translate.instant('REPORTING.MACHINE_TYPE_MODEL'), 'field':'machineType', visible:false},
                        {
                         'name': $translate.instant('ADDRESS.NAME'), 
                         'field':'_embedded.address.name',
                         'searchOn':'address.name',
                          cellTemplate:'<div ng-bind="row.entity.getAddressName()"></div>',
                          visible: false
                        },
                        {'name': $translate.instant('DEVICE_MAN.COMMON.TXT_LEX_ASSET_TAG'), 'field':'lexmarkAssetTag' , visible: false},
                        {'name': $translate.instant('DEVICE_MAN.COMMON.TXT_MAC_ADDRESS'), 'field':'macAddress', visible: false},
                        {'name': $translate.instant('ACCOUNT.NAME'), 
                            'field':'_embedded.account.name', 
                            'searchOn':'account.name',
                            cellTemplate:'<div ng-bind="row.entity._embedded.account.name"></div>',
                            visible: false},
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_INSTALL_BUILDING'), 'field':'physicalLocation1', visible: false},
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_INSTALL_FLOOR'), 'field':'physicalLocation2', visible: false},
                        {'name': $translate.instant('ADDRESS.SITE_NAME'), 'field':'physicalLocation3', visible: false},
                        {
                         'name': $translate.instant('ADDRESS.STORE_NAME'), 
                         'field':'_embedded.address.storeFrontName',
                         'searchOn':'address.storeFrontName',
                          cellTemplate:'<div ng-bind="row.entity._embedded.address.storeFrontName"></div>',
                          visible: false
                        },
                        {
                         'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_ADDRESS_1'), 
                         'field':'_embedded.address.addressLine1',
                         'searchOn':'address.addressLine1',
                          cellTemplate:'<div ng-bind="row.entity._embedded.address.addressLine1"></div>',
                          visible: false
                        },
                        {
                         'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_CITY'), 
                         'field':'_embedded.address.city',
                         'searchOn':'address.city',
                          cellTemplate:'<div ng-bind="row.entity._embedded.address.city"></div>',
                          visible: false
                        },
                        {
                         'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_STATE'), 
                         'field':'_embedded.address.state',
                         'searchOn':'address.state',
                          cellTemplate:'<div ng-bind="row.entity._embedded.address.state"></div>',
                          visible: false
                        },
                        {
                         'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_ZIP_CODE'),
                         'field':'_embedded.address.postalCode',
                         'searchOn':'address.postalCode',
                          cellTemplate:'<div ng-bind="row.entity._embedded.address.postalCode"></div>',
                          visible: false
                        },
                        {
                         'name': $translate.instant('CONTACT_MAN.COMMON.TXT_FIRST_NAME'),
                         'field':'_embedded.contact.firstName',
                         'searchOn':'contact.firstName',
                          cellTemplate:'<div ng-bind="row.entity._embedded.contact.firstName"></div>',
                          visible: false
                        },
                        {
                         'name': $translate.instant('CONTACT_MAN.COMMON.TXT_LAST_NAME'), 
                         'field':'_embedded.contact.lastName', 
                         'searchOn':'contact.lastName',
                          cellTemplate:'<div ng-bind="row.entity._embedded.contact.lastName"></div>',
                          visible: false},
                        {
                          'name': $translate.instant('ADDRESS.DISTRICT'), 
                          'field':'_embedded.address.district', 
                          'searchOn':'address.district',
                           cellTemplate:'<div ng-bind="row.entity._embedded.address.district"></div>',
                           visible: false
                        },
                        {
                          'name': $translate.instant('ADDRESS.PROVINCE'),
                          'field':'_embedded.address.province',
                          'searchOn':'address.province',
                           cellTemplate:'<div ng-bind="row.entity._embedded.address.province"></div>',
                           notSearchable: true, 
                           visible: false
                        },
                        {
                          'name': $translate.instant('ADDRESS.HOUSE_NUMBER'),
                          'field':'_embedded.address.houseNumber',
                          'searchOn':'address.houseNumber',
                           cellTemplate:'<div ng-bind="row.entity._embedded.address.houseNumber"></div>',
                           visible: false
                        },
                        {
                          'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_COUNTRY'),
                          'field':'_embedded.address.country',
                          'searchOn':'address.country',
                           cellTemplate:'<div ng-bind="row.entity._embedded.address.country"></div>',
                           visible: false
                        },
                        {
                          'name': $translate.instant('ADDRESS.COUNTY'),
                          'field':'_embedded.address.county',
                          'searchOn':'address.county',
                           cellTemplate:'<div ng-bind="row.entity._embedded.address.county"></div>',
                           visible: false
                        }
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
