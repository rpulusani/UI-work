define(['angular', 'report'], function(angular) {
    'use strict';
    angular.module('mps.report')
    .factory('Reports', ['$translate', 'HATEOASFactory',
        function($translate, HATEOASFactory) {
            var Report = {
                params: {page: 0, size: 20, sort: ''},
                serviceName: 'reports',
                embeddedName: 'reportTypes',
                columns: 'defaultSet',
                columnDefs: {
                    defaultSet: [],
                    /* Asset Register */
                    mp9058sp: [
                        {'name': $translate.instant('REPORTING.REPORTING_HIERARCHY'), 'field': 'chl', minWidth: 420},
                        {'name': $translate.instant('REPORTING.ADDRESS_NAME'), 'field': 'addressName', minWidth: 240},
                        {'name': $translate.instant('REPORTING.DEVICE'), 'field': 'device', minWidth: 120},
                        {'name': $translate.instant('REPORTING.SERIAL_NUMBER'), 'field': 'serialNumber', minWidth: 150},
                        {'name': $translate.instant('REPORTING.ASSET_TAG'), 'field': 'assetTag', minWidth: 150},
                        {'name': $translate.instant('REPORTING.DEVICE_TAG_CUSTOMER'), 'field': 'deviceTagCustomer', minWidth: 240},
                        {'name': $translate.instant('REPORTING.DEVICE_STATUS'), 'field': 'deviceStatus', minWidth: 150},
                        {'name': $translate.instant('REPORTING.LAST_LTPC'), 'field': 'lastLtpc', minWidth: 120},
                        {'name': $translate.instant('REPORTING.LAST_LTPC_DATE'), 'field': 'lastLtpcDate', 'cellFilter': 'date:\'yyyy-MM-dd\'', minWidth: 150 },
                        {'name': $translate.instant('REPORTING.IP_ADDRESS'), 'field': 'ipAddress', minWidth: 150},
                        {'name': $translate.instant('REPORTING.HOST_NAME'), 'field': 'hostName', minWidth: 150},
                        {'name': $translate.instant('REPORTING.MAC_ADDRESS'), 'field': 'macAddress', minWidth: 150},
                        {'name': $translate.instant('REPORTING.DIVISION'), 'field': 'division', minWidth: 150},
                        {'name': $translate.instant('REPORTING.LIFE_CYCLE'), 'field': 'lifeCycle', minWidth: 150},
                        {'name': $translate.instant('REPORTING.STORE_FRONT_NAME'), 'field': 'storeFrontName', minWidth: 210},
                        {'name': $translate.instant('REPORTING.COST_CENTER'), 'field': 'costCenter', minWidth: 150},
                        {'name': $translate.instant('REPORTING.DEPT_NUMBER'), 'field': 'departNumber', minWidth: 180},
                        {'name': $translate.instant('REPORTING.DEPT_NAME'), 'field': 'departmentName', minWidth: 180},
                        {'name': $translate.instant('REPORTING.INSTALL_DATE'), 'field': 'installDate', 'cellFilter': 'date:\'yyyy-MM-dd\'', minWidth: 150},
                        {'name': $translate.instant('REPORTING.TERM_START_DATE'), 'field': 'termStartDate', 'cellFilter': 'date:\'yyyy-MM-dd\'', minWidth: 150},
                        {'name': $translate.instant('REPORTING.TERM_END_DATE'), 'field': 'termEndDate', 'cellFilter': 'date:\'yyyy-MM-dd\'', minWidth: 150},
                        {'name': $translate.instant('REPORTING.TERMS'), 'field': 'terms', minWidth: 150},
                        {'name': $translate.instant('REPORTING.ADDRESS'), 'field': 'address', minWidth: 240},
                        {'name': $translate.instant('REPORTING.CITY'), 'field': 'city', minWidth: 150},
                        {'name': $translate.instant('REPORTING.STATE'), 'field': 'state', minWidth: 150},
                        {'name': $translate.instant('REPORTING.PROVINCE'), 'field': 'province', minWidth: 150},
                        {'name': $translate.instant('REPORTING.ZIPCODE'), 'field': 'zipcode', minWidth: 150},
                        {'name': $translate.instant('REPORTING.COUNTY'), 'field': 'county', minWidth: 150},
                        {'name': $translate.instant('REPORTING.COUNTRY'), 'field': 'country', minWidth: 150},
                        {'name': $translate.instant('REPORTING.PHYSICAL_LOC_1'), 'field': 'phyLoc1', minWidth: 240},
                        {'name': $translate.instant('REPORTING.PHYSICAL_LOC_2'), 'field': 'phyLoc2', minWidth: 240},
                        {'name': $translate.instant('REPORTING.PHYSICAL_LOC_3'), 'field': 'phyLoc3', minWidth: 240},
                        {'name': $translate.instant('REPORTING.AGREEMENT'), 'field': 'agreement', minWidth: 150}
                    ],
                    /* MADC */
                    mp9073: [
                        {'name': $translate.instant('REPORTING.ACCOUNT_NAME'), 'field': 'accountName', minWidth: 250},
                        {'name': $translate.instant('REPORTING.ASSET_TAG'), 'field': 'assetTag', minWidth: 150},
                        {'name': $translate.instant('REPORTING.COUNTRY'), 'field': 'country', minWidth: 150},
                        {'name': $translate.instant('REPORTING.DEVICE'), 'field': 'device', minWidth: 150},
                        {'name': $translate.instant('REPORTING.EVENT_DATE'), 'field': 'eventDate', 'cellFilter': 'date:\'yyyy-MM-dd\'', minWidth: 150},
                        {'name': $translate.instant('REPORTING.EVENT_TYPE'), 'field': 'type', minWidth: 150},
                        {'name': $translate.instant('REPORTING.GEO'), 'field': 'geo', minWidth: 150},
                        {'name': $translate.instant('REPORTING.MANUFACTURER'), 'field': 'manufacturer', minWidth: 150},
                        {'name': $translate.instant('REPORTING.NEW_ADDRESS_NAME'), 'field': 'newAddress', minWidth: 240},
                        {'name': $translate.instant('REPORTING.NEW_ASSET_SERIAL_NUMBER'), 'field': 'newSerialNumber', minWidth: 240},
                        {'name': $translate.instant('REPORTING.NEW_IP_ADDRESS'), 'field': 'newIp', minWidth: 150},
                        {'name': $translate.instant('REPORTING.NEW_REPORTING_HIERARCHY'), 'field': 'newChl', minWidth: 240},
                        {'name': $translate.instant('REPORTING.OLD_ADDRESS_NAME'), 'field': 'oldAddress', minWidth: 240},
                        {'name': $translate.instant('REPORTING.OLD_IP_ADDRESS'), 'field': 'oldIp', minWidth: 150},
                        {'name': $translate.instant('REPORTING.OLD_REPORTING_HIERARCHY'), 'field': 'oldChl', minWidth: 240},
                        {'name': $translate.instant('REPORTING.SERIAL_NUMBER'), 'field':'origSerialNumber', minWidth: 150}
                    ],
                    /* Missing Meter Reads */
                    mp0075: [],
                    /* Consumables Orders */
                    mp0021: [],
                    /* Hardware Orders */
                    hw0008: [],
                    /* Pages Billed */
                    pb0001: [],
                    /* Hardware Installation Requests */
                    hw0015: [],
                    /* Service Detail Report */
                    sd0101: []
                },    
                route: '/reporting',
                finder: {
                    dateFrom: '',
                    dateTo: '',
                    eventType: '',
                    eventTypes: [{value: 'Installs'}, {value: 'MC'}, {value: 'Remove - Account'}, {value: 'Manual Swaps'}]
                }
            };

            return new HATEOASFactory(Report);
        }
    ]);
});
