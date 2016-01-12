define(['angular', 'contact', 'utility.formatters','hateoasFactory.serviceFactory'], function(angular, contact) {
    'use strict';
    angular.module('mps.serviceRequestContacts')
    .factory('Contacts', ['$translate', 'HATEOASFactory', 'FormatterService', '$location',
        function($translate, HATEOASFactory, formatter, $location) {
            var contactItem = {
                id: 'PH-TTYS1',
                firstName: 'Test',
                lastName: 'Test',
                address: {
                    country: 'USA'
                },
                _links: {
                    self: {
                        href: "https://api.venus-dev.lexmark.com/mps/contacts/PH-TTYS1"
                    },
                    account: {
                        href: "https://api.venus-dev.lexmark.com/mps/accounts/1-1L9SRP?accountLevel=seibel"
                    }
                }
            };


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
                goToCreate: function() {
                    this.item = this.getModel();
                    this.updated = false;
                    this.saved = false;

                    $location.path(this.route + '/new');
                },
                goToUpdate: function(contact) {
                    console.log(contact);
                    this.setItem(contact);
                    
                    $location.path(this.route + '/' + this.item.id + '/update');
                },
                saveContact: function(contactForm) {
                    var Contacts = this,
                    contactItem;

                    if (Contacts.item && Contacts.item.id) {
                        Contacts.put(Contacts).then(function() {
                            Contacts.saved = false;

                            if (contacts.item._links) {
                                Contacts.updated = true; // flag to manage state
                                Contacts.goToUpdate(Contacts.item);
                            } else {
                                Contacts.goToList();
                            }
                        });
                    } else {
                        Contacts.post(Contacts).then(function(r) {
                            Contacts.saved = true;
                            Contacts.goToUpdate(contactItem);
                        });
                    }
                },
                goToList: function() {
                    $location.path(this.route + '/');
                },
                goToDelete: function(contact) {
                    if (!contact) {
                        contact = Contacts.item;
                    }

                    $location.path(this.route + '/' + contact.id + '/delete');
                },
                cancel: function() {
                    $location.path(this.route + '/');
                },
                getModel: function() {
                    return  {
                        firstName: '',
                        lastName: '',
                        address: {
                           country: ''
                        },
                        _links: {
                            account: ''
                        }
                    };
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
