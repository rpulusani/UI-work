

angular.module('mps.serviceRequests')
.factory('ServiceRequestService', ['serviceUrl', '$translate', 'HATEOASFactory', 'FormatterService',
    function(serviceUrl, $translate, HATEOASFactory, formatter) {
        var ServiceRequests = {
                serviceName: 'service-requests',
                embeddedName: 'serviceRequests', //get away from embedded name and move to a function to convert url name to javascript name
                columns: 'defaultSet',
                hideBookmark: true,
                columnDefs: {
                    defaultSet: [
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_REQUEST_NUMBER'), 'field':'requestNumber',
                         'cellTemplate':'<div>' +
                                        '<a href="#" ng-click="grid.appScope.view(row.entity);" ' +
                                        '>{{row.entity.requestNumber}}</a>' +
                                    '</div>'
                        },
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_DATE'), 'field': 'getFormattedCreateDate()', 'notSearchable': true},
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_TYPE'), 'field':'type', 'notSearchable': true},
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_STATUS'), 'field':'status', 'notSearchable': true},
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_REQUEST_CONTACT'), 'field': 'getFullPrimaryName()', 'notSearchable': true},
                        {'name': $translate.instant('Requester First Name'), 
                        	'field': 'requester.firstName',
                        	visible: false,
                        	cellTemplate:'<div ng-bind="row.entity._embedded.requester.firstName"></div>'},
                        {'name': $translate.instant('Requester Last Name'),
                        		'field': 'requester.lastName',
                        		cellTemplate:'<div ng-bind="row.entity._embedded.requester.lastName"></div>',
                        		visible: false},
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_REQUEST_CUST_REF_ID'), 'field':'customerReferenceId',visible: false, 'notSearchable': true},
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_REQUEST_COST_CENTER'), 'field':'costCenter',visible: false, 'notSearchable': true}
                    ],
                    madcSet: [
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_REQUEST_NUMBER'), 'field':'requestNumber',
                         'cellTemplate':'<div>' +
                                        '<a href="#" ng-click="grid.appScope.view(row.entity);" ' +
                                        '>{{row.entity.requestNumber}}</a>' +
                                    '</div>'
                        },
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_DATE'), 'field': 'getFormattedCreateDate()', 'notSearchable': true},
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_TYPE'), 'field':'type', 'notSearchable': true},
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_STATUS'), 'field':'status', 'notSearchable': true},
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_REQUEST_CUST_REF_ID'), 'field':'customerReferenceId'},
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_REQUEST_COST_CENTER'), 'field':'costCenter'},
                        {'name': $translate.instant('SERVICE_REQUEST.PRIMARY_CONTACT'), 'field': 'getFullPrimaryName()', visible: false, 'notSearchable': true},
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_REQUEST_CONTACT'), 'field': 'getFullRequestorName()', visible: false, 'notSearchable': true}
                    ],
                    madcSetSR: [
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_REQUEST_NUMBER'), 'field':'requestNumber',
                        'cellTemplate':'<div>' +
                                        '<a href="#" ng-click="grid.appScope.view(row.entity);" ' +
                                        '>{{row.entity.requestNumber}}</a>' +
                                    '</div>'},
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_DATE'), 'field': 'getFormattedCreateDate()', 'notSearchable': true},
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_TYPE'), 'field':'type', 'notSearchable': true, 'notSearchable': true},
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_STATUS'), 'field':'status', 'notSearchable': true},
                        {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE.TXT_SERIAL_NUMBER'), 'field':'serialNumber',
                                 'cellTemplate':'<div ng-bind="row.entity.assetInfo.serialNumber"></div>'
                        },
                        {'name': $translate.instant('DEVICE_MAN.COMMON.TXT_DEVICE_TAG'), 'field':'assetTag',
                                 'cellTemplate':'<div ng-bind="row.entity.assetInfo.assetTag"></div>'
                        },
                        {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE.TXT_PRODUCT_MODEL'), 'field':'productModel',
                                 'cellTemplate':'<div ng-bind="row.entity.assetInfo.productModel"></div>'
                        },
                        {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_OVERVIEW.TXT_IP_ADDR'), 'field':'ipAddress',
                                 'cellTemplate':'<div ng-bind="row.entity.assetInfo.ipAddress"></div>'
                        },
                        {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_OVERVIEW.TXT_HOSTNAME'), 'field':'hostName',
                                 'cellTemplate':'<div ng-bind="row.entity.assetInfo.hostName"></div>'
                        },
                        {'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_ADDRESS_NAME'), 'field':'_embedded.sourceAddress.name', visible: false, 'notSearchable': true},
                        {'name': $translate.instant('ADDRESS.STORE_NAME'), 'field':'_embedded.sourceAddress.storeFrontName', visible: false, 'notSearchable': true},
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_REQUEST_CUST_REF_ID'), 'field':'customerReferenceId', visible: false, 'notSearchable': true},
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_REQUEST_COST_CENTER'), 'field':'costCenter', visible: false, 'notSearchable': true},
                        
                        {'name': 'CONTACT_MAN.COMMON.PRIMARY_CONTACT_FIRST_NAME', 
                         'field': 'primaryContact.firstName', 
                          visible: false,
                          cellTemplate:'<div ng-bind="row.entity._embedded.primaryContact.firstName"></div>',
                          'notSearchable': true
                          },
                        {'name': 'CONTACT_MAN.COMMON.PRIMARY_CONTACT_LAST_NAME', 
                         'field': '_embedded.primaryContact.lastName',
                          visible: false,
                          cellTemplate:'<div ng-bind="row.entity._embedded.primaryContact.lastName"></div>',
                          'notSearchable': true
                        }, 
                        
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_REQUEST_CONTACT'), 'field': 'getFullRequestorName()', visible: false, 'notSearchable': true},
                        {'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_ADDRESS_1'), 'field': '_embedded.sourceAddress.addressLine1', visible: false, 'notSearchable': true},
                        {'name': $translate.instant('ADDRESS.HOUSE_NUMBER'), 'field': '', visible: false, 'notSearchable': true},
                        {'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_CITY'), 'field': '_embedded.sourceAddress.city', visible: false, 'notSearchable': true},
                        {'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_STATE'), 'field': '_embedded.sourceAddress.state', visible: false, 'notSearchable': true},
                        {'name': $translate.instant('ADDRESS.PROVINCE'), 'field': '_embedded.sourceAddress.province', visible: false, 'notSearchable': true},
                        {'name': $translate.instant('ADDRESS.COUNTY'), 'field': '_embedded.sourceAddress.county', visible: false, 'notSearchable': true},
                        {'name': $translate.instant('ADDRESS.DISTRICT'), 'field': '_embedded.sourceAddress.district', visible: false, 'notSearchable': true},
                        {'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_COUNTRY'), 'field': '_embedded.sourceAddress.country', visible: false, 'notSearchable': true},
                        {'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_ZIP_CODE'), 'field': '_embedded.sourceAddress.postalCode', visible: false, 'notSearchable': true}
                    ],
                    breakfixSRSet: [
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_REQUEST_NUMBER'), 'field':'requestNumber',
                        'cellTemplate':'<div>' +
                                        '<a href="#" ng-click="grid.appScope.view(row.entity);" ' +
                                        '>{{row.entity.requestNumber}}</a>' +
                                    '</div>'},
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_DATE'), 'field': 'getFormattedCreateDate()', 'notSearchable': true},
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_STATUS'), 'field':'status', 'notSearchable': true},
                        {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE.TXT_SERIAL_NUMBER'), 'field':'serialNumber',
                                 'cellTemplate':'<div ng-bind="row.entity._embedded.asset.serialNumber"></div>'
                        },
                        {'name': $translate.instant('DEVICE_MAN.COMMON.TXT_DEVICE_TAG'), 'field':'assetTag',
                                 'cellTemplate':'<div ng-bind="row.entity._embedded.asset.assetTag"></div>'
                        },
                        {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE.TXT_PRODUCT_MODEL'), 'field':'productModel',
                                 'cellTemplate':'<div ng-bind="row.entity._embedded.asset.productModel"></div>'
                        },
                        {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_OVERVIEW.TXT_IP_ADDR'), 'field':'ipAddress',
                                 'cellTemplate':'<div ng-bind="row.entity._embedded.asset.ipAddress"></div>'
                        },
                        {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_OVERVIEW.TXT_HOSTNAME'), 'field':'hostName',
                                 'cellTemplate':'<div ng-bind="row.entity._embedded.asset.hostName"></div>'
                        },
                        {'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_ADDRESS_NAME'), 'field':'_embedded.sourceAddress.name', visible: false, 'notSearchable': true},
                        {'name': $translate.instant('ADDRESS.STORE_NAME'), 'field':'_embedded.sourceAddress.storeFrontName', visible: false, 'notSearchable': true},
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_REQUEST_CUST_REF_ID'), 'field':'customerReferenceId', visible: false, 'notSearchable': true},
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_REQUEST_COST_CENTER'), 'field':'costCenter', visible: false, 'notSearchable': true},
                        {'name': $translate.instant('SERVICE_REQUEST.PRIMARY_CONTACT'), 'field': 'getFullPrimaryName()', visible: false, 'notSearchable': true},
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_REQUEST_CONTACT'), 'field': 'getFullRequestorName()', visible: false, 'notSearchable': true},
                        {'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_ADDRESS_1'), 'field': '_embedded.sourceAddress.addressLine1', visible: false, 'notSearchable': true},
                        {'name': $translate.instant('ADDRESS.HOUSE_NUMBER'), 'field': '_embedded.sourceAddress.', visible: false, 'notSearchable': true},
                        {'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_CITY'), 'field': '_embedded.sourceAddress.city', visible: false, 'notSearchable': true},
                        {'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_STATE'), 'field': '_embedded.sourceAddress.state', visible: false, 'notSearchable': true},
                        {'name': $translate.instant('ADDRESS.PROVINCE'), 'field': '_embedded.sourceAddress.province', visible: false, 'notSearchable': true},
                        {'name': $translate.instant('ADDRESS.COUNTY'), 'field': '_embedded.sourceAddress.county', visible: false, 'notSearchable': true},
                        {'name': $translate.instant('ADDRESS.DISTRICT'), 'field': '_embedded.sourceAddress.district', visible: false, 'notSearchable': true},
                        {'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_COUNTRY'), 'field': '_embedded.sourceAddress.country', visible: false, 'notSearchable': true},
                        {'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_ZIP_CODE'), 'field': '_embedded.sourceAddress.postalCode', visible: false, 'notSearchable': true}
                    ],
                    breakfixSet: [
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_REQUEST_NUMBER'), 'field':'requestNumber',
                         'cellTemplate':'<div>' +
                                        '<a href="#" ng-click="grid.appScope.view(row.entity);" ' +
                                        '>{{row.entity.requestNumber}}</a>' +
                                    '</div>'
                        },
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_DATE'), 'field': 'getFormattedCreateDate()', 'notSearchable': true},
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_STATUS'), 'field':'status', 'notSearchable': true},
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_REQUEST_COST_CENTER'), 'field':'costCenter'},
                        {'name': $translate.instant('DEVICE_MAN.DEVICE_SERVICE_HISTORY.TXT_GRID_SERVICE_HISTORY_PROB_DESC'), 'field':'description'},
                        {'name': $translate.instant('DEVICE_MAN.DEVICE_SERVICE_HISTORY.TXT_GRID_SERVICE_HISTORY_RESOLUTION'), 'field':''},
                        {'name': $translate.instant('SERVICE_REQUEST.PRIMARY_CONTACT'), 'field': 'getFullPrimaryName()', visible: false},
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_REQUEST_CONTACT'), 'field': 'getFullRequestorName()', visible: false, 'notSearchable': true},
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_REQUEST_CUST_REF_ID'), 'field':'customerReferenceId', visible: false},
                    ],
                    addressSet: [
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_REQUEST_NUMBER'), 'field':'requestNumber',
                        'cellTemplate':'<div>' +
                                        '<a href="#" ng-click="grid.appScope.view(row.entity);" ' +
                                        '>{{row.entity.requestNumber}}</a>' +
                                    '</div>'},
                                    {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_DATE'), 'field': 'createDate ', visible: true,
                                        'cellTemplate':'<div ng-bind="row.entity.getFormattedCreateDate()">' +                                        
                                                    '</div>',
                                                    'notSearchable': true},
                                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_TYPE'), 'field': 'type', visible: true},
                                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_STATUS'), 'field':'status', visible: true},
                                        {
                                            'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_ADDRESS_NAME'), 
                                            'field':'sourceAddress.name', 
                                            'cellTemplate':'<div ng-bind="row.entity._embedded.sourceAddress.name"></div>',
                                            visible: true
                                        },
                                        {
                                            'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_ADDRESS_1'), 
                                            'field': 'sourceAddress.addressLine1', 
                                            'cellTemplate':'<div ng-bind="row.entity._embedded.sourceAddress.addressLine1"></div>',
                                            visible: true
                                        },
                                        {
                                            'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_ADDRESS_2'),
                                            'field': 'sourceAddress.addressLine2', 
                                            'cellTemplate':'<div ng-bind="row.entity._embedded.sourceAddress.addressLine2"></div>',                             
                                            visible: true
                                        },
                                        {
                                            'name': $translate.instant('ADDRESS.REGION'), 
                                            'field': 'sourceAddress.region', 
                                            'cellTemplate':'<div ng-bind="row.entity._embedded.sourceAddress.region"></div>',                             
                                            visible: true
                                        },
                                        {
                                            'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_CITY'), 
                                            'field': 'sourceAddress.city', 
                                            'cellTemplate':'<div ng-bind="row.entity._embedded.sourceAddress.city"></div>',
                                            visible: true
                                        },
                                        {
                                            'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_STATE'), 
                                            'field': 'sourceAddress.state', 
                                            'cellTemplate':'<div ng-bind="row.entity._embedded.sourceAddress.state"></div>',
                                            visible: true
                                        },
                                        {
                                            'name': $translate.instant('ADDRESS.PROVINCE'), 
                                            'field': 'sourceAddress.province', 
                                            'cellTemplate':'<div ng-bind="row.entity._embedded.sourceAddress.province"></div>',
                                            visible: true
                                        },
                                        {
                                            'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_ZIP_CODE'), 
                                            'field': 'sourceAddress.postalCode', 
                                            'cellTemplate':'<div ng-bind="row.entity._embedded.sourceAddress.postalCode"></div>',
                                            visible: true
                                        },
                                        {
                                            'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_COUNTRY'), 
                                            'field': 'sourceAddress.country', 
                                            'cellTemplate':'<div ng-bind="row.entity._embedded.sourceAddress.country"></div>',
                                            visible: true
                                        },
                                        {
                                            'name': $translate.instant('ADDRESS.COUNTY'), 
                                            'field': 'sourceAddress.county', 
                                            'cellTemplate':'<div ng-bind="row.entity._embedded.sourceAddress.county"></div>',
                                            visible: true
                                        },
                                        {
                                            'name': $translate.instant('ADDRESS.DISTRICT'), 
                                            'field': 'sourceAddress.district', 
                                            'cellTemplate':'<div ng-bind="row.entity._embedded.sourceAddress.district"></div>',
                                            visible: true
                                        },
                                        {
                                            'name': $translate.instant('ADDRESS.HOUSE_NUMBER'), 
                                            'field': 'sourceAddress.houseNumber', 
                                            'cellTemplate':'<div ng-bind="row.entity._embedded.sourceAddress.houseNumber"></div>',
                                            visible: true
                                        },
                                        {
                                            'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_ADDRESS_TYPE'), 
                                            'field': 'sourceAddress.lbsIdentifierFlag', 
                                             visible: false,
                                            'cellTemplate':'<div ng-bind="row.entity.getLbsAddressType()">' +                                        
                                                    '</div>'
                                        },
                                        {
                                            'name': $translate.instant('ADDRESS.STORE_NAME'), 
                                            'field':'sourceAddress.storeFrontName',
                                            'cellTemplate':'<div ng-bind="row.entity._embedded.sourceAddress.storeFrontName"></div>',
                                            visible: false
                                        },
                                        {
                                            'name': $translate.instant('SERVICE_REQUEST.PRIMARY_CONTACT'), 
                                            'field': 'getFullPrimaryName()', 
                                             visible: false, 
                                            'searchOn':'primaryContact.lastName'
                                        },
                                        {
                                            'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_REQUEST_CONTACT'), 
                                            'field': 'getFullRequestorName()', 
                                             visible: false, 
                                            'searchOn':'requester.lastName'
                                        }
                    ],
                     contactSet: [
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_REQUEST_NUMBER'), 'field':'requestNumber',
                        'cellTemplate':'<div>' +
                                        '<a href="#" ng-click="grid.appScope.view(row.entity);" ' +
                                        '>{{row.entity.requestNumber}}</a>' +
                                    '</div>'},
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_DATE'), 'field': 'getFormattedCreateDate()', 'notSearchable': true},
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_TYPE'), 'field': 'type', visible: true},
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_STATUS'), 'field':'status'},
                        {
                            name: $translate.instant('CONTACT.FIRST_NAME'),
                            field: 'firstName',
                            dynamic: false,                        
                        },
                        {
                            name: $translate.instant('CONTACT.LAST_NAME'),
                            field: 'lastName',
                            dynamic: false,                        
                        },
                        
                        {'name': $translate.instant('CONTACT_MAN.MANAGE_CONTACTS.TXT_GRID_PHONE'), 'field':'_embedded.requester.workPhone', 'notSearchable': true},
                        {'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_ADDRESS_1'), 'field': '', visible: false, 'notSearchable': true},
                        {'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_ADDRESS_2'), 'field': '', visible: false, 'notSearchable': true},
                        {'name': $translate.instant('ADDRESS.HOUSE_NUMBER'), 'field': '', visible: false, 'notSearchable': true},
                        {'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_CITY'), 'field': '', visible: false, 'notSearchable': true},
                        {'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_STATE'), 'field': '', visible: false, 'notSearchable': true},
                        {'name': $translate.instant('ADDRESS.PROVINCE'), 'field': '', visible: false, 'notSearchable': true},
                        {'name': $translate.instant('ADDRESS.COUNTY'), 'field': '', visible: false, 'notSearchable': true},
                        {'name': $translate.instant('ADDRESS.DISTRICT'), 'field': '', visible: false, 'notSearchable': true},
                        {'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_COUNTRY'), 'field': '', visible: false, 'notSearchable': true},
                        {'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_ZIP_CODE'), 'field': '', visible: false, 'notSearchable': true},
                        {'name': $translate.instant('SERVICE_REQUEST.PRIMARY_CONTACT'), 'field': 'getFullPrimaryName()', visible: false, 'notSearchable': true},
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_REQUEST_CONTACT'), 'field': 'getFullRequestorName()', visible: false, 'notSearchable': true}
                    ]
                },

                functionArray: [
                    {
                        name: 'getFormattedCreateDate',
                        functionDef: function(){
                            return formatter.formatDate(this.createDate);
                        }
                    },
                    {
                        name: 'getFullPrimaryName',
                        functionDef: function() {
                            if(this._embedded && this._embedded.primaryContact){
                                return formatter.getFullName(this._embedded.primaryContact.firstName,
                                    this._embedded.primaryContact.lastName,
                                    this._embedded.primaryContact.middleName);
                            }else{
                                return '';
                            }
                        }
                    },
                    {
                        name: 'getFullRequestorName',
                        functionDef: function() {
                            if(this._embedded && this._embedded.requester){
                                return formatter.getFullName(this._embedded.requester.firstName,
                                    this._embedded.requester.lastName,
                                    this._embedded.requester.middleName);
                            }else{
                                return '';
                            }
                        }
                    }
                ],

                route: '/service_requests'
        };

    return  new HATEOASFactory(ServiceRequests);
}]);

