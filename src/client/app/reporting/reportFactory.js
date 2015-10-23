define(['angular', 'report'], function(angular) {
    'use strict';
    angular.module('mps.report')
    .factory('Reports', ['$translate', 'HATEAOSFactory',
        function($translate, HATEAOSFactory) {
            var Report = {
                url: 'http://10.188.121.79:8080/mps/reports',
                serviceName: 'reports',
                columns: [
                    {'name': $translate.instant('REPORTING.MP9073.TYPE'), 'field': 'type'},
                    {'name': $translate.instant('REPORTING.MP9073.EVENT_DT'), 'field':'eventDate', 'cellFilter': 'date:\'yyyy-MM-dd\''},
                    {'name': $translate.instant('REPORTING.MP9073.MANUFACTURER'), 'field': 'manufacturer'},
                    {'name': $translate.instant('REPORTING.MP9073.DEVICE'), 'field':'device'},
                    {'name': $translate.instant('REPORTING.MP9073.ASSET_TAG'), 'field': 'assetTag'},
                    {'name': $translate.instant('REPORTING.MP9073.ORIG_SN'), 'field':'origSerialNumber'},
                    {'name': $translate.instant('REPORTING.MP9073.NEW_SN'), 'field': 'newSerialNumber'},
                    {'name': $translate.instant('REPORTING.MP9073.OLD_ADDRESS'), 'field': 'oldAddress'},
                    {'name': $translate.instant('REPORTING.MP9073.NEW_ADDRESS'), 'field': 'newAddress'},
                    {'name': $translate.instant('REPORTING.MP9073.GEO'), 'field': 'geo'},
                    {'name': $translate.instant('REPORTING.MP9073.COUNTRY'), 'field': 'country'},
                    {'name': $translate.instant('REPORTING.MP9073.OLD_IP'), 'field': 'oldIp'},
                    {'name': $translate.instant('REPORTING.MP9073.NEW_IP'), 'field': 'newIp'},
                    {'name': $translate.instant('REPORTING.MP9073.OLD_CHL'), 'field': 'oldChl'},
                    {'name': $translate.instant('REPORTING.MP9073.NEW_CHL'), 'field': 'newChl'}
                ],
                route: '/reporting',
                category: {}, // category object from categories[]
                categories: [
                    {
                        id: '123',
                        name: 'Asset register (MP9058SP)'
                    },
                    {
                        id:'913',
                        name: 'MADC (MP9073)',
                        eventTypes: ['Remove - Account', 'MC', 'Installs', 'Manual Swaps']
                    },
                    {
                        id:'456',
                        name: 'Missing Meter Reads (MP0075)'
                    },
                    {
                        id:'789',
                        name: 'Consumables Orders (MP0021)'
                    },
                    {
                        id: '910',
                        name: 'Hardware Orders (HW0008)'
                    },
                    {
                        id: '911',
                        name: 'Pages Billed'
                    },
                    {
                        id:'912',
                        name: 'Hardware Installation Requests'
                    },
                    {
                        id:'914',
                        name: 'Service Detail Report (SD 0101/EM0034)'
                    }
                ]
            };

            return new HATEAOSFactory(Report);
        }
    ]);
});
