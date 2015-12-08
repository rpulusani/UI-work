define(['angular', 'contact', 'utility.formatters','hateoasFactory.serviceFactory'], function(angular, contact) {
    'use strict';
    angular.module('mps.serviceRequestContacts')
    .factory('Contacts', ['$translate', 'HATEOASFactory', 'FormatterService',
        function($translate, HATEOASFactory, formatter) {
            var Contacts = {
                serviceName: 'contacts',
                embeddedName: 'contacts',
                columns: 'defaultSet',
                columnDefs: {
                    defaultSet: [
                        {name: $translate.instant('CONTACT.FULLNAME'), field: 'getFullname()'},
                        {name: $translate.instant('CONTACT.ADDRESS'), field: 'getAddress()'},
                        {name: $translate.instant('CONTACT.WORK_PHONE'), field: 'getWorkPhone()'},
                        {name: $translate.instant('CONTACT.ALT_PHONE'), field: 'getAltPhone()'},
                        {name: $translate.instant('CONTACT.EMAIL'), field: 'email'}
                    ]
                },
                route: '/service_requests/contacts',
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
                ]
             };

            return new HATEOASFactory(Contacts);
        }
    ]);
});
