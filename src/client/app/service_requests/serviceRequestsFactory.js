

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
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_DATE'), 'field': 'getFormattedCreateDate()',searchOn :'createDate','notSearchable': true},
                        
                        
                        
                        {'name': $translate.instant('CONTACT_MAN.COMMON.REQUESTER_CONTACT_FIRST_NAME'), 'field': '_embedded.requester.firstName'},
                        {'name': $translate.instant('CONTACT_MAN.COMMON.REQUESTER_CONTACT_LAST_NAME'), 'field': '_embedded.requester.lastName'},
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_TYPE'), 'field':'type', 'notSearchable': true},
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_STATUS'), 'field':'status', 'notSearchable': true},
                        {'name': $translate.instant('CONTACT_MAN.COMMON.PRIMARY_CONTACT_FIRST_NAME'), 'field': '_embedded.primaryContact.firstName',visible: false},
                        {'name': $translate.instant('CONTACT_MAN.COMMON.PRIMARY_CONTACT_LAST_NAME'), 'field': '_embedded.primaryContact.lastName',visible: false},
                        {'name': $translate.instant('SERVICE_REQUEST.HELPDESK_REFERENCE'), 'field':'customerReferenceId',visible: false},
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_REQUEST_COST_CENTER'), 'field':'costCenter',visible: false}
                    ],
                    madcSet: [
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_REQUEST_NUMBER'), 'field':'requestNumber',
                         'cellTemplate':'<div>' +
                                        '<a href="#" ng-click="grid.appScope.view(row.entity);" ' +
                                        '>{{row.entity.requestNumber}}</a>' +
                                    '</div>'
                        },
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_DATE'), 'field': 'getFormattedCreateDate()',searchOn :'createDate', 'notSearchable': true},
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_TYPE'), 'field':'type', 'notSearchable': true},
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_STATUS'), 'field':'status', 'notSearchable': true},
                        {'name': $translate.instant('SERVICE_REQUEST.HELPDESK_REFERENCE'), 'field':'customerReferenceId'},
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_REQUEST_COST_CENTER'), 'field':'costCenter'},
                        
                        {'name': $translate.instant('CONTACT_MAN.COMMON.PRIMARY_CONTACT_FIRST_NAME'), 'field': '_embedded.primaryContact.firstName',visible: false, 'notSearchable': true},
                        {'name': $translate.instant('CONTACT_MAN.COMMON.PRIMARY_CONTACT_LAST_NAME'), 'field': '_embedded.primaryContact.lastName',visible: false, 'notSearchable': true},
                        
                        {'name': $translate.instant('CONTACT_MAN.COMMON.REQUESTER_CONTACT_FIRST_NAME'), 'field': '_embedded.requester.firstName', visible: false, 'notSearchable': true},
                        {'name': $translate.instant('CONTACT_MAN.COMMON.REQUESTER_CONTACT_LAST_NAME'), 'field': '_embedded.requester.lastName', visible: false, 'notSearchable': true}
                        
                    ],
                    madcSetSR: [
                                {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_REQUEST_NUMBER'), 'field':'requestNumber', 
                                    'cellTemplate':'<div>' +
                                                    '<a href="#" ng-click="grid.appScope.view(row.entity);" ' +
                                                    '>{{row.entity.requestNumber}}</a>' +
                                                '</div>'},        
                        {'name': $translate.instant('DEVICE_MAN.COMMON.TXT_DEVICE_TAG'), 'field':'assetInfo.assetTag',
                                 'cellTemplate':'<div ng-bind="row.entity.assetInfo.assetTag"></div>'
                        },
                        {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_OVERVIEW.TXT_HOSTNAME'), 'field':'assetInfo.hostName',
                                 'cellTemplate':'<div ng-bind="row.entity.assetInfo.hostName"></div>'
                        },
                        {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_OVERVIEW.TXT_IP_ADDR'), 'field':'assetInfo.ipAddress',
                                 'cellTemplate':'<div ng-bind="row.entity.assetInfo.ipAddress"></div>'
                        },
                        {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE.TXT_SERIAL_NUMBER'), 'field':'assetInfo.serialNumber',
                                 'cellTemplate':'<div ng-bind="row.entity.assetInfo.serialNumber"></div>'
                        },
                        {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE.TXT_PRODUCT_MODEL'), 'field':'assetInfo.productModel',
                                 'cellTemplate':'<div ng-bind="row.entity.assetInfo.productModel"></div>'
                        },
                       
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_DATE'), 'field': 'getFormattedCreateDate()', 'notSearchable': true, searchOn :'createDate'},
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_TYPE'), 'field':'type', 'notSearchable': true},
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_STATUS'), 'field':'status', 'notSearchable': true},
                        {'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_ADDRESS_NAME'), 'field':'_embedded.sourceAddress.name', visible: false},
                        {'name': $translate.instant('ADDRESS.STORE_NAME'), 'field':'_embedded.sourceAddress.storeFrontName', visible: false},
                        {'name': $translate.instant('SERVICE_REQUEST.HELPDESK_REFERENCE'), 'field':'customerReferenceId', visible: false},
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_REQUEST_COST_CENTER'), 'field':'costCenter', visible: false},
                        {'name': $translate.instant('CONTACT_MAN.COMMON.PRIMARY_CONTACT_FIRST_NAME'), 'field': '_embedded.primaryContact.firstName',visible: false},
                        {'name': $translate.instant('CONTACT_MAN.COMMON.PRIMARY_CONTACT_LAST_NAME'), 'field': '_embedded.primaryContact.lastName',visible: false},
                        
                        
                        {'name': $translate.instant('CONTACT_MAN.COMMON.REQUESTER_CONTACT_FIRST_NAME'), 'field': '_embedded.requester.firstName', visible: false},
                        {'name': $translate.instant('CONTACT_MAN.COMMON.REQUESTER_CONTACT_LAST_NAME'), 'field': '_embedded.requester.lastName', visible: false},
                        
                        {'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_ADDRESS_1'), 'field': '_embedded.sourceAddress.addressLine1', visible: false},
                        {'name': $translate.instant('ADDRESS.HOUSE_NUMBER'), 'field': '_embedded.sourceAddress.houseNumber', visible: false},
                        {'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_CITY'), 'field': '_embedded.sourceAddress.city', visible: false},
                        {'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_STATE'), 'field': '_embedded.sourceAddress.state', visible: false},
                        {'name': $translate.instant('ADDRESS.PROVINCE'), 'field': '_embedded.sourceAddress.province', visible: false},
                        {'name': $translate.instant('ADDRESS.COUNTY'), 'field': '_embedded.sourceAddress.county', visible: false},
                        {'name': $translate.instant('ADDRESS.DISTRICT'), 'field': '_embedded.sourceAddress.district', visible: false},
                        {'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_COUNTRY'), 'field': '_embedded.sourceAddress.country', visible: false},
                        {'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_ZIP_CODE'), 'field': '_embedded.sourceAddress.postalCode', visible: false}
                    ],
                    breakfixSRSet: [
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_REQUEST_NUMBER'), 'field':'requestNumber',
                        'cellTemplate':'<div>' +
                                        '<a href="#" ng-click="grid.appScope.view(row.entity);" ' +
                                        '>{{row.entity.requestNumber}}</a>' +
                                    '</div>'},
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_DATE'), 'field': 'getFormattedCreateDate()',searchOn :'createDate','notSearchable': true},
                        {'name': $translate.instant('DEVICE_MAN.COMMON.TXT_DEVICE_TAG'), 'field':'_embedded.asset.assetTag',
                                 'cellTemplate':'<div ng-bind="row.entity._embedded.asset.assetTag"></div>'
                        },
                        {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_OVERVIEW.TXT_HOSTNAME'), 'field':'_embedded.asset.hostName',
                                 'cellTemplate':'<div ng-bind="row.entity._embedded.asset.hostName"></div>'
                        },
                        {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_OVERVIEW.TXT_IP_ADDR'), 'field':'_embedded.asset.ipAddress',
                                 'cellTemplate':'<div ng-bind="row.entity._embedded.asset.ipAddress"></div>'
                        },
                        {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE.TXT_SERIAL_NUMBER'), 'field':'_embedded.asset.serialNumber',
                                 'cellTemplate':'<div ng-bind="row.entity._embedded.asset.serialNumber"></div>'
                        },
                        {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE.TXT_PRODUCT_MODEL'), 'field':'_embedded.asset.productModel',
                                 'cellTemplate':'<div ng-bind="row.entity._embedded.asset.productModel"></div>'
                        },
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_STATUS'), 'field':'status', 'notSearchable': true},
                        {'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_ADDRESS_NAME'), 'field':'_embedded.sourceAddress.name', visible: false},
                        {'name': $translate.instant('ADDRESS.STORE_NAME'), 'field':'_embedded.sourceAddress.storeFrontName', visible: false},
                        {'name': $translate.instant('SERVICE_REQUEST.HELPDESK_REFERENCE'), 'field':'customerReferenceId', visible: false},
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_REQUEST_COST_CENTER'), 'field':'costCenter', visible: false},
                        {'name': $translate.instant('REPORTING.CUSTOMER_PO_NUMBER'), 'field':'customerPONumber', visible: false},
                        
                        {'name': $translate.instant('CONTACT_MAN.COMMON.PRIMARY_CONTACT_FIRST_NAME'), 'field': '_embedded.primaryContact.firstName',visible: false},
                        {'name': $translate.instant('CONTACT_MAN.COMMON.PRIMARY_CONTACT_LAST_NAME'), 'field': '_embedded.primaryContact.lastName',visible: false},
                        
                        {'name': $translate.instant('CONTACT_MAN.COMMON.REQUESTER_CONTACT_FIRST_NAME'), 'field': '_embedded.requester.firstName', visible: false},
                        {'name': $translate.instant('CONTACT_MAN.COMMON.REQUESTER_CONTACT_LAST_NAME'), 'field': '_embedded.requester.lastName', visible: false},
                        
                        
                        {'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_ADDRESS_1'), 'field': '_embedded.sourceAddress.addressLine1', visible: false},
                        {'name': $translate.instant('ADDRESS.HOUSE_NUMBER'), 'field': '_embedded.sourceAddress.', visible: false},
                        {'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_CITY'), 'field': '_embedded.sourceAddress.city', visible: false},
                        {'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_STATE'), 'field': '_embedded.sourceAddress.state', visible: false},
                        {'name': $translate.instant('ADDRESS.PROVINCE'), 'field': '_embedded.sourceAddress.province', visible: false},
                        {'name': $translate.instant('ADDRESS.COUNTY'), 'field': '_embedded.sourceAddress.county', visible: false},
                        {'name': $translate.instant('ADDRESS.DISTRICT'), 'field': '_embedded.sourceAddress.district', visible: false},
                        {'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_COUNTRY'), 'field': '_embedded.sourceAddress.country', visible: false},
                        {'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_ZIP_CODE'), 'field': '_embedded.sourceAddress.postalCode', visible: false}
                    ],
                    breakfixSet: [
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_REQUEST_NUMBER'), 'field':'requestNumber',
                         'cellTemplate':'<div>' +
                                        '<a href="#" ng-click="grid.appScope.view(row.entity);" ' +
                                        '>{{row.entity.requestNumber}}</a>' +
                                    '</div>'
                        },
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_DATE'), 'field': 'getFormattedCreateDate()', 'notSearchable': true,searchOn :'createDate'},
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_STATUS'), 'field':'status', 'notSearchable': true},
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_REQUEST_COST_CENTER'), 'field':'costCenter'},
                        {'name': $translate.instant('DEVICE_MAN.DEVICE_SERVICE_HISTORY.TXT_GRID_SERVICE_HISTORY_PROB_DESC'), 'field':'description'},
                        {'name': $translate.instant('DEVICE_MAN.DEVICE_SERVICE_HISTORY.TXT_GRID_SERVICE_HISTORY_RESOLUTION'), 'field':''},
                        {'name': $translate.instant('CONTACT_MAN.COMMON.PRIMARY_CONTACT_FIRST_NAME'), 'field': '_embedded.primaryContact.firstName',visible: false},
                        {'name': $translate.instant('CONTACT_MAN.COMMON.PRIMARY_CONTACT_LAST_NAME'), 'field': '_embedded.primaryContact.lastName',visible: false},
                        
                        {'name': $translate.instant('CONTACT_MAN.COMMON.REQUESTER_CONTACT_FIRST_NAME'), 'field': '_embedded.requester.firstName', visible: false, 'notSearchable': true},
                        {'name': $translate.instant('CONTACT_MAN.COMMON.REQUESTER_CONTACT_LAST_NAME'), 'field': '_embedded.requester.lastName', visible: false, 'notSearchable': true},
                        
                        {'name': $translate.instant('SERVICE_REQUEST.HELPDESK_REFERENCE'), 'field':'customerReferenceId'},
                    ],
                    addressSet: [
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_REQUEST_NUMBER'), 'field':'requestNumber',
                        'cellTemplate':'<div>' +
                                        '<a href="#" ng-click="grid.appScope.view(row.entity);" ' +
                                        '>{{row.entity.requestNumber}}</a>' +
                                    '</div>'},
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_DATE'), 'field': 'getFormattedCreateDate()',searchOn :'createDate','notSearchable': true},
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_TYPE'), 'field':'type'},
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_STATUS'), 'field':'status'},                        
                        {'name': $translate.instant('CONTACT_MAN.COMMON.PRIMARY_CONTACT_FIRST_NAME'), 'field': '_embedded.primaryContact.firstName',visible: false},
                        {'name': $translate.instant('CONTACT_MAN.COMMON.PRIMARY_CONTACT_LAST_NAME'), 'field': '_embedded.primaryContact.lastName',visible: false},
                        {'name': $translate.instant('CONTACT_MAN.COMMON.REQUESTER_CONTACT_FIRST_NAME'), 'field': '_embedded.requester.firstName', visible: false},
                        {'name': $translate.instant('CONTACT_MAN.COMMON.REQUESTER_CONTACT_LAST_NAME'), 'field': '_embedded.requester.lastName', visible: false}
                        
                    ],
                     contactSet: [
                        {
                            'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_REQUEST_NUMBER'), 
                            'field': 'requestNumber',
                            'cellTemplate': '<div>' +
                                        '<a href="#" ng-click="grid.appScope.view(row.entity);" ' +
                                        '>{{row.entity.requestNumber}}</a>' +
                                    '</div>'
                        },
                        {
                            'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_DATE'), 
                            'field': 'createDate', 
                            searchOn :'createDate',
                            'notSearchable': true,
                            'cellTemplate': '<div ng-bind="row.entity.getFormattedCreateDate()"></div>'
                        },
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_TYPE'), 'field':'type'},
                        {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_GRID_STATUS'), 'field':'status'},
                                              
                        {'name': $translate.instant('CONTACT_MAN.COMMON.REQUESTER_CONTACT_FIRST_NAME'), 'field': '_embedded.requester.firstName','visible': false},
                        {'name': $translate.instant('CONTACT_MAN.COMMON.REQUESTER_CONTACT_LAST_NAME'), 'field': '_embedded.requester.lastName','visible': false},
                        
                        
                        {
                            'name': $translate.instant('CONTACT_MAN.MANAGE_CONTACTS.TXT_GRID_PHONE'), 
                            'field': 'requester.workPhone', 
                            'cellTemplate': '<div ng-bind="row.entity.getWorkPhone()"></div>',
                            'visible': false
                        },
                        {
                            'name': $translate.instant('CONTACT_MAN.MANAGE_CONTACTS.TXT_GRID_EMAIL'), 
                            'field': '_embedded.requester.email', 
                            'searchOn': 'requester.email',
                            'visible': false
                        },
                        
                       
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
                    },
                    {
                         name: 'getWorkPhone',
                         functionDef: function() {
                            if(this._embedded && this._embedded.requester){
                                return formatter.getPhoneFormat(this._embedded.requester.workPhone);
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

