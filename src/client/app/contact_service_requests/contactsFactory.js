define(['angular', 'contact', 'utility.formatters','hateoasFactory.serviceFactory'], function(angular, contact) {
    'use strict';
    angular.module('mps.serviceRequestContacts')
    .factory('Contacts', ['$translate', 'HATEOASFactory', 'FormatterService', '$location', '$rootScope', 'serviceUrl',
        function($translate, HATEOASFactory, formatter, $location, $rootScope, serviceUrl) {
            var Contacts = {
                serviceName: 'contacts',
                embeddedName: 'contacts',
                columns: 'defaultSet',
                columnDefs: {
                    defaultSet: [
                        {
                            name: $translate.instant('CONTACT.FULLNAME'),
                            field: 'getFullname()',
                            dynamic: false,
                            cellTemplate: '<div><a href="#" ng-click="grid.appScope.contacts.goToUpdate(row.entity);" ' +
                                'ng-bind="grid.appScope.getFullname(row.entity)"></a></div>'
                        },
                        {name: $translate.instant('CONTACT.WORK_PHONE'), field: 'getWorkPhone()'},
                        {name: $translate.instant('CONTACT.EMAIL'), field: 'email'},
                        {name: $translate.instant('CONTACT.ID'), field: 'id', visible: false, dynamic: false},
                        {name: $translate.instant('LABEL.COST_CENTER'), field:'costCenter', visible: false},
                        {name: $translate.instant('CONTACT.FIRST_NAME'), field:'_embedded.contact.firstName', visible: false},
                        {name: $translate.instant('CONTACT.LAST_NAME'), field:'_embedded.contact.lastName', visible: false}
                    ]
                },
                route: '/service_requests/contacts',
                needsToVerify: false, // if verify directive needs to be displayed
                createSRFromContact: function(contact, srType) {
                    var sr = {
                        id: '',
                        type: '',
                        _links: {
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

                    if (!contact && this.item) {
                        contact = this.item;
                    }

                    if (!srType) {
                        srType = 'DATA_CONTACT_REMOVE';
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
                goToUpdate: function(contact) {
                    if (contact) {
                        this.setItem(contact);
                    }

                    window.scrollTo(0,0)

                    $location.path(this.route + '/' + this.item.id + '/update');
                },
                goToList: function() {
                    this.wasSaved = false;
                    this.submitedSR = false;

                    $location.path(this.route + '/');
                },
                goToReview: function(contact) {
                    if (contact) {
                        this.setItem(contact);
                    }
             
                    $location.path(this.route + '/' + contact.id + '/review');
                },
                goToDelete: function(contact) {
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
                        firstName: '',
                        lastName: '',
                        address: {
                           country: ''
                        },
                        _links: {
                            account: {
                                href: ''
                            }
                        }
                    };
                },
                beforeSave: function(contact, deferred) {
                    contact._links.account.href = $rootScope.currentUser.accounts.url;

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

            return new HATEOASFactory(Contacts);
        }
    ]);
});
