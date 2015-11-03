define(['angular', 'contact', 'hateoasFactory', 'utility.formatters'], function(angular, contact) {
    'use strict';
    angular.module('mps.serviceRequestContacts')
    .factory('Contacts', ['$translate', 'HATEOASFactory', 'FormatterService',
        function($translate, HATEOASFactory, formatter) {
            var Contacts = {
                serviceName: 'contacts',
                singular: 'contact',
                // default, defaultSet, false attach the defaultSet columnDef
                columns: 'default',
                columnDefs: {
                    // default is a reserved keyword so we use defaultSet
                    // can be a function
                    // if this is not defined or null full property set returns per ui.grid
                    defaultSet: [
                        {name: $translate.instant('CONTACT.FULLNAME'), field: 'getFullname()'},
                        {name: $translate.instant('CONTACT.ADDRESS'), field: 'getAddress()'}
                    ],
                    // Addtional sets can be defined
                    testSet: [
                        {name: $translate.instant('CONTACT.WORK_PHONE'), field: 'getWorkPhone()'},
                        {name: $translate.instant('CONTACT.ALT_PHONE'), field: 'getAltPhone()'}
                    ],
                    // using a function to return a column set
                    fullSet: function() {
                        var arr = [];

                        arr = arr.concat(this.defaultSet).concat(this.testSet);

                        arr.push({
                            name: $translate.instant('CONTACT.EMAIL'),
                            field: 'email'
                        });

                        return arr;
                    }
                },
                route: '/service_requests/contacts',
                // Must return resolve(true, halObj) for item to be saved
                beforePost: function(halObj, deferred) {
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
