define(['angular', 'address', 'utility.formatters', 'hateoasFactory.serviceFactory'], function(angular, address) {
    'use strict';
    angular.module('mps.serviceRequestAddresses')
    .factory('Addresses', ['$translate', 'serviceUrl', '$location', '$rootScope', 'FormatterService', 'ServiceRequestService', 'HATEOASFactory',
        function($translate, serviceUrl, $location, $rootScope, formatter, ServiceRequest, HATEOASFactory) {
            var Addresses = {
                serviceName: 'addresses',
                embeddedName: 'addresses',
                columns: 'default',
                columnDefs: {
                    defaultSet: [
                        {'name': 'id', 'field': 'id', 'notSearchable': true, visible:false},
                        {'name': $translate.instant('ADDRESS.NAME'), 'field': 'name', width: "17%",
                                'cellTemplate':'<div>' +
                                    '<a href="#" ng-click="grid.appScope.addresses.goToUpdate(row.entity);" ' +
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
                goToUpdate: function(address) {
                        ServiceRequest.reset();
                        if (address) {
                            this.setItem(address);
                        }
                        $location.path(this.route + '/' + this.item.id + '/update');
                    },
                goToDelete: function(address) {
                        ServiceRequest.reset();
                        if (address) {
                            this.setItem(address);
                        }
                        $location.path(this.route + '/delete/' + this.item.id + '/review');
                    }

                };
                
            return new HATEOASFactory(Addresses);
        }
    ]);
});
