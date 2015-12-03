define(['angular', 'report'], function(angular) {
    'use strict';
    angular.module('mps.report')
    .factory('Reports', ['$translate', 'HATEOASFactory',
        function($translate, HATEOASFactory) {
            var Report = {
                params: {page: 0, size: 20, sort: ''},
                serviceName: 'reports',
                embeddedName: 'reportTypes',
                columns: 'default',
                columnDefs: {
                    /* Asset Register */
                    mp9058sp: [
                        // Reporting Hierarchy
                        {'name': $translate.instant('REPORTING.ADDRESS_NAME'), 'field': 'addressName'},
                        {'name': $translate.instant('REPORTING.DEVICE'), 'field': 'device'},
                        {'name': $translate.instant('REPORTING.SERIAL_NUMBER'), 'field': 'serialNumber'},
                        {'name': $translate.instant('REPORTING.ASSET_TAG'), 'field': 'assetTag'},
                        {'name': $translate.instant('REPORTING.DEVICE_TAG_CUSTOMER'), 'field': 'deviceTagCustomer'},
                        {'name': $translate.instant('REPORTING.DEVICE_STATUS'), 'field': 'deviceStatus'},
                        {'name': $translate.instant('REPORTING.LAST_LTPC'), 'field': 'lastLtpc'},
                        {'name': $translate.instant('REPORTING.LAST_LTPC_DATE'), 'field': 'lastLtpcDate', 'cellFilter': 'date:\'yyyy-MM-dd\'' },
                        {'name': $translate.instant('REPORTING.IP_ADDRESS'), 'field': 'ipAddress'},
                        {'name': $translate.instant('REPORTING.HOST_NAME'), 'field': 'hostName'},
                        {'name': $translate.instant('REPORTING.MAC_ADDRESS'), 'field': 'macAddress'},
                        {'name': $translate.instant('REPORTING.DIVISION'), 'field': 'division'},
                        {'name': $translate.instant('REPORTING.LIFE_CYCLE'), 'field': 'lifeCycle'},
                        // Store_Front_Name
                        {'name': $translate.instant('REPORTING.COST_CENTER'), 'field': 'costCenter'},
                        {'name': $translate.instant('REPORTING.DEPT_NUMBER'), 'field': 'departNumber'},
                        {'name': $translate.instant('REPORTING.DEPT_NAME'), 'field': 'departmentName'},
                        {'name': $translate.instant('REPORTING.INSTALL_DATE'), 'field': 'installDate', 'cellFilter': 'date:\'yyyy-MM-dd\''},
                        {'name': $translate.instant('REPORTING.TERM_START_DATE'), 'field': 'termStartDate', 'cellFilter': 'date:\'yyyy-MM-dd\''},
                        {'name': $translate.instant('REPORTING.TERM_END_DATE'), 'field': 'termEndDate', 'cellFilter': 'date:\'yyyy-MM-dd\''},
                        {'name': $translate.instant('REPORTING.TERMS'), 'field': 'terms'},
                        {'name': $translate.instant('REPORTING.ADDRESS'), 'field': 'address'},
                        {'name': $translate.instant('REPORTING.CITY'), 'field': 'city'},
                        {'name': $translate.instant('REPORTING.STATE'), 'field': 'state'},
                        {'name': $translate.instant('REPORTING.PROVINCE'), 'field': 'province'},
                        {'name': $translate.instant('REPORTING.ZIPCODE'), 'field': 'zipcode'},
                        {'name': $translate.instant('REPORTING.COUNTY'), 'field': 'county'},
                        {'name': $translate.instant('REPORTING.COUNTRY'), 'field': 'country'},
                        {'name': $translate.instant('REPORTING.PHYSICAL_LOC_1'), 'field': 'phyLoc1'},
                        {'name': $translate.instant('REPORTING.PHYSICAL_LOC_2'), 'field': 'phyLoc2'},
                        {'name': $translate.instant('REPORTING.PHYSICAL_LOC_3'), 'field': 'phyLoc3'},
                        {'name': $translate.instant('REPORTING.AGREEMENT'), 'field': 'agreement'}
                    ],
                    /* MADC */
                    mp9073: [
                        {'name': $translate.instant('REPORTING.ACCOUNT_NAME'), 'field': 'accountName'},
                        {'name': $translate.instant('REPORTING.ASSET_TAG'), 'field': 'assetTag'},
                        {'name': $translate.instant('REPORTING.COUNTRY'), 'field': 'country'},
                        {'name': $translate.instant('REPORTING.DEVICE'), 'field': 'device'},
                        {'name': $translate.instant('REPORTING.EVENT_DATE'), 'field': 'eventDate', 'cellFilter': 'date:\'yyyy-MM-dd\''},
                        {'name': $translate.instant('REPORTING.EVENT_TYPE'), 'field': 'type'},
                        {'name': $translate.instant('REPORTING.GEO'), 'field': 'geo'},
                        {'name': $translate.instant('REPORTING.MANUFACTURER'), 'field': 'manufacturer'},
                        {'name': $translate.instant('REPORTING.NEW_ADDRESS_NAME'), 'field': 'newAddress'},
                        {'name': $translate.instant('REPORTING.NEW_ASSET_SERIAL_NUMBER'), 'field': 'newSerialNumber'},
                        {'name': $translate.instant('REPORTING.NEW_IP_ADDRESS'), 'field': 'newIp'},
                        // New Rpt Hierarchy
                        {'name': $translate.instant('REPORTING.OLD_ADDRESS_NAME'), 'field': 'oldAddress'},
                        {'name': $translate.instant('REPORTING.OLD_IP_ADDRESS'), 'field': 'oldIp'},
                        {'name': $translate.instant('REPORTING.SERIAL_NUMBER'), 'field':'origSerialNumber'}
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
