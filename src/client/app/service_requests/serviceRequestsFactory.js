define(['angular', 'serviceRequest', 'hateoasFactory.serviceFactory', 'utility.formatters'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequests')
    .factory('ServiceRequestService', ['serviceUrl', '$translate', 'HATEOASFactory', 'FormatterService',
        function(serviceUrl, $translate, HATEOASFactory, formatter) {
            var ServiceRequests = {
                    serviceName: 'service-requests',
                    embeddedName: 'serviceRequests', //get away from embedded name and move to a function to convert url name to javascript name
                    columns: 'defaultSet',
                    columnDefs: {
                        defaultSet: [
                            {'name': 'id', 'field': 'id', visible:false, 'notSearchable': true},
                            {'name': $translate.instant('SERVICE_REQUEST.REQUEST_NUMBER'), 'field':'requestNumber',
                             'cellTemplate':'<div>' +
                                            '<a href="#" ng-click="grid.appScope.view(row.entity);" ' +
                                            '>{{row.entity.requestNumber}}</a>' +
                                        '</div>'
                            },
                            {'name': $translate.instant('LABEL.DATE'), 'field': 'getFormattedCreateDate()', 'notSearchable': true},
                            {'name': $translate.instant('LABEL.TYPE'), 'field':'type'},
                            {'name': $translate.instant('LABEL.STATUS'), 'field':'status'},
                            {'name': $translate.instant('SERVICE_REQUEST.REQUESTOR_CONTACT'), 'field': 'getFullPrimaryName()', 'notSearchable': true},
                            {'name': $translate.instant('SERVICE_REQUEST.PRIMARY_CONTACT'), 'field': 'getFullRequestorName()',visible: false},
                            {'name': $translate.instant('SERVICE_REQUEST.HELPDESK_REFERENCE'), 'field':'customerReferenceId',visible: false},
                            {'name': $translate.instant('SERVICE_REQUEST.COST_CENTER'), 'field':'costCenter',visible: false}
                        ],
                        madcSet: [
                            {'name': 'id', 'field': 'id', visible:false, 'notSearchable': true},
                            {'name': $translate.instant('SERVICE_REQUEST.REQUEST_NUMBER'), 'field':'requestNumber'},
                            {'name': $translate.instant('LABEL.DATE'), 'field': 'getFormattedCreateDate()', 'notSearchable': true},
                            {'name': $translate.instant('LABEL.TYPE'), 'field':'type', 'notSearchable': true},
                            {'name': $translate.instant('LABEL.STATUS'), 'field':'status', 'notSearchable': true},
                            {'name': $translate.instant('SERVICE_REQUEST.HELPDESK_REFERENCE'), 'field':'customerReferenceId'},
                            {'name': $translate.instant('SERVICE_REQUEST.COST_CENTER'), 'field':'costCenter'},
                            {'name': $translate.instant('SERVICE_REQUEST.PRIMARY_CONTACT'), 'field': 'getFullPrimaryName()', visible: false, 'notSearchable': true},
                            {'name': $translate.instant('SERVICE_REQUEST.REQUESTOR_CONTACT'), 'field': 'getFullRequestorName()', visible: false, 'notSearchable': true}
                        ],
                        madcSetSR: [
                            {'name': 'id', 'field': 'id', visible:false, 'notSearchable': true},
                            {'name': $translate.instant('SERVICE_REQUEST.REQUEST_NUMBER'), 'field':'requestNumber',
                            'cellTemplate':'<div>' +
                                            '<a href="#" ng-click="grid.appScope.view(row.entity);" ' +
                                            '>{{row.entity.requestNumber}}</a>' +
                                        '</div>'},
                            {'name': $translate.instant('LABEL.DATE'), 'field': 'getFormattedCreateDate()', 'notSearchable': true},
                            {'name': $translate.instant('LABEL.TYPE'), 'field':'type', 'notSearchable': true},
                            {'name': $translate.instant('LABEL.STATUS'), 'field':'status', 'notSearchable': true},
                            {'name': $translate.instant('DEVICE_MGT.SERIAL_NO'), 'field':'assetInfo.serialNumber', 'notSearchable': true},
                            {'name': $translate.instant('DEVICE_MGT.CUSTOMER_DEVICE_TAG'), 'field':'assetInfo.assetTag', 'notSearchable': true},
                            {'name': $translate.instant('DEVICE_MGT.PRODUCT_MODEL'), 'field':'assetInfo.productModel', 'notSearchable': true},
                            {'name': $translate.instant('DEVICE_MGT.IP_ADDRESS'), 'field':'assetInfo.ipAddress', 'notSearchable': true},
                            {'name': $translate.instant('DEVICE_MGT.HOST_NAME'), 'field':'assetInfo.hostName', 'notSearchable': true},
                            {'name': $translate.instant('ADDRESS.NAME'), 'field':'', visible: false},
                            {'name': $translate.instant('ADDRESS.STORE_NAME'), 'field':'', visible: false},
                            {'name': $translate.instant('SERVICE_REQUEST.HELPDESK_REFERENCE'), 'field':'customerReferenceId', visible: false},
                            {'name': $translate.instant('SERVICE_REQUEST.COST_CENTER'), 'field':'costCenter', visible: false},
                            {'name': $translate.instant('SERVICE_REQUEST.PO'), 'field': '', visible: false},
                            {'name': $translate.instant('SERVICE_REQUEST.PRIMARY_CONTACT'), 'field': 'getFullPrimaryName()', visible: false},
                            {'name': $translate.instant('SERVICE_REQUEST.REQUESTOR_CONTACT'), 'field': 'getFullRequestorName()', visible: false},
                            {'name': $translate.instant('ADDRESS.LINE_1'), 'field': '', visible: false},
                            {'name': $translate.instant('ADDRESS.HOUSE_NUMBER'), 'field': '', visible: false},
                            {'name': $translate.instant('ADDRESS.CITY'), 'field': '', visible: false},
                            {'name': $translate.instant('ADDRESS.STATE'), 'field': '', visible: false},
                            {'name': $translate.instant('ADDRESS.STATE_PROVINCE'), 'field': '', visible: false},
                            {'name': $translate.instant('ADDRESS.COUNTY'), 'field': '', visible: false},
                            {'name': $translate.instant('ADDRESS.DISTRICT'), 'field': '', visible: false},
                            {'name': $translate.instant('ADDRESS.COUNTRY'), 'field': '', visible: false},
                            {'name': $translate.instant('ADDRESS.ZIP_POSTAL'), 'field': '', visible: false}
                        ],
                        breakfixSRSet: [
                            {'name': 'id', 'field': 'id', visible:false, 'notSearchable': true},
                            {'name': $translate.instant('SERVICE_REQUEST.REQUEST_NUMBER'), 'field':'requestNumber',
                            'cellTemplate':'<div>' +
                                            '<a href="#" ng-click="grid.appScope.view(row.entity);" ' +
                                            '>{{row.entity.requestNumber}}</a>' +
                                        '</div>'},
                            {'name': $translate.instant('LABEL.DATE'), 'field': 'getFormattedCreateDate()', 'notSearchable': true},
                            {'name': $translate.instant('LABEL.STATUS'), 'field':'status', 'notSearchable': true},
                             {'name': $translate.instant('DEVICE_MGT.SERIAL_NO'), 'field':'_embedded.asset.serialNumber', 'notSearchable': true},
                            {'name': $translate.instant('DEVICE_MGT.CUSTOMER_DEVICE_TAG'), 'field':'_embedded.asset.assetTag', 'notSearchable': true},
                            {'name': $translate.instant('DEVICE_MGT.PRODUCT_MODEL'), 'field':'_embedded.asset.productModel', 'notSearchable': true},
                            {'name': $translate.instant('DEVICE_MGT.IP_ADDRESS'), 'field':'_embedded.asset.ipAddress', 'notSearchable': true},
                            {'name': $translate.instant('DEVICE_MGT.HOST_NAME'), 'field':'_embedded.asset.hostName', 'notSearchable': true},
                            {'name': $translate.instant('ADDRESS.NAME'), 'field':'_embedded.sourceAddress.name', visible: false},
                            {'name': $translate.instant('ADDRESS.STORE_NAME'), 'field':'_embedded.sourceAddress.storeFrontName', visible: false},
                            {'name': $translate.instant('SERVICE_REQUEST.HELPDESK_REFERENCE'), 'field':'customerReferenceId', visible: false},
                            {'name': $translate.instant('SERVICE_REQUEST.COST_CENTER'), 'field':'costCenter', visible: false},
                            {'name': $translate.instant('SERVICE_REQUEST.PO'), 'field': '', visible: false},
                            {'name': $translate.instant('SERVICE_REQUEST.PRIMARY_CONTACT'), 'field': 'getFullPrimaryName()', visible: false},
                            {'name': $translate.instant('SERVICE_REQUEST.REQUESTOR_CONTACT'), 'field': 'getFullRequestorName()', visible: false},
                            {'name': $translate.instant('ADDRESS.LINE_1'), 'field': '_embedded.sourceAddress.addressLine1', visible: false},
                            {'name': $translate.instant('ADDRESS.HOUSE_NUMBER'), 'field': '_embedded.sourceAddress.', visible: false},
                            {'name': $translate.instant('ADDRESS.CITY'), 'field': '_embedded.sourceAddress.city', visible: false},
                            {'name': $translate.instant('ADDRESS.STATE'), 'field': '_embedded.sourceAddress.state', visible: false},
                            {'name': $translate.instant('ADDRESS.STATE_PROVINCE'), 'field': '_embedded.sourceAddress.province', visible: false},
                            {'name': $translate.instant('ADDRESS.COUNTY'), 'field': '_embedded.sourceAddress.county', visible: false},
                            {'name': $translate.instant('ADDRESS.DISTRICT'), 'field': '_embedded.sourceAddress.district', visible: false},
                            {'name': $translate.instant('ADDRESS.COUNTRY'), 'field': '_embedded.sourceAddress.country', visible: false},
                            {'name': $translate.instant('ADDRESS.ZIP_POSTAL'), 'field': '_embedded.sourceAddress.postalCode', visible: false}
                        ],
                        breakfixSet: [
                            {'name': 'id', 'field': 'id', visible:false, 'notSearchable': true},
                            {'name': $translate.instant('SERVICE_REQUEST.REQUEST_NUMBER'), 'field':'requestNumber'},
                            {'name': $translate.instant('LABEL.DATE'), 'field': 'getFormattedCreateDate()', 'notSearchable': true},
                            {'name': $translate.instant('LABEL.STATUS'), 'field':'status', 'notSearchable': true},
                            {'name': $translate.instant('SERVICE_REQUEST.COST_CENTER'), 'field':'costCenter'},
                            {'name': $translate.instant('DEVICE_SERVICE_REQUEST.PROBLEM_DESCRIPTION'), 'field':'description'},
                            {'name': $translate.instant('DEVICE_SERVICE_REQUEST.RESOLUTION'), 'field':''},
                            {'name': $translate.instant('SERVICE_REQUEST.PRIMARY_CONTACT'), 'field': 'getFullPrimaryName()', visible: false},
                            {'name': $translate.instant('SERVICE_REQUEST.REQUESTOR_CONTACT'), 'field': 'getFullRequestorName()', visible: false},
                            {'name': $translate.instant('SERVICE_REQUEST.HELPDESK_REFERENCE'), 'field':'customerReferenceId', visible: false},
                        ],
                        addressSet: [
                            {'name': 'id', 'field': 'id', visible:false, 'notSearchable': true},
                            {'name': $translate.instant('SERVICE_REQUEST.REQUEST_NUMBER'), 'field':'requestNumber',
                            'cellTemplate':'<div>' +
                                            '<a href="#" ng-click="grid.appScope.view(row.entity);" ' +
                                            '>{{row.entity.requestNumber}}</a>' +
                                        '</div>'},
                            {'name': $translate.instant('LABEL.DATE'), 'field': 'getFormattedCreateDate()', 'notSearchable': true},
                            {'name': $translate.instant('LABEL.STATUS'), 'field':'status', 'notSearchable': true},
                            {'name': $translate.instant('ADDRESS.NAME'), 'field':'', visible: true},
                            {'name': $translate.instant('CONTACT.ADDRESS'), 'field':'', visible: true},
                            {'name': $translate.instant('ADDRESS.STORE_NAME'), 'field':'', visible: false},
                            {'name': $translate.instant('SERVICE_REQUEST.PRIMARY_CONTACT'), 'field': 'getFullPrimaryName()', visible: false},
                            {'name': $translate.instant('SERVICE_REQUEST.REQUESTOR_CONTACT'), 'field': 'getFullRequestorName()', visible: false}
                        ],
                         contactSet: [
                            {'name': 'id', 'field': 'id', visible:false, 'notSearchable': true},
                            {'name': $translate.instant('SERVICE_REQUEST.REQUEST_NUMBER'), 'field':'requestNumber',
                            'cellTemplate':'<div>' +
                                            '<a href="#" ng-click="grid.appScope.view(row.entity);" ' +
                                            '>{{row.entity.requestNumber}}</a>' +
                                        '</div>'},
                            {'name': $translate.instant('LABEL.DATE'), 'field': 'getFormattedCreateDate()', 'notSearchable': true},
                            {'name': $translate.instant('LABEL.STATUS'), 'field':'status', 'notSearchable': true},
                            {'name': $translate.instant('CONTACT.FULLNAME'), 'field':'', 'notSearchable': true},
                            {'name': $translate.instant('CONTACT.WORK_PHONE'), 'field':'', 'notSearchable': true},
                            {'name': $translate.instant('ADDRESS.LINE_1'), 'field': '', visible: false},
                            {'name': $translate.instant('ADDRESS.LINE_2'), 'field': '', visible: false},
                            {'name': $translate.instant('ADDRESS.HOUSE_NUMBER'), 'field': '', visible: false},
                            {'name': $translate.instant('ADDRESS.CITY'), 'field': '', visible: false},
                            {'name': $translate.instant('ADDRESS.STATE'), 'field': '', visible: false},
                            {'name': $translate.instant('ADDRESS.STATE_PROVINCE'), 'field': '', visible: false},
                            {'name': $translate.instant('ADDRESS.COUNTY'), 'field': '', visible: false},
                            {'name': $translate.instant('ADDRESS.DISTRICT'), 'field': '', visible: false},
                            {'name': $translate.instant('ADDRESS.COUNTRY'), 'field': '', visible: false},
                            {'name': $translate.instant('ADDRESS.ZIP_POSTAL'), 'field': '', visible: false},
                            {'name': $translate.instant('SERVICE_REQUEST.PRIMARY_CONTACT'), 'field': 'getFullPrimaryName()', visible: false},
                            {'name': $translate.instant('SERVICE_REQUEST.REQUESTOR_CONTACT'), 'field': 'getFullRequestorName()', visible: false}
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
});
