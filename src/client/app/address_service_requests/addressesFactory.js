define(['angular', 'address', 'utility.formatters', 'hateoasFactory.serviceFactory'], function(angular, address) {
    'use strict';
    angular.module('mps.serviceRequestAddresses')
    .factory('Addresses', ['$translate', 'serviceUrl', '$location', '$rootScope', 'FormatterService', 'HATEOASFactory',
        function($translate, serviceUrl, $location, $rootScope, formatter, HATEOASFactory) {
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
                createSRFromAddress: function(address, srType) {
                    var sr = {
                        id: '',
                        type: '',
                        _links: {
                            self:{
                                href: ''
                            },
                            account: {
                              href: ''
                            },
                            primaryContact: {
                              href: ''
                            },
                            requester: {
                              href: ''
                            }
                        }
                    };

                    if (!address && this.item) {
                        address = this.item;
                    }

                    if (!srType) {
                        srType = 'DATA_ADDRESS_REMOVE';
                        sr.type = srType;
                    }

                    sr._links.account = $rootScope.currentUser.accounts.url;
                    sr._links.primaryContact = this.url + '/' + this.item.id;
                    sr._links.requester = this.url + '/' + this.item.id;

                    return sr;
                },
                goToCreate: function() {
                    this.wasSaved = false;
                    this.item = this.getModel();

                    $location.path(this.route + '/new');
                },
                goToUpdate: function(address) {
                    if (address) {
                        this.setItem(address);
                    }

                    window.scrollTo(0,0);

                    $location.path(this.route + '/' + this.item.id + '/update');
                },
                goToList: function() {
                    this.wasSaved = false;
                    this.submitedSR = false;

                    $location.path(this.route + '/');
                },
                goToReview: function(address) {
                    if (address) {
                        this.setItem(address);
                    }
             
                    $location.path(this.route + '/' + address.id + '/review');
                },
                goToDelete: function(address) {
                    $location.path(this.route + '/' + this.item.id + '/receipt');
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
                },
                getModel: function() {
                    return {
                        name: '',
                        storeFrontName: '',
                        country: '',
                        addressLine1: '',
                        addressLine2: '',
                        city: '',
                        state: '',
                        postalCode: '',
                        contact: {
                           firstName: '',
                           lastName: ''
                        },
                        _links: {
                            account: {
                                href: ''
                            }
                        }
                    };
                },
                beforeSave: function(address, deferred) {
                    address._links.account.href = $rootScope.currentUser.accounts.url;

                    deferred.resolve(true, contact);
                },
                functionArray: [
                    {
                        name: 'getFullname',
                        functionDef: function() {
                            return formatter.getFullName(this.firstName, this.lastName, this.middleName);
                        }
                    },
                    {
                        name: 'getWorkPhone',
                        functionDef: function(){
                            return formatter.getPhoneFormat(this.workPhone);
                        }
                    },
                    {
                        name: 'getAltPhone',
                        functionDef: function(){
                            return formatter.getPhoneFormat(this.alternatePhone);
                        }
                    }
                ]
            };

            return new HATEOASFactory(Addresses);
        }
    ]);
});
