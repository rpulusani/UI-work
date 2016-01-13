define(['angular', 'address'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestAddresses')
    .factory('Addresses', ['serviceUrl', '$translate', '$rootScope', 'HATEOASFactory',
        function(serviceUrl, $translate, rootScope, HATEOASFactory) {
            var Addresses = {
                //customize Address
                serviceName: 'addresses',
                singular: 'address',
                embeddedName: 'addresses',
                columns: 'default',
                columnDefs: {
                    defaultSet: [
                        {'name': 'id', 'field': 'id', 'notSearchable': true, visible:false},
                        {'name': $translate.instant('ADDRESS.NAME'), 'field': 'name', width: "17%",
                                'cellTemplate':'<div>' +
                                    '<a href="#" ng-click="grid.appScope.view(row.entity);" ' +
                                    'ng-if="grid.appScope.addressAccess">{{row.entity.name}}</a>' +
                                    '<span ng-if="!grid.appScope.addressAccess">{{row.entity.name}}</span>' +
                                '</div>'
                        },
                        {'name': $translate.instant('ADDRESS.STORE_NAME'), 'field':'storeFrontName', visible:false, 'notSearchable': true},
                        {'name': $translate.instant('ADDRESS.LINE_1'), 'field':'addressLine1'},
                        {'name': $translate.instant('ADDRESS.LINE_2'), 'field':'addressLine2'},
                        {'name': $translate.instant('ADDRESS.REGION'), 'field':'region'},
                        {'name': $translate.instant('ADDRESS.CITY'), 'field': 'city'},
                        {'name': $translate.instant('ADDRESS.STATE'), 'field': 'stateCode'},
                        {'name': $translate.instant('ADDRESS.PROVINCE'), 'field': 'province'},
                        {'name': $translate.instant('ADDRESS.ZIP_POSTAL'), 'field': 'postalCode'},
                        {'name': $translate.instant('ADDRESS.COUNTRY'), 'field': 'country'},
                        {'name': $translate.instant('ADDRESS.COUNTY'), 'field': 'county'},
                        {'name': $translate.instant('ADDRESS.DISTRICT'), 'field': 'district'},
                        {'name': $translate.instant('ADDRESS.HOUSE_NUMBER'), 'field': 'houseNumber'}
                    ]
                },
                route: '/service_requests/addresses',
            };

            return new HATEOASFactory(Addresses);
        }
    ]);
});
