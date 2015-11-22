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
                    console.log('old hateoas for: ' + serviceDefinition.serviceName);

                self.columns = null;
                self.columnDefs = null;

                self.url = '';
                // self.params  = {page: 0, size: 20, sort: ''}, defined by hateaosconfig
                self.params = {};
                self.route = '';

                if (serviceDefinition.columns instanceof Array) {
                    if (!serviceDefinition.columnDefs) {
                       serviceDefinition.columnDefs = {};
                    }

                    serviceDefinition.columnDefs.defaultSet = serviceDefinition.columns;
                    serviceDefinition.columns = 'defaultSet';
                }

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
                console.log('halObj',halObj);
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

             HATEAOSFactory.prototype.getAdditional = function(halObj, newService, name) {
                var self  = this,
                deferred = $q.defer(),
                url = '';
                newService.resetServiceMap();
                if(halObj.item && halObj.item._links[newService.serviceName]){
                    url = halObj.item._links[newService.serviceName].href;
                }
                else if(halObj.item && halObj.item._links[newService.serviceNameUnplurize()]){
                    url = halObj.item._links[newService.serviceNameUnplurize()].href;
                }else if(name){
                    url = halObj._links[name].href;
                }
                else{
                    url = halObj._links[newService.serviceName].href;
                }

                halAdapter.process($http.get(url)).then(function(processedResponse) {
                    if(processedResponse._embeddedItems && processedResponse._embeddedItems[newService.embeddedName].constructor === Array){
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

            HATEAOSFactory.prototype.serviceNameUnplurize = function(){
                return this.singular !== undefined ? this.singular : '';
            };

            HATEAOSFactory.prototype.save = function(halObj) {
                var self  = this,
                deferred = $q.defer();

                self.checkForEvent(halObj, 'beforeSave').then(function(canContinue, newObj) {
                    if (canContinue === true) {
                        if (newObj) {
                            halObj = newObj;
                        }

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
                    } else {
                        deferred.resolve(false);
                    }
                });

                return deferred.promise;
            };

           /* HATEAOSFactory.prototype.saveMADC = function(halObj) {
                var self  = this,
                deferred = $q.defer();

                self.checkForEvent(halObj, 'beforeSave').then(function(canContinue, newObj) {
                    if (canContinue === true) {
                        if (newObj) {
                            halObj = newObj;
                        }
                        $rootScope.currentUser.deferred.promise.then(function(){
                            self.params.accountId = $rootScope.currentUser.item.data.accounts[0].accountId; //get 0 index until account switching and preferences are 100% implemented
                            self.params.accountLevel = $rootScope.currentUser.item.data.accounts[0].level;  //get 0 index until account switching and preferences are 100% implemented
                            halObj._links = {
                                account: {
                                    href: 'https://api.venus-dev.lexmark.com/mps/accounts/' + self.params.accountId
                                }
                            };
                            if (halObj.primaryContact) {
                                halObj._links.primaryContact = {
                                    href: 'https://api.venus-dev.lexmark.com/mps/contacts/' + halObj.primaryContact.id
                                }
                            }
                            if (halObj.requestedByContact) {
                                halObj._links.requester = {
                                    href: 'https://api.venus-dev.lexmark.com/mps/contacts/' + halObj.requestedByContact.id
                                }
                            }
                            if (halObj.installAddress) {
                                halObj._links.sourceAddress = {
                                    href: 'https://api.venus-dev.lexmark.com/mps/accounts/' + self.params.accountId+ '/addresses/' + halObj.requestedByContact.id
                                }
                            }
                            if (halObj.id) {
                                halObj._links.asset = {
                                    href: 'https://api.venus-dev.lexmark.com/mps/assets/' + halObj.id
                                }
                            }
                            var url = self.buildUrl('https://api.venus-dev.lexmark.com/mps/'+self.serviceName, self.params, []);

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
            }; */

            HATEAOSFactory.prototype.update = function(halObj) {
                var self  = this,
                deferred = $q.defer();

                self.checkForEvent(halObj, 'beforeUpdate').then(function(canContinue, newObj) {
                    if (canContinue) {
                        if (newObj) {
                            halObj = newObj;
                        }
                        $rootScope.currentUser.deferred.promise.then(function(){
                            self.params.accountId = $rootScope.currentUser.item.data.accounts[0].accountId; //get 0 index until account switching and preferences are 100% implemented
                            self.params.accountLevel = $rootScope.currentUser.item.data.accounts[0].level;  //get 0 index until account switching and preferences are 100% implemented
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
                            self.params.accountId = $rootScope.currentUser.item.data.accounts[0].accountId;
                        }

                        if (!self.params.accountLevel) {
                            //get 0 index until account switching and preferences are 100% implemented
                            self.params.accountLevel = $rootScope.currentUser.item.data.accounts[0].level;
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
