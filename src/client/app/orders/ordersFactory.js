

angular.module('mps.orders')
.factory('OrderRequest', ['serviceUrl', '$translate', 'HATEOASFactory', 'FormatterService',
    function(serviceUrl, $translate, HATEOASFactory, formatter) {
        var OrderRequest = {
                serviceName: 'orders',
                embeddedName: 'orders', //get away from embedded name and move to a function to convert url name to javascript name
                columns: 'defaultSet',
                hideBookmark: true,
                columnDefs: {
                    defaultSet: [
                        {'name': $translate.instant('ORDER_MGT.ORDER_NO'), 'field':'requestNumber',
                          'cellTemplate':'<div>' +
                                        '<a href="#" ng-click="grid.appScope.view(row.entity);" ' +
                                        '>{{row.entity.requestNumber}}</a>' +
                                    '</div>'
                        },
                        {'name': $translate.instant('ORDER_MGT.DATE_TIME_CREATED'), 'field': 'getFormattedCreateDate()', 'notSearchable': true},
                        {'name': $translate.instant('ORDER_MGT.ORDER_TYPE'), 'field':'type', width:300, 'notSearchable': true},
                        {'name': $translate.instant('LABEL.COMMON.STATUS'), 'field':'status', 'notSearchable': true},
                        {'name': $translate.instant('SERVICE_REQUEST.COST_CENTER'), 'field':'costCenter', visible: false},
                        {'name': $translate.instant('ORDER_MGT.TRACKING_NUMBER'), 'field':'', visible: false},
                        {'name': $translate.instant('SERVICE_REQUEST.HELPDESK_REFERENCE'), 'field':'customerReferenceId',visible: false},
                        {'name': $translate.instant('ORDER_MGT.PO'), 'field':'purchaseOrderNumber', visible: false},
                        {'name': $translate.instant('SERVICE_REQUEST.PRIMARY_CONTACT'), 'field': 'getFullRequestorName()',visible: false},
                        {'name': $translate.instant('SERVICE_REQUEST.REQUESTOR_CONTACT'), 'field': 'getFullPrimaryName()', 'notSearchable': true, visible: false}
                    ],
                    suppliesSet: [
                        
                        {'name': $translate.instant('ORDER_MGT.ORDER_NO'), 'field':'requestNumber',
                            'cellTemplate':'<div>' +
                                        '<a href="#" ng-click="grid.appScope.view(row.entity);" ' +
                                        '>{{row.entity.requestNumber}}</a>' +
                                    '</div>'
                        },
                        {'name': $translate.instant('ORDER_MGT.DATE_TIME_CREATED'), 'field': 'getFormattedCreateDate()', 'notSearchable': true},
                        {'name': $translate.instant('ORDER_MGT.ORDER_TYPE'), 'field':'type'},
                        {'name': $translate.instant('LABEL.COMMON.STATUS'), 'field':'status'},
                        {'name': $translate.instant('DEVICE_MGT.SERIAL_NO'), 'field':'assetInfo.serialNumber'},
                        {'name': $translate.instant('DEVICE_MGT.CUSTOMER_DEVICE_TAG'), 'field':'assetInfo.assetTag'},
                        {'name': $translate.instant('DEVICE_MGT.PRODUCT_MODEL'), 'field':'assetInfo.productModel'},
                        {'name': $translate.instant('DEVICE_MGT.IP_ADDRESS'), 'field':'assetInfo.ipAddress'},
                        {'name': $translate.instant('DEVICE_MGT.HOST_NAME'), 'field':'assetInfo.hostName'},
                        {'name': $translate.instant('ADDRESS.NAME'), 'field':'status', visible: false},
                        {'name': $translate.instant('ORDER_MGT.TRACKING_NUMBER'), 'field':'', visible: false},
                        {'name': $translate.instant('ADDRESS.STORE_NAME'), 'field':'', visible: false},
                        {'name': $translate.instant('SERVICE_REQUEST.HELPDESK_REFERENCE'), 'field':'customerReferenceId', visible: false},
                        {'name': $translate.instant('SERVICE_REQUEST.COST_CENTER'), 'field':'costCenter', visible: false},
                        {'name': $translate.instant('ORDER_MGT.PO'), 'field':'purchaseOrderNumber', visible: false},
                        {'name': $translate.instant('SERVICE_REQUEST.PRIMARY_CONTACT'), 'field': 'getFullRequestorName()',visible: false},
                        {'name': $translate.instant('SERVICE_REQUEST.REQUESTOR_CONTACT'), 'field': 'getFullPrimaryName()', 'notSearchable': true, visible: false},
                        {'name': $translate.instant('ADDRESS.LINE_1'), 'field': '_embedded.sourceAddress.addressLine1', visible: false},
                        {'name': $translate.instant('ADDRESS.HOUSE_NUMBER'), 'field': '_embedded.sourceAddress.', visible: false},
                        {'name': $translate.instant('ADDRESS.CITY'), 'field': '_embedded.sourceAddress.city', visible: false},
                        {'name': $translate.instant('ADDRESS.STATE'), 'field': '_embedded.sourceAddress.state', visible: false},
                        {'name': $translate.instant('ADDRESS.PROVINCE'), 'field': '_embedded.sourceAddress.province', visible: false},
                        {'name': $translate.instant('ADDRESS.COUNTY'), 'field': '_embedded.sourceAddress.county', visible: false},
                        {'name': $translate.instant('ADDRESS.DISTRICT'), 'field': '_embedded.sourceAddress.district', visible: false},
                        {'name': $translate.instant('ADDRESS.COUNTRY'), 'field': '_embedded.sourceAddress.country', visible: false},
                        {'name': $translate.instant('ADDRESS.ZIP_POSTAL'), 'field': '_embedded.sourceAddress.postalCode', visible: false}
                    ],
                    hardwareSet: [
                       
                        {'name': $translate.instant('ORDER_MGT.ORDER_NO'), 'field':'requestNumber',
                            'cellTemplate':'<div>' +
                                        '<a href="#" ng-click="grid.appScope.view(row.entity);" ' +
                                        '>{{row.entity.requestNumber}}</a>' +
                                    '</div>'
                        },
                        {'name': $translate.instant('ORDER_MGT.DATE_TIME_CREATED'), 'field': 'getFormattedCreateDate()', 'notSearchable': true},
                        {'name': $translate.instant('ORDER_MGT.ORDER_TYPE'), 'field':'type'},
                        {'name': $translate.instant('LABEL.COMMON.STATUS'), 'field':'status'},
                        {'name': $translate.instant('DEVICE_MGT.PRODUCT_MODEL'), 'field':'assetInfo.productModel'},
                        {'name': $translate.instant('ADDRESS.NAME'), 'field':'status', visible: false},
                        {'name': $translate.instant('SERVICE_REQUEST.HELPDESK_REFERENCE'), 'field':'customerReferenceId', visible: false},
                        {'name': $translate.instant('SERVICE_REQUEST.COST_CENTER'), 'field':'costCenter', visible: false},
                        {'name': $translate.instant('ORDER_MGT.PO'), 'field':'purchaseOrderNumber', visible: false},
                        {'name': $translate.instant('SERVICE_REQUEST.PRIMARY_CONTACT'), 'field': 'getFullRequestorName()',visible: false},
                        {'name': $translate.instant('SERVICE_REQUEST.REQUESTOR_CONTACT'), 'field': 'getFullPrimaryName()', 'notSearchable': true, visible: false},
                        {'name': $translate.instant('ORDER_MGT.TRACKING_NUMBER'), 'field':'', visible: false},
                        {'name': $translate.instant('ADDRESS.STORE_NAME'), 'field':'', visible: false},
                        {'name': $translate.instant('ADDRESS.LINE_1'), 'field': '_embedded.sourceAddress.addressLine1', visible: false},
                        {'name': $translate.instant('ADDRESS.HOUSE_NUMBER'), 'field': '_embedded.sourceAddress.', visible: false},
                        {'name': $translate.instant('ADDRESS.CITY'), 'field': '_embedded.sourceAddress.city', visible: false},
                        {'name': $translate.instant('ADDRESS.STATE'), 'field': '_embedded.sourceAddress.state', visible: false},
                        {'name': $translate.instant('ADDRESS.PROVINCE'), 'field': '_embedded.sourceAddress.province', visible: false},
                        {'name': $translate.instant('ADDRESS.COUNTY'), 'field': '_embedded.sourceAddress.county', visible: false},
                        {'name': $translate.instant('ADDRESS.DISTRICT'), 'field': '_embedded.sourceAddress.district', visible: false},
                        {'name': $translate.instant('ADDRESS.COUNTRY'), 'field': '_embedded.sourceAddress.country', visible: false},
                        {'name': $translate.instant('ADDRESS.ZIP_POSTAL'), 'field': '_embedded.sourceAddress.postalCode', visible: false}
                    ],
                    singleAssetOrderSet:[
                        
                        {'name': $translate.instant('ORDER_MGT.DATE'), 'field': 'getFormattedCreateDate()', 'notSearchable': true},
                        {'name': $translate.instant('ORDER_MGT.ORDER_NO'), 'field':'requestNumber',
                            'cellTemplate':'<div>' +
                                        '<a href="#" ng-click="grid.appScope.view(row.entity);" ' +
                                        '>{{row.entity.requestNumber}}</a>' +
                                    '</div>'
                        },
                        {'name': $translate.instant('LABEL.COMMON.STATUS'), 'field':'status'},
                        {'name': $translate.instant('ORDER_MGT.ORDER_TYPE'), 'field':'type'}
                    ],
                    suppliesCatalogSet:[
                        
                        {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.TXT_GRID_SUPPLIES_TYPE'),
                            'field':''},
                        {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.TXT_GRID_ORDER_PART_NUM'),
                            'field':''},
                        {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.TXT_GRID_SUPPLIES_DESC'), 'field':''},
                        {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.TXT_GRID_ORDER_PRICE'), 'field':''}

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

                route: '/orders'
        };

    return  new HATEOASFactory(OrderRequest);
}]);

