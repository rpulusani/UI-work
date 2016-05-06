
angular.module('mps.serviceRequestAddresses')
.factory('Addresses', ['$translate', 'serviceUrl', '$location', '$rootScope', 'FormatterService', 'ServiceRequestService', 'HATEOASFactory',
    function($translate, serviceUrl, $location, $rootScope, formatter, ServiceRequest, HATEOASFactory) {
        var Addresses = {
            serviceName: 'addresses',
            embeddedName: 'addresses',
            columns: 'default',
            hideBookmark: true,
            columnDefs: {
                defaultSet: [
                    {'name': 'id', 'field': 'id', 'notSearchable': true, visible:false, dynamic: false},
                    {'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_ADDRESS_NAME'), 'field': 'addressName', width: "17%",
                            'cellTemplate':'<div>' +
                                '<a href="#" ng-click="grid.appScope.addresses.goToUpdate(row.entity);" ' +
                                'ng-if="grid.appScope.addressAccess">{{row.entity.name}}</a>' +
                                '<span ng-if="!grid.appScope.addressAccess">{{row.entity.name}}</span>' +
                            '</div>'
                    },
                    {'name': $translate.instant('ADDRESS.STORE_NAME'), 'field':'storeFrontName', visible:false},
                    {'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_ADDRESS_1'), 'field':'addressLine1'},
                    {'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_ADDRESS_2'), 'field':'addressLine2'},
                    {'name': $translate.instant('ADDRESS.REGION'), 'field':'region'},
                    {'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_CITY'), 'field': 'city'},
                    {'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_STATE'), 'field': 'stateFullName'},
                    {'name': $translate.instant('ADDRESS.PROVINCE'), 'field': 'province'},
                    {'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_ZIP_CODE'), 'field': 'postalCode'},
                    {'name': $translate.instant('ADDRESS_MAN.COMMON.TXT_COUNTRY'), 'field': 'country'},
                    {'name': $translate.instant('ADDRESS.COUNTY'), 'field': 'county'},
                    {'name': $translate.instant('ADDRESS.DISTRICT'), 'field': 'district'},
                    {'name': $translate.instant('ADDRESS.HOUSE_NUMBER'), 'field': 'houseNumber'}
                ]
            },
            route: '/service_requests/addresses',
            goToUpdate: function(address) {
                    ServiceRequest.reset();
                    ServiceRequest.newMessage();
                    if (address) {
                        this.setItem(address);
                    }
                    $location.path(this.route + '/' + this.item.id + '/update');
                },
            goToDelete: function(address) {
                    ServiceRequest.reset();
                    ServiceRequest.newMessage();
                    if (address) {
                        this.setItem(address);
                    }
                    $location.path(this.route + '/delete/' + this.item.id + '/review');
                },
            verifyAddress: function(addressObj, fn) {
                    this.get({
                        method: 'post',
                        url: serviceUrl + 'address-validation',
                        data: addressObj,
                        preventDefaultParams: true
                    }).then(function(bodsRes) {
                        return fn(bodsRes.status, bodsRes.data);
                    });
                }
            };

        return new HATEOASFactory(Addresses);
    }
]);
