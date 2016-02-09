define(['angular', 'contact', 'utility.formatters','hateoasFactory.serviceFactory'], function(angular, contact) {
    'use strict';
    angular.module('mps.serviceRequestContacts')
    .factory('Contacts', ['$translate', 'HATEOASFactory', 'FormatterService', '$location', '$rootScope', 'serviceUrl', 'UserService', 'ServiceRequestService',
        function($translate, HATEOASFactory, formatter, $location, $rootScope, serviceUrl, Users, ServiceRequest) {
            var Contacts = {
                serviceName: 'contacts',
                embeddedName: 'contacts',
                url: serviceUrl + 'contacts',
                columns: 'defaultSet',
                columnDefs: {
                    defaultSet: [
                        {
                            name: $translate.instant('CONTACT.FULLNAME'),
                            field: 'getFullname()',
                            dynamic: false,
                            searchOn: 'firstName',
                            cellTemplate: '<div><a href="#" ng-click="grid.appScope.contacts.goToUpdate(row.entity);" ' +
                                'ng-bind="row.entity.getFullname()"></a></div>'
                        },
                        {
                            name: $translate.instant('CONTACT.WORK_PHONE'),
                            field: 'getWorkPhone()',
                            searchOn: 'workPhone'
                        },
                        {
                            name: $translate.instant('CONTACT.EMAIL'),
                            field: 'email',
                            searchOn: 'emailAddress'
                        },
                        {
                            name: $translate.instant('CONTACT.ID'),
                            field: 'id',
                            visible: false,
                            dynamic: false
                        },
                        {
                            name: $translate.instant('LABEL.COST_CENTER'),
                            field:'costCenter',
                            visible: false
                        },
                        {
                            name: $translate.instant('CONTACT.FIRST_NAME'),
                            field:'_embedded.contact.firstName',
                            visible: false
                        },
                        {
                            name: $translate.instant('CONTACT.LAST_NAME'),
                            field:'_embedded.contact.lastName',
                            visible: false
                        },
                        {
                            name: $translate.instant('ADDRESS.ADDRESS'),
                            field:'_embedded.contact.address.addressLine1',
                            visible: false
                        }
                    ]
                },
                route: '/service_requests/contacts',
                alertState: 'initial',
                goToUpdate: function(contact) {
                    if (contact) {
                        this.setItem(contact);
                    }

                    window.scrollTo(0,0);

                    $location.path(this.route + '/' + this.item.id + '/update');
                },
                goToList: function() {
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
                        ServiceRequest.reset();
                        if (contact) {
                            this.setItem(contact);
                        }
                        $location.path(this.route + '/delete/' + this.item.id + '/review');
                    },
                verifyAddress: function(addressObj, fn) {
                    this.get({
                        method: 'post',
                        url: serviceUrl + 'address-validation',
                        data: addressObj,
                        preventDefaultParams: true,
                        noUpdate: true
                    }).then(function(bodsRes) {
                        return fn(bodsRes.status, bodsRes.data);
                    });
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
