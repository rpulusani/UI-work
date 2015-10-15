define(['angular', 'utility'], function(angular) {
    'use strict';
    angular.module('mps.utility')
    .factory('HATEAOSFactory', ['serviceUrl', '$http', '$q', 'HATEAOSConfig', 'SpringDataRestAdapter',
        function(serviceUrl, $http, $q, HATEAOSConfig, halAdapter) {
            var user = { // mock
                accountId: '1-21AYVOT'
            }

            var HATEAOSFactory = function(serviceDefinition) {
                var self = this;
                self.serviceName = '';
                self.item = null;
                self.data = [];
                self.page = {
                    size : 0,
                    totalElements: 0,
                    totalPages: 0,
                    number: 0
                };
                self.columns = {};
                self.resetServiceMap = false;
                self.url = '';
                // self.params  = {page: 0, size: 20, sort: ''}, defined by hateaosconfig
                self.params = {}; 
                self.route = '';

                return angular.extend(self, serviceDefinition);
            };

            // Obtaining single item
            HATEAOSFactory.prototype.get = function(halObj) {
                var self  = this,
                deferred = $q.defer();
               
                halAdapter.process($http.get(halObj._links.self.href + '?accountId=' + user.accountId)).then(function(processedResponse) {
                    self.item = processedResponse;
                    self.processedResponse = processedResponse;

                    deferred.resolve();
                });

                return deferred.promise;
            };

            HATEAOSFactory.prototype.save = function(halObj) {
                var self  = this,
                deferred = $q.defer();

                halObj.firstName = 'Rocky';
                halObj.lastName = 'Bevins';
                halObj.email = 'rbevins@lexmark.com';
                halObj._links = {account: {href:'https://api.venus-dev.lexmark.com/mps/accounts/1-21AYVOT'}};

                halAdapter.process($http({
                    method: 'post',
                    url: self.url + '?accountId=' + user.accountId,
                    data: halObj
                })).then(function(processedResponse) {
                    self.item = processedResponse;
                    self.processedResponse = processedResponse;

                    deferred.resolve();
                });

                return deferred.promise;
            };

            HATEAOSFactory.prototype.update = function(halObj) {
                var self  = this,
                deferred = $q.defer();

                halObj._links.account = 'https://api.venus-dev.lexmark.com/mps/accounts/1-21AYVOT';

                halAdapter.process($http({
                    method: 'put',
                    url: halObj._links.self.href + '?accountId=' + user.accountId,
                    data: halObj
                })).then(function(processedResponse) {
                    self.item = processedResponse;
                    self.processedResponse = processedResponse;

                    deferred.resolve();
                });

                return deferred.promise;
            };

            HATEAOSFactory.prototype.getList = function(page, size) {
                var self  = this,
                deferred = $q.defer();

                HATEAOSConfig.getApi(self.serviceName).then(function(api) {
                    var url = '';

                    self.url = api.url;
                    self.params = api.params;

                    if (page || page === 0) {
                        self.params.page = page;
                    }

                    if (size) {
                        self.params.size = size;
                    }
                    
                    url = self.url + '?accountId=' + user.accountId +
                        '&page=0' +
                        '&size=20';

                    halAdapter.process($http.get(url)).then(function(processedResponse) {
                        self.data = processedResponse._embeddedItems;
                        self.page = processedResponse.page;
                        self.params.page = self.page.number;
                        self.params.size = self.page.size;
                        self.processedResponse = angular.toJson(processedResponse, true);

                        deferred.resolve();
                    });
                });

                return deferred.promise;
            };

            return HATEAOSFactory;
    }]);
});
