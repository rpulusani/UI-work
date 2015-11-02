define(['angular', 'utility'], function(angular) {
    'use strict';
    angular.module('mps.utility')
    .factory('HATEOASFactory', ['$http', '$q', 'HATEAOSConfig', '$rootScope',
        function($http, $q, HATEAOSConfig, $rootScope) {
            var HATEOASFactory = function(serviceDefinition) {
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
                self.url = '';
                // self.params  = {page: 0, size: 20, sort: ''}, defined by hateaosconfig
                self.params = {};
                self.route = '';

                return angular.extend(self, serviceDefinition);
            };

            HATEOASFactory.prototype.checkForEvent = function(halObj, fnName) {
                var self = this,
                deferred = $q.defer();

                if (fnName && typeof self[fnName] === 'function') {
                    self[fnName](halObj, deferred);
                } else {
                    deferred.resolve(true);
                }

                return deferred.promise;
            };

            // Obtaining items root endpoint, pass in an string to append to url
            HATEOASFactory.prototype.get = function(itemId) {
                var self  = this,
                deferred = $q.defer(),
                url = self.buildUrl(halObj._links.self.href, undefined, params);

                $http.get(url).then(function(processedResponse) {
                    self.item = processedResponse.data;
                    self.processedResponse = processedResponse;

                    deferred.resolve();
                });

                return deferred.promise;
            };

            // core logic for put/post
            HATEOASFactory.prototype.send = function(method, verbName) {
                var self  = this,
                deferred = $q.defer();

                self.checkForEvent(halObj, 'before' + verbName).then(function(canContinue, newObj) {
                    if (canContinue === true) {
                        if (newObj) {
                            halObj = newObj;
                        }

                        $rootScope.currentUser.deferred.promise.then(function() {
                            var url;

                            self.params.accountId = $rootScope.currentUser.item.accounts[0].accountId; //get 0 index until account switching and preferences are 100% implemented
                            self.params.accountLevel = $rootScope.currentUser.item.accounts[0].level;  //get 0 index until account switching and preferences are 100% implemented
                            
                            halObj._links = {
                                account: {
                                    href: 'http://localhost:8080/mps/accounts/' + self.params.accountId
                                }
                            };
                            
                            url = self.buildUrl(self.url, self.params, []);

                            self.checkForEvent(self.item, 'on' + verbName).then(function() {
                                deferred.resolve();
                            });

                            $http({
                                method: method,
                                url: url,
                                data: halObj
                            }).then(function(processedResponse) {
                                self.item = processedResponse;
                                self.processedResponse = processedResponse;

                                self.checkForEvent(self.item, 'after' + verbName).then(function() {
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

            HATEOASFactory.prototype.follow = function(newService, embeds){
                var self  = this,
                    deferred = $q.defer(),
                    params = [{
                        name: 'embed',
                        value: embeds
                    }],
                    url = self.buildUrl(self.item._links[newService.serviceName].href, newService.params, params);

                $http.get(url).then(function(processedResponse) {
                    newService.item = processedResponse.data;
                    newService.processedResponse = processedResponse;

                    deferred.resolve();
                });

                return deferred.promise;
            };

             HATEOASFactory.prototype.getAdditional = function(halObj, newService) {
                var self  = this,
                deferred = $q.defer(),
                url = '';

                newService.resetServiceMap();

                if (halObj.item) {
                    url = halObj.item._links[newService.serviceName].href;

                } else {
                    url = halObj._links[newService.serviceName].href;
                }

                $http.get(url).then(function(processedResponse) {
                    if (processedResponse._embeddedItems[newService.embeddedName].constructor === Array) {
                        newService.data = processedResponse.data._embedded[newService.embeddedName];
                        newService.page = processedResponse.data.page;
                        newService.params.page = self.page.number;
                        newService.params.size = self.page.size;
                    } else {
                        newService.item = processedResponse.data;
                    }

                    newService.processedResponse = processedResponse;
                    deferred.resolve();
                });

                return deferred.promise;
            };

            HATEOASFactory.prototype.save = function(halObj) {
                var self  = this,
                deferred = $q.defer();

                self.checkForEvent(halObj, 'beforeSave').then(function(canContinue, newObj) {
                    if (canContinue === true) {
                        if (newObj) {
                            halObj = newObj;
                        }

                        $rootScope.currentUser.deferred.promise.then(function() {
                            var url;

                            self.params.accountId = $rootScope.currentUser.item.accounts[0].accountId; //get 0 index until account switching and preferences are 100% implemented
                            self.params.accountLevel = $rootScope.currentUser.item.accounts[0].level;  //get 0 index until account switching and preferences are 100% implemented
                            
                            halObj._links = {
                                account: {
                                    href: 'http://localhost:8080/mps/accounts/' + self.params.accountId
                                }
                            };
                            
                            url = self.buildUrl(self.url, self.params, []);

                            $http({
                                method: 'post',
                                url: url,
                                data: halObj
                            }).then(function(processedResponse) {
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

            HATEOASFactory.prototype.update = function(halObj) {
                var self  = this,
                deferred = $q.defer();

                self.checkForEvent(halObj, 'beforeUpdate').then(function(canContinue, newObj) {
                    if (canContinue) {
                        if (newObj) {
                            halObj = newObj;
                        }

                        $rootScope.currentUser.deferred.promise.then(function() {
                            var url;

                            self.params.accountId = $rootScope.currentUser.item.accounts[0].accountId; //get 0 index until account switching and preferences are 100% implemented
                            self.params.accountLevel = $rootScope.currentUser.item.accounts[0].level;  //get 0 index until account switching and preferences are 100% implemented
                          
                            halObj._links = {
                                account: {
                                    href: 'http://localhost:8080/mps/accounts/' + self.params.accountId
                                }
                            };

                            url = self.buildUrl(self.url + '/' + halObj.id, self.params, []);
                            
                            $http({
                                method: 'put',
                                url:  url,
                                data: halObj
                            }).then(function(processedResponse) {
                                self.item = processedResponse.data;
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
            
            HATEOASFactory.prototype.buildUrl = function(url, requiredParams, additonalparams){
                var paramsUrl = '',
                addParamSyntax = function(paramsUrl){
                    if (paramsUrl === '') {
                        return '?';
                    } else {
                        return '&';
                    }
                };

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

            HATEOASFactory.prototype.getPage = function(page, size, params) {
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
                    
                        $http.get(url).then(function(processedResponse) {
                            //get away from embedded name and move to a function to convert url name to javascript name
                            if (!self.embeddedName) {
                                self.data = processedResponse.data._embedded[self.serviceName];
                            } else {
                                self.data = processedResponse.data._embedded[self.embeddedName];
                            }

                            self.page = processedResponse.data.page;
                            self.params.page = self.page.number;
                            self.params.size = self.page.size;

                            self.processedResponse = processedResponse;

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

            return HATEOASFactory;
    }]);
});
