define(['angular', 'utility'], function(angular) {
    'use strict';
    angular.module('mps.utility')
    .factory('HATEAOSFactory', ['serviceUrl', '$http', '$q', 'HATEAOSConfig', 'SpringDataRestAdapter',
        function(serviceUrl, $http, $q, HATEAOSConfig, halAdapter) {
            var user = { // mock
                accountId: '1-21AYVOT'
            };

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

            HATEAOSFactory.prototype.checkForEvent = function(halObj, fnName) {
                var self = this,
                deferred = $q.defer();

                if (fnName && typeof self[fnName] === 'function') {
                    self[fnName](halObj, deferred);
                } else {
                    deferred.resolve(true);
                }

                return deferred.promise;
            };

            // Obtaining single item
            HATEAOSFactory.prototype.get = function(halObj) {
                var self  = this,
                deferred = $q.defer(),
                url = halObj._links.self.href + '?accountId=' + user.accountId;

                halAdapter.process($http.get(url)).then(function(processedResponse) {
                    self.item = processedResponse;
                    self.processedResponse = processedResponse;

                    deferred.resolve();
                });

                return deferred.promise;
            };

            HATEAOSFactory.prototype.save = function(halObj) {
                var self  = this,
                deferred = $q.defer();

                self.checkForEvent(halObj, 'beforeSave').then(function(canContinue, newObj) {
                    if (canContinue === true) {
                        if (newObj) {
                            halObj = newObj;
                        }

                        halObj._links = { 
                            account: {
                                href: 'http://localhost:8080/mps/accounts/' + user.accountId
                            }
                        }

                        halAdapter.process($http({
                            method: 'post',
                            url: self.url + '?accountId=' + user.accountId,
                            data: halObj
                        })).then(function(processedResponse) {
                            self.item = processedResponse;
                            self.processedResponse = processedResponse;

                            self.checkForEvent(self.item, 'afterSave').then(function() {
                                deferred.resolve();
                            });
                        });
                    } else {
                        deferred.resolve(false);
                    }
                });

                return deferred.promise;
            };

            HATEAOSFactory.prototype.update = function(halObj) {
                var self  = this,
                deferred = $q.defer();
                
                self.checkForEvent(halObj, 'beforeUpdate').then(function(canContinue, newObj) {
                    if (canContinue) {
                        if (newObj) {
                            halObj = newObj;
                        }

                        halObj._links = { 
                            account: {
                                href: 'http://localhost:8080/mps/accounts/' + user.accountId
                            }
                        }

                        halAdapter.process($http({
                            method: 'put',
                            url: self.url + '/' + halObj.id + '?accountId=' + user.accountId,
                            data: halObj
                        })).then(function(processedResponse) {
                            self.item = processedResponse;
                            self.processedResponse = processedResponse;

                            self.checkForEvent(self.item, 'afterUpdate').then(function() {
                                deferred.resolve();
                            });
                        });
                    } else {
                        deferred.resolve(false);
                    }
               });

               return deferred.promise;
            };

            HATEAOSFactory.prototype.getPage = function(page, size) {
                var self  = this,
                deferred = $q.defer();

                HATEAOSConfig.getApi(self.serviceName).then(function(api) {
                    var url;

                    self.url = api.url;
                    self.params = api.params;

                    if (page || page === 0) {
                        self.params.page = page;
                    }

                    if (size) {
                        self.params.size = size;
                    }

                    url = self.url + '?accountId=' + user.accountId +
                        '&page=' + self.params.page +
                        '&size=' + self.params.size;

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
