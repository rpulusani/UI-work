define(['angular', 'contact', 'utility.formatters'], function(angular, contact) {
    'use strict';
    angular.module('mps.serviceRequestContacts')
    .factory('Contacts', ['$translate', 'HATEAOSFactory',
       'FormatterService',
        function($translate, HATEAOSFactory, formatter) {
            var Contacts = {
                serviceName: 'contacts',
                columns: [
                    {name: $translate.instant('CONTACT.FULLNAME'), field: 'getFullname()'},
                    {name: $translate.instant('CONTACT.ADDRESS'), field: 'getAddress()'},
                    {name: $translate.instant('CONTACT.WORK_PHONE'), field: 'getWorkPhone()'},
                    {name: $translate.instant('CONTACT.ALT_PHONE'), field: 'getAltPhone()'},
                    {name: $translate.instant('CONTACT.EMAIL'), field: 'email'}
                ],
                route: '/service_requests/contacts',
                // Must return resolve(true, halObj) for item to be saved
                beforeSave: function(halObj, deferred) {
                    halObj.physicalAddress = {
                        addressId: '1-2CPY6UA',
                        country: 'US'
                    };

                    deferred.resolve(true, halObj);
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
                    /*,
                    {
                        name: 'getAddress',
                        functionDef: function() {
                            return this.address.addressList1 + ' ' +
                                this.address.city + ' ' +
                                this.address.stateCode + ' ' +
                                this.address.country;
                        }
                    }*/
                ]
             };

            return new HATEAOSFactory(Contacts);
        }
    ]);
});
