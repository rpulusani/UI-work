define(['angular', 'contact', 'utility.formatters'], function(angular, contact) {
    'use strict';
    angular.module('mps.serviceRequestContacts')
    .factory('Contacts', ['serviceUrl', '$translate', 'HATEAOSFactory',
       'FormatterService',
        function(serviceUrl, $translate, HATEAOSFactory, formatter) {
            var Contacts = {
                serviceName: 'contacts',
                // default, defaultSet, false attach the defaultSet columnDef 
                columns: 'default', 
                columnDefs: {
                    // default is a reserved keyword so we use defaultSet
                    // can be a function
                    // if this is not defined or null full property set returns per ui.grid
                    defaultSet: [
                        {name: $translate.instant('CONTACT.FULLNAME'), field: 'getFullname()'},
                        {name: $translate.instant('CONTACT.ADDRESS'), field: 'getAddress()'},
                        {name: $translate.instant('CONTACT.WORK_PHONE'), field: 'getWorkPhone()'},
                        {name: $translate.instant('CONTACT.ALT_PHONE'), field: 'getAltPhone()'}
                    ],
                    // Addtional sets can be defined
                    testSet: [
                        {name: $translate.instant('CONTACT.WORK_PHONE'), field: 'getWorkPhone()'},
                        {name: $translate.instant('CONTACT.ALT_PHONE'), field: 'getAltPhone()'}
                    ],
                    // using a function to return a column set
                    fullSet: function() {
                        this.defaultSet.push({
                            name: $translate.instant('CONTACT.EMAIL'),
                            field: 'email'
                        });

                        return this.defaultSet;
                    }
                },
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
                ]
             };

            return new HATEAOSFactory(Contacts);
        }
    ]);
});
