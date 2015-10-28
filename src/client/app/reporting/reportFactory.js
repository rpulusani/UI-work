define(['angular', 'report'], function(angular) {
    'use strict';
    angular.module('mps.report')
    .factory('Reports', ['$translate', 'HATEAOSFactory', '$q', '$http',
        function($translate, HATEAOSFactory, $q, $http) {
            var Report = {
                params: {page: 0, size: 20, sort: ''},
                embeddedName: 'mp9073Dtoes',
                serviceName: 'reports',
                columns: [
                    {'name': $translate.instant('REPORTING.TYPE'), 'field': 'type'},
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

                route: '/reporting',
                category: null, // category object from categories[]
                categories: [],
                finder: {
                    dateTo: '',
                    dateFrom: '',
                    eventType: ''
                },
                getTypes: function() {
                    var self = this,
                    deferred = $q.defer();

                    $http.get('/reports/types').success(function(res) {
                        self.categories = res._embedded.types;
                        deferred.resolve(self.categories);
                    });

                    return deferred.promise;
                }
            };

            return new HATEAOSFactory(Report);
        }
    ]);
});
