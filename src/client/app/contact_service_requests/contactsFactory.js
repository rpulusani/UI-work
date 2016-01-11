define(['angular', 'contact', 'utility.formatters','hateoasFactory.serviceFactory'], function(angular, contact) {
    'use strict';
    angular.module('mps.serviceRequestContacts')
    .factory('Contacts', ['$translate', 'HATEOASFactory', 'FormatterService', '$location',
        function($translate, HATEOASFactory, formatter, $location) {
            var Contacts = {
                serviceName: 'contacts',
                embeddedName: 'contacts',
                columns: 'defaultSet',
                columnDefs: {
                    defaultSet: [
                        {
                            name: $translate.instant('CONTACT.FULLNAME'), 
                            field: 'getFullname()',
                            dynamic: false, // field cannot be removed by column selector
                            cellTemplate: '<div>'+
                                            '<a href="#" ng-click="grid.appScope.contacts.goToUpdate(row.entity);" ng-bind="grid.appScope.getFullname(row.entity)"></a><p>123</p>' +
                                        '</div>'
                        },
                        {name: $translate.instant('CONTACT.WORK_PHONE'), field: 'getWorkPhone()'},
                        {name: $translate.instant('CONTACT.EMAIL'), field: 'email'},
                        {name: $translate.instant('CONTACT.ID'), field: 'id', visible: false, dynamic: false},
                        {name: $translate.instant('CONTACT.TYPE'), field: 'type', visible: false},
                        {name: $translate.instant('CONTACT.DEPARTMENT'), field: 'department', visible: false},
                        {name: $translate.instant('DEVICE_MGT.HOST_NAME'), field:'hostName', visible: false},
                        {name: $translate.instant('DEVICE_MGT.PRODUCT_MODEL'), field:'productModel', visible: false},
                        {name: $translate.instant('DEVICE_MGT.CUSTOMER_DEVICE_TAG'), field:'assetTag', visible: false},
                        {name: $translate.instant('DEVICE_MGT.IP_ADDRESS'), field:'ipAddress', visible: false},
                        {name: $translate.instant('ADDRESS.NAME'), field:'getAddressName()', 'notSearchable': true, visible: false},
                        {name: $translate.instant('LABEL.COST_CENTER'), field:'costCenter', visible: false},
                        {name: $translate.instant('ADDRESS.BUILDING_NAME'), field:'physicalLocation1', visible: false},
                        {name: $translate.instant('ADDRESS.FLOOR_NAME'), field:'physicalLocation2', visible: false},
                        {name: $translate.instant('ADDRESS.SITE_NAME'), field:'physicalLocation3', visible: false},
                        {name: $translate.instant('ADDRESS.CITY'), field:'_embedded.address.city', visible: false},
                        {name: $translate.instant('ADDRESS.STATE'), field:'_embedded.address.state', visible: false},
                        {name: $translate.instant('ADDRESS.STORE_NAME'), field:'_embedded.address.storeFrontName', visible: false},
                        {name: $translate.instant('ADDRESS.ZIP'), field:'_embedded.address.postalCode', visible: false},
                        {name: $translate.instant('CONTACT.FIRST_NAME'), field:'_embedded.contact.firstName', visible: false},
                        {name: $translate.instant('CONTACT.LAST_NAME'), field:'_embedded.contact.lastName', visible: false},
                        {name: $translate.instant('ADDRESS.DISTRICT'), field:'_embedded.address.district', visible: false},
                        {name: $translate.instant('ADDRESS.STATE_PROVINCE'), field:'_embedded.address.province', notSearchable: true, visible: false},
                        {name: $translate.instant('ADDRESS.HOUSE_NUMBER'), field:'_embedded.address.houseNumber', visible: false}
                    ]
                },
                route: '/service_requests/contacts',
                goToCreate: function() {
                    this.item = Contacts.getModel();
                    this.saved = false;

                    $location.path(this.route + '/new');
                },
                goToUpdate: function(contact) {
                    this.setItem(contact);

                    $location.path(this.route + '/' + this.item.id + '/update');
                },
                saveContact: function(contactForm) {
                    var Contacts = this;

                    if (Contacts.item && Contacts.item.id) {
                        Contacts.update(Contacts).then(function() {
                            Contacts.updated = true;
                            Contacts.saved = false;
                            Contacts.goToUpdate();
                        });
                    } else {
                        Contacts.save(Contacts).then(function(r) {
                            Contacts.saved = true;
                            Contacts.goToUpdate();
                        });
                    }
                },
                goToList: function() {
                    $location.path(this.route + '/');
                },
                goToDelete: function(contact) {
                    $location.path(this.route + '/' + contact.id + '/review');
                },
                cancel: function() {
                    $location.path(this.route + '/');
                },
                getModel: function() {
                    return {
                      "id": '',
                      "firstName": '',
                      "middleName": '',
                      "lastName": '',
                      "email": '',
                      "workPhone": '',
                      "alternatePhone": '',
                      "department": '',
                      "type": '',
                      "userFavorite": true,
                      "address": {
                        "id": '',
                        "name": '',
                        "storeFrontName": '',
                        "addressLine1": '',
                        "addressLin2": '',
                        "city": '',
                        "state": '',
                        "stateCode": '',
                        "province": '',
                        "county": '',
                        "countyIsoCode": '',
                        "district": '',
                        "country": '',
                        "postalCode": '',
                        "zoneId": '',
                        "zoneName": '',
                        "lbsIndentifierFlag": true,
                        "region": '',
                        "latitude": '',
                        "longitude": '',
                        "lbsGridX": '',
                        "lbsGridY": '',
                        "_links": {
                          "self": {
                            "href": ''
                          }
                        }
                      },
                      "_links": {
                        "self": {
                          "href": ''
                        },
                        "account": {
                          "href": ''
                        }
                      }
                    }
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

            return new HATEOASFactory(Contacts);
        }
    ]);
});
