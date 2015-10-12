define(['angular', 'contact', 'utility.gridCustomizationService', 'utility.formatters'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestContacts')
    .factory('Contacts', ['serviceUrl', '$translate', '$http', '$rootScope', 'SpringDataRestAdapter',
        'gridCustomizationService', 'FormatterService',
        function(serviceUrl, $translate, $http, $rootScope, halAdapter, gridCustomizationService, formatter) {
            var Contacts = function() {
                this.bindingServiceName =  'contacts';
                this.templatedUrl = serviceUrl + '/accounts/' + '1-3F2FR9' + '/contacts';
                this.columns = {
                    'defaultSet':[
                        {'name': $translate.instant('CONTACT.FULLNAME'), 'field': 'getFullname()'},
                        {'name': $translate.instant('CONTACT.ADDRESS'), 'field':'getAddress()'},
                        {'name': $translate.instant('CONTACT.WORK_PHONE'), 'field':'getWorkPhone()'},
                        {'name': $translate.instant('CONTACT.ALT_PHONE'), 'field':'getAltPhone()'},
                        {'name': $translate.instant('CONTACT.EMAIL'), 'field':'email'}
                    ],
                    bookmarkColumn: 'getBookMark()'
                };
                this.paramNames = ['page', 'sort', 'size'];
                this.functionArray  = [
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

                ];
            };

            Contacts.prototype = gridCustomizationService;

            Contacts.prototype.addFunctions = function(data) {
                var i = 0,
                fullnameFormatter = function() {
                    var fullname = this.lastName + ', ' +  this.firstName;

                    if (this.middleName) {
                        fullname += ' ' + this.middleName;
                        return fullname;
                    } else {
                        return fullname;
                    }
                },
                addressFormatter = function() {
                     return this.address.addressList1 + ' ' +
                        this.address.city + ' ' +
                        this.address.stateCode + ' ' +
                        this.address.country;
                };

                for (i; i < data.length; i += 1) {
                    // TODO: consider moving formattter calls to delegate rather than attach per item
                    data[i].getFullname = fullnameFormatter;
                }

                return data;
            };

            Contacts.prototype.get = function(params) {
                var contact  = this;

                if (params.id !== 'new') {

                }

               return contact.contact;
            };

            Contacts.prototype.save = function(params, saveObject, fn) {
                var contact = this;

                if (params.id === 'new') {
                    contact.contact = saveObject;
                } else {

                }

                return fn();
            };
            return new Contacts();
        }
    ]);
});
