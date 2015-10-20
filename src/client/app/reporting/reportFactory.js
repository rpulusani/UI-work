define(['angular', 'report'], function(angular) {
    'use strict';
    angular.module('mps.report')
    .factory('Report', ['serviceUrl', '$translate', '$http', 'HATEAOSFactory',
        function(serviceUrl, $translate, $http, HATEAOSFactory) {
            var Report = {
                serviceName: "report/mp9073",
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
                route: '/reporting'

            };

            return new HATEAOSFactory(Report);
        }
    ]);
});
