define(['angular', 'contact'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestContacts')
    .factory('ContactService', ['serviceUrl', '$translate', 'SpringDataRestAdapter',
        function(serviceUrl, $translate, $http, halAdapter) {
            var Contacts = function() {
                this.url = serviceUrl + '/accounts/' + accountId + '/contacts';
                this.columns = {
                    defaultSet: []
                };
            };

            Contacts.prototype.getColumnDefinition = function(type) {
                this.columns = {
                    'defaultSet':[
                        {'name': $translate.instant('CONTACT.FIRST_NAME'), 'field': 'firstName'},
                        {'name': $translate.instant('CONTACT.LAST_NAME'), 'field':'lastName'}
                    ],
                    bookmarkColumn: 'getBookMark()'
                };

                return columns;
            };

            Contacts.prototype.addFunctions = function(data) {
                var  i = 0,
                contact = this;

                var fullnameFormatter = function() {
                    return contact.contact.firstName +  ' ' + contact.contact.lastName;
                };

                for (i; i < data.length; i += 1) {
                    
                }

                return data;
            };

            Contacts.prototype.getList = function(){
                var contact = this;
                return contact.contacts;
            };

            Contacts.prototype.getPage = function(page){
                alert('Page is: ' + page);
            };

            Contacts.prototype.get = function(params){
                var contact  = this;
                
                if (params.id !== 'new'){

                }

               return contact.contact;
            };

            Contacts.prototype.save = function(params, saveObject, fn){
                var contact = this;

                if (params.id === 'new') {
                    contact.contact = saveObject;
                } else {

                }

                return fn();
            };

            Contacts.prototype.resource = function(accountId, page){
                var contact  = this,
                url = contact.url + '?page=' + page,
                httpPromise = $http.get(url).success(function (response) {
                    contact.response = angular.toJson(response, true);
                });

                return halAdapter.process(httpPromise).then(function (processedResponse) {
                    contact.contacts = processedResponse._embeddedItems;
                    contact.page = processedResponse.page;
                    contact.processedResponse = angular.toJson(processedResponse, true);
                });
            };

            return new Contacts();
        }
    ]);
});
