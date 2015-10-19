define(['angular', 'address'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestAddresses')
    .factory('Addresses', [ 'serviceUrl', '$translate','HATEAOSFactory',
        function(serviceUrl, $translate, HATEAOSFactory) {
            var Addresses = {

                //customize Address
                serviceName: 'addresses',
                columns: [
                        {'name': 'id', 'field': 'id', visible:false},
                        {'name': $translate.instant('ADDRESS.NAME'), 'field': 'name'},
                        {'name': $translate.instant('ADDRESS.STORE_NAME'), 'field':'storeFrontName'},
                        {'name': $translate.instant('ADDRESS.LINE_1'), 'field':'addressLine1'},
                        {'name': $translate.instant('ADDRESS.LINE_2'), 'field':'addressLine2'},
                        {'name': $translate.instant('ADDRESS.CITY'), 'field': 'city'},
                        {'name': $translate.instant('ADDRESS.STATE_PROVINCE'), 'field': 'stateCode' },
                        {'name': $translate.instant('ADDRESS.ZIP_POSTAL'), 'field': 'postalCode' },
                        {'name': $translate.instant('ADDRESS.COUNTRY'), 'field': 'country', 'width': 120 }
                    ],
                route: '/service_request/addresses'

            };

            return new HATEAOSFactory(Addresses);
        }
    ]);
});
