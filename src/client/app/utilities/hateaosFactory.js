define(['angular', 'utility'], function(angular) {
    'use strict';
    angular.module('mps.utility')
    .factory('HATEAOSFactory', ['serviceUrl', '$http', '$q', 'HATEAOSConfig', 'SpringDataRestAdapter', '$rootScope',
        function(serviceUrl, $http, $q, HATEAOSConfig, halAdapter, $rootScope) {
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

            HATEAOSFactory.prototype.getLoggedInUserInfo = function(loginId){
                var self  = this,
                deferred = $q.defer(),
                url = '';
                HATEAOSConfig.getApi(self.serviceName).then(function(api) {
                    self.url = api.url;
                    url = self.url + '/' + loginId;
                    halAdapter.process($http.get(url)).then(function(processedResponse) {
                        self.item = processedResponse;
                        self.processedResponse = processedResponse;

                        deferred.resolve(self);
                    });
                });

                return deferred.promise;
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
                url = halObj._links.self.href;

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
                        };

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
                        };

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
            HATEAOSFactory.prototype.buildUrl = function(url, requiredParams, additonalparams){
                var paramsUrl = '';
                function addParamSyntax(paramsUrl){
                    if(paramsUrl === ''){
                            return '?';
                    }else{
                        return '&';
                    }
                }
                if(requiredParams){
                    angular.forEach(requiredParams, function(value, key) {
                        if(value !== '' && value !== undefined & value !== null){
                            paramsUrl += addParamSyntax(paramsUrl);
                            paramsUrl += key + '=' + value;
                        }
                    });
                }

                if(additonalparams){
                    for(var i = 0; i < additonalparams.length; ++i){
                        if(additonalparams[i].name !== undefined && additonalparams[i].value !== undefined){
                            paramsUrl += addParamSyntax(paramsUrl);
                            paramsUrl += additonalparams[i].name + '=' + additonalparams[i].value;
                        }
                    }
                }

                return url += paramsUrl;
            };

            HATEAOSFactory.prototype.getPage = function(page, size, params) {
                var self  = this,
                deferred = $q.defer(),
                additonalParams;


                $rootScope.currentUser.deferred.promise.then(function(user){
                    HATEAOSConfig.getApi(self.serviceName).then(function(api) {
                        var url;

                        self.url = api.url;
                        self.params = api.params;
                        self.params.accountId = $rootScope.currentUser.item.accounts[0].accountId;
                        self.params.accountLevel = $rootScope.currentUser.item.accounts[0].level;
                        //setup required
                        if (page || page === 0) {
                            self.params.page = page;
                        }

                        if (size) {
                            self.params.size = size;
                        }

                        url = self.buildUrl(self.url, self.params, params);

                        halAdapter.process($http.get(url)).then(function(processedResponse) {
                            self.data = processedResponse._embeddedItems;
                            self.page = processedResponse.page;
                            self.params.page = self.page.number;
                            self.params.size = self.page.size;
                            self.processedResponse = angular.toJson(processedResponse, true);

                            deferred.resolve();
                        });
                    });
                },function(reason){
                    deferred.reject(reason);
                });

                return deferred.promise;
            };

            return HATEAOSFactory;
    }]);
});
