define(['angular', 'report'], function(angular) {
    'use strict';
    angular.module('mps.report')
    .factory('Reports', ['$translate', 'HATEAOSFactory', '$q', '$http', 'serviceUrl',
            function($translate, HATEAOSFactory, $q, $http, serviceUrl) {
            var Report = {
                params: {page: 0, size: 20, sort: ''},
                serviceName: 'reports',
                embeddedName: 'reportTypes',
                columns: 'default',
                columnDefs: {
                    columns_mp9073: [
                        {'name': $translate.instant('REPORTING.EVENT_TYPE'), 'field': 'type'},
                        {'name': $translate.instant('REPORTING.EVENT_DT'), 'field': 'eventDate', 'cellFilter': 'date:\'yyyy-MM-dd\''},
                        {'name': $translate.instant('REPORTING.MANUFACTURER'), 'field': 'manufacturer'},
                        {'name': $translate.instant('REPORTING.DEVICE'), 'field': 'device'},
                        {'name': $translate.instant('REPORTING.ASSET_TAG'), 'field': 'assetTag'},
                        {'name': $translate.instant('REPORTING.GEO'), 'field': 'geo'},
                        {'name': $translate.instant('REPORTING.ORIG_SN'), 'field':'origSerialNumber'},
                        {'name': $translate.instant('REPORTING.NEW_SN'), 'field': 'newSerialNumber'},
                        {'name': $translate.instant('REPORTING.OLD_ADDRESS'), 'field': 'oldAddress'},
                        {'name': $translate.instant('REPORTING.NEW_ADDRESS'), 'field': 'newAddress'},
                        {'name': $translate.instant('REPORTING.COUNTRY'), 'field': 'country'},
                        {'name': $translate.instant('REPORTING.OLD_IP'), 'field': 'oldIp'},
                        {'name': $translate.instant('REPORTING.NEW_IP'), 'field': 'newIp'},
                        {'name': $translate.instant('REPORTING.OLD_CHL'), 'field': 'oldChl'},
                        {'name': $translate.instant('REPORTING.NEW_CHL'), 'field': 'newChl'}
                    ],
                    columns_mp9058sp: [
                        {'name': $translate.instant('REPORTING.CHL'), 'field': 'chl'},
                        {'name': $translate.instant('REPORTING.ADDRESS_NAME'), 'field': 'addressName'},
                        {'name': $translate.instant('REPORTING.DEVICE'), 'field': 'device'},     
                        {'name': $translate.instant('REPORTING.SERIAL_NUMBER'), 'field': 'serialNumber'},
                        {'name': $translate.instant('REPORTING.ASSET_TAG'), 'field': 'assetTag'},
                        {'name': $translate.instant('REPORTING.DEVICE_TAG_CUSTOMER'), 'field': 'deviceTagCustomer'}
                        /*
                        {'name': $translate.instant('REPORTING.DEVICE_STATUS'), 'field': 'deviceStatus'},     
                        {'name': $translate.instant('REPORTING.LAST_LTPC'), 'field': 'lastLtpc'},
                        {'name': $translate.instant('REPORTING.LAST_LTPC_DATE'), 'field': 'lastLtpcDate', 'cellFilter': 'date:\'yyyy-MM-dd\'' },
                        {'name': $translate.instant('REPORTING.IP_ADDRESS'), 'field': 'ipAddress'},
                        {'name': $translate.instant('REPORTING.HOST_NAME'), 'field': 'hostName'},     
                        {'name': $translate.instant('REPORTING.MAC_ADDRESS'), 'field': 'macAddress'},
                        {'name': $translate.instant('REPORTING.DIVISION'), 'field': 'division'},
                        {'name': $translate.instant('REPORTING.LIFE_CYCLE'), 'field': 'lifeCycle'},
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
                        {'name': $translate.instant('REPORTING.PHY_LOC_1'), 'field': 'phyLoc1'},
                        {'name': $translate.instant('REPORTING.PHY_LOC_2'), 'field': 'phyLoc2'},
                        {'name': $translate.instant('REPORTING.PHY_LOC_3'), 'field': 'phyLoc3'},
                        {'name': $translate.instant('REPORTING.AGREEMENT'), 'field': 'agreement'}
                        */
                    ]
                },    
                route: '/reporting',
                finder: {
                    dateTo: '',
                    dateFrom: '',
                    eventType: ''
                },
                reportParams: [],
                results: [],
                getReport: function(params) {
                    var self = this,
                    serviceObj = {
                        serviceName: 'self',
                        embeddedName: 'reportData'
                    },
                    deferred = $q.defer();

                    if (self.item) {
                        self.getAdditional(self.item, serviceObj, self.reportParams).then(function(res) {
                            self.results = res.data;
                            deferred.resolve();
                        });
                    } else {
                        deferred.resolve();
                    }

                    return deferred.promise;
                }
            };

            return new HATEAOSFactory(Report);
        }
    ]);
});
