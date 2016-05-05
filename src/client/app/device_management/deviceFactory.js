
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
                        {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE.TXT_SERIAL_NUMBER'), 'field': 'serialNumber',
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
                        {
                         'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_OVERVIEW.TXT_CONTACT_ADDRESS'), 
                         'field':'address.name',
                          cellTemplate:'<div ng-bind="row.entity.getAddressName()"></div>',
                         'notSearchable': true, 
                          visible: false
                        },
                        {'name': $translate.instant('DEVICE_MAN.COMMON.TXT_LEX_ASSET_TAG'), 'field':'', visible: false},
                        {'name': $translate.instant('DEVICE_MAN.COMMON.TXT_MAC_ADDRESS'), 'field':'machineType', visible: false},
                        {'name': $translate.instant('ACCOUNT.NAME'), 'field':'', visible: false},
                        {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_OVERVIEW.TXT_DEVICE_COST_CENTER'), 'field':'costCenter', visible: false},
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_INSTALL_BUILDING'), 'field':'physicalLocation1', visible: false},
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_INSTALL_FLOOR'), 'field':'physicalLocation2', visible: false},
                        {'name': $translate.instant('ADDRESS.SITE_NAME'), 'field':'physicalLocation3', visible: false},
                        {
                         'name': $translate.instant('ADDRESS.STORE_NAME'), 
                         'field':'address.storeFrontName',
                          cellTemplate:'<div ng-bind="row.entity._embedded.address.storeFrontName"></div>',
                          visible: false
                        },
                        {
                         'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_ADDRESS_1'), 
                         'field':'address.addressLine1',
                          cellTemplate:'<div ng-bind="row.entity._embedded.address.addressLine1"></div>',
                          visible: false
                        },
                        {
                         'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_CITY'), 
                         'field':'address.city',
                    	  cellTemplate:'<div ng-bind="row.entity._embedded.address.city"></div>',
                    	  visible: false
                    	},                    	  
                        {
                    	 'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_STATE'), 
                    	 'field':'address.state',
                    	  cellTemplate:'<div ng-bind="row.entity._embedded.address.state"></div>',
                    	  visible: false
                    	},                    	
                        {
                    	 'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_ZIP_CODE'),
                    	 'field':'address.postalCode',
                    	  cellTemplate:'<div ng-bind="row.entity._embedded.address.postalCode"></div>',
                    	  visible: false
                    	},
                        {
                    	 'name': $translate.instant('CONTACT_MAN.COMMON.TXT_FIRST_NAME'),
                    	 'field':'contact.firstName',
                    	  cellTemplate:'<div ng-bind="row.entity._embedded.contact.firstName"></div>',
                    	  visible: false
                    	},
                        {
                    	 'name': $translate.instant('CONTACT_MAN.COMMON.TXT_LAST_NAME'), 
                    	 'field':'contact.lastName', 
                    	  cellTemplate:'<div ng-bind="row.entity._embedded.contact.lastName"></div>',
                    	  visible: false},
                    	{
                    	  'name': $translate.instant('ADDRESS.DISTRICT'), 
                    	  'field':'address.district', 
                    	   cellTemplate:'<div ng-bind="row.entity._embedded.address.district"></div>',
                    	   visible: false
                    	},
                        {
                    	  'name': $translate.instant('ADDRESS.PROVINCE'),
                    	  'field':'address.province',
                    	   cellTemplate:'<div ng-bind="row.entity._embedded.address.province"></div>',
                    	   notSearchable: true, 
                    	   visible: false
                    	},
                        {
                    	  'name': $translate.instant('ADDRESS.HOUSE_NUMBER'),
                    	  'field':'address.houseNumber',
                    	   cellTemplate:'<div ng-bind="row.entity._embedded.address.houseNumber"></div>',
                    	   visible: false
                    	},
                        {
                          'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_COUNTRY'),
                          'field':'address.country',
                           cellTemplate:'<div ng-bind="row.entity._embedded.address.country"></div>',
                           visible: false
                        },
                        {
                          'name': $translate.instant('ADDRESS.COUNTY'),
                          'field':'address.county',
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
