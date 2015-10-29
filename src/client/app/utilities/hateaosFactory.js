define(['angular', 'utility'], function(angular) {
    'use strict';
    angular.module('mps.utility')
    .factory('HATEAOSFactory', ['$http', '$q', 'HATEAOSConfig', 'SpringDataRestAdapter', '$rootScope',
        function($http, $q, HATEAOSConfig, halAdapter, $rootScope) {
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
                self.columns = null;
                self.columnDefs = null;

                self.url = '';
                // self.params  = {page: 0, size: 20, sort: ''}, defined by hateaosconfig
                self.params = {};
                self.route = '';

                return angular.extend(self, serviceDefinition);
            };

            HATEAOSFactory.prototype.resetServiceMap = function(){
                var self = this;
                self.item = null;
                self.data = [];
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
            HATEAOSFactory.prototype.get = function(halObj, embeds) {
                var self  = this,
                deferred = $q.defer(),
                params = [{
                    name: 'embed',
                    value: embeds
                }],
                url = self.buildUrl(halObj._links.self.href, undefined, params);

                halAdapter.process($http.get(url)).then(function(processedResponse) {
                    self.item = processedResponse;
                    self.processedResponse = processedResponse;

                    deferred.resolve();
                });

                return deferred.promise;
            };

             HATEAOSFactory.prototype.getAdditional = function(halObj, newService) {
                var self  = this,
                deferred = $q.defer(),
                url = '';
                newService.resetServiceMap();
                if(halObj.item){
                    url = halObj.item._links[newService.serviceName].href;

                }else{
                    url = halObj._links[newService.serviceName].href;
                }

                halAdapter.process($http.get(url)).then(function(processedResponse) {
                    if(processedResponse._embeddedItems[newService.embeddedName].constructor === Array){
                        newService.data = processedResponse._embeddedItems[newService.embeddedName];
                        newService.page = processedResponse.page;
                        newService.params.page = self.page.number;
                        newService.params.size = self.page.size;
                    }else{
                        newService.item = processedResponse;
                    }
                    newService.processedResponse = angular.toJson(processedResponse, true);
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
                        $rootScope.currentUser.deferred.promise.then(function(){
                            self.params.accountId = $rootScope.currentUser.item.accounts[0].accountId; //get 0 index until account switching and preferences are 100% implemented
                            self.params.accountLevel = $rootScope.currentUser.item.accounts[0].level;  //get 0 index until account switching and preferences are 100% implemented
                            halObj._links = {
                                account: {
                                    href: 'http://localhost:8080/mps/accounts/' + self.params.accountId
                                }
                            };
                            var url = self.buildUrl(self.url, self.params, []);

                            halAdapter.process($http({
                                method: 'post',
                                url: url,
                                data: halObj
                            })).then(function(processedResponse) {
                                self.item = processedResponse;
                                self.processedResponse = processedResponse;

                                self.checkForEvent(self.item, 'afterSave').then(function() {
                                    deferred.resolve();
                                });
                            });
                        },function(reason){
                            deferred.reject(reason);
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
                        $rootScope.currentUser.deferred.promise.then(function(){
                            self.params.accountId = $rootScope.currentUser.item.accounts[0].accountId; //get 0 index until account switching and preferences are 100% implemented
                            self.params.accountLevel = $rootScope.currentUser.item.accounts[0].level;  //get 0 index until account switching and preferences are 100% implemented
                            halObj._links = {
                                account: {
                                    href: 'http://localhost:8080/mps/accounts/' + self.params.accountId
                                }
                            };

                            var url = self.buildUrl(self.url + '/' + halObj.id, self.params, []);
                            halAdapter.process($http({
                                method: 'put',
                                url:  url,
                                data: halObj
                            })).then(function(processedResponse) {
                                self.item = processedResponse;
                                self.processedResponse = processedResponse;

                                self.checkForEvent(self.item, 'afterUpdate').then(function() {
                                    deferred.resolve();
                                });
                            });
                        },function(reason){
                            deferred.reject(reason);
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

                $rootScope.currentUser.deferred.promise.then(function() {
                    var processPage = function() {
                        var url;

                        if (!self.params.accountId) {
                            //get 0 index until account switching and preferences are 100% implemented
                            self.params.accountId = $rootScope.currentUser.item.accounts[0].accountId;
                        }

                        if (!self.params.accountLevel) {
                            //get 0 index until account switching and preferences are 100% implemented
                            self.params.accountLevel = $rootScope.currentUser.item.accounts[0].level;
                        }

                        if (page || page === 0) {
                            self.params.page = page;
                        }

                        if (size) {
                            self.params.size = size;
                        }

                        url = self.buildUrl(self.url, self.params, params);
                    
                        halAdapter.process($http.get(url)).then(function(processedResponse) {
                            //get away from embedded name and move to a function to convert url name to javascript name
                            if (!self.embeddedName) {
                                self.data = processedResponse._embeddedItems[self.serviceName];
                            } else {
                                self.data = processedResponse._embeddedItems[self.embeddedName];
                            }

                            self.page = processedResponse.page;
                            self.params.page = self.page.number;
                            self.params.size = self.page.size;
                            self.processedResponse = angular.toJson(processedResponse, true);

                            deferred.resolve();
                        });
                    };

                    if (!self.url) {
                        HATEAOSConfig.getApi(self.serviceName).then(function(api) {
                            var prop;

                            self.url = api.url;

                            for (prop in api.params) {
                                if (self.params[prop]) {
                                    self.params[prop] = api.params[prop];
                                }
                            }

                            processPage();
                        });
                    } else {
                        processPage();
                    }
                }, function(reason) {
                    deferred.reject(reason);
                });

                return deferred.promise;
            };

            return HATEAOSFactory;
    }]);
});
