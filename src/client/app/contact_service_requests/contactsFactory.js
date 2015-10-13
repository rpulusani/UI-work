define(['angular', 'contact', 'utility.formatters'], function(angular, contact) {
    'use strict';
    angular.module('mps.serviceRequestContacts')
    .factory('Contacts', ['serviceUrl', '$translate', 'HATEAOSFactory',
       'FormatterService',
        function(serviceUrl, $translate, HATEAOSFactory, formatter) {
            var Contacts = {
                serviceName: 'contacts',
                columns: [
                        {'name': $translate.instant('CONTACT.FULLNAME'), 'field': 'getFullname()'},
                        {'name': $translate.instant('CONTACT.ADDRESS'), 'field':'getAddress()'},
                        {'name': $translate.instant('CONTACT.WORK_PHONE'), 'field':'getWorkPhone()'},
                        {'name': $translate.instant('CONTACT.ALT_PHONE'), 'field':'getAltPhone()'},
                    {'name': $translate.instant('CONTACT.EMAIL'), 'field': 'email'}
                ],
                route: '/service_requests/contacts',
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
            Contacts.prototype = gridCustomizationService;

            return new HATEAOSFactory(Contacts);
        }
    ]);
});
