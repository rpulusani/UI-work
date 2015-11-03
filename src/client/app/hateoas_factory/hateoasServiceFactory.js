define(['angular', 'hateoasFactory'], function(angular) {
    'use strict';
    angular.module('mps.hateoasFactory')
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
                self.columns = null;
                self.columnDefs = null;
                self.url = '';
                // self.params  = {page: 0, size: 20, sort: ''}, defined by hateaosconfig
                self.params = {};
                // Placeholder for the original params given to us from server
                self.defaultParams = {};
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

            HATEOASFactory.prototype.setupItem = function(item) {
                var self = this,
                link, // prop in _links 
                links,
                propName,
                parsePropertyName = function(prop) {
                    // meter-reads -> meterReads
                    // HelloWorld -> helloWorld
                    var  i = 0,
                    name = prop
                    .replace('-', ' ')
                    .replace('_', ' ')
                    .toLowerCase();

                    if (name.indexOf(' ') !== -1) {
                        name = name.split(' ');

                        for (i; i < name.length; i += 1) {
                            if (i > 0) {
                                name[i][0].toUpperCase();
                            }
                        }

                        name = name.join('');
                    }

                    return name;
                };

                if (item) {
                    self.item = item;
                    links = self.item._links;
                } else {
                    links = self.item._links;
                }

                self.checkForEvent(self.item, 'onItemSetup');

                for (link in links) {
                    if (link.href) {
                        propName = parsePropertyName(link);

                        self.item[propName] = function(params, options) {
                            var deferred = $q.defer();

                            $http(link.href).then(function(response) {
                                self.processedResponse = response;

                                deferred.resolve(response);
                            });

                            return deferred.promise;
                        };
                    }
                }
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

            // core logic for put/post
            HATEOASFactory.prototype.send = function(halObj, method, verbName) {
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
                                    href: HATEAOSConfig.serviceMap['accounts'].url + self.params.accountId
                                }
                            };
                            
                            url = self.buildUrl(self.url, self.params, []);

                            self.checkForEvent(self.item, 'on' + verbName);

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

            HATEOASFactory.prototype.post = function(halObj) {
                this.send(halObj, 'post', 'post');
            };

            HATEOASFactory.prototype.put = function(halObj) {
                this.send(halObj, 'put', 'put');
            };

            // Provided for convenience
            HATEOASFactory.prototype.save = function(halObj) {
                this.send(halObj, 'post', 'post');
            };

            HATEOASFactory.prototype.update = function(halObj) {
                this.send(halObj, 'put', 'put');
            };

            HATEOASFactory.prototype.next = function() {
                var self = this;

                self.checkForEvent(halObj, 'onNext');

                return self.get({
                    page: self.params.page += 1,
                    size: self.params.size
                });
            };

            HATEOASFactory.prototype.prev = function() {
                var self = this;

                self.checkForEvent(self.item, 'onPrev');

                return self.get({
                    page: self.params.page -= 1,
                    size: self.params.size
                });
            };

            HATEOASFactory.prototype.getPage = function(page, size) {
                var self = this;

                if (page !== 0 && !page) {
                    page = self.params.page;
                }

                if (!size) {
                    size = self.params.size;
                }

                return this.get({
                    page: page,
                    size: size
                });
            };

            HATEOASFactory.prototype.get = function(optionsObj) {
                var self  = this,
                params,
                options = {},
                deferred = $q.defer(),
                additonalParams;

                if (optionsObj) {
                    if (!angular.isString(optionsObj)) {
                        options = optionsObj;
                    } else {
                        options = {
                            url: self.url + '/' + optionsObj,
                            preventParams: true
                        }
                    }
                }

                self.checkForEvent(self.item, 'beforeGet').then(function(canContinue, newObj) {
                    if (canContinue) {
                        if (newObj) {
                            self.item = newObj;
                        }

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

                                if (options.page || options.page === 0) {
                                    self.params.page = options.page;
                                }

                                if (options.size) {
                                    self.params.size = options.size;
                                }

                                if (!options.preventParams) {
                                    params = self.params;
                                } else {
                                    params = false;
                                }

                                if (!options.url) {
                                    url = self.buildUrl(self.url, params, options.params);
                                } else {
                                    url = self.buildUrl(options.url, params, options.params);
                                }

                                $http.get(url).then(function(processedResponse) {
                                    //get away from embedded name and move to a function to convert url name to javascript name
                                    if (!self.embeddedName) {
                                        self.data = processedResponse.data._embedded[self.serviceName];
                                    } else {
                                        self.data = processedResponse.data._embedded[self.embeddedName];
                                    }

                                    self.checkForEvent(self.item, 'onGet');

                                    self.page = processedResponse.data.page;
                                    self.params.page = self.page.number;
                                    self.params.size = self.page.size;

                                    self.processedResponse = processedResponse;

                                    self.checkForEvent(self.item, 'afterGet').then(function() {
                                        deferred.resolve();
                                    });

                                    deferred.resolve();
                                });
                            };

                            if (!self.url) {
                                HATEAOSConfig.getApi(self.serviceName).then(function(api) {
                                    var prop;

                                    self.url = api.url;

                                    for (prop in api.params) {
                                        if (!self.params[prop]) {
                                            self.params[prop] = api.params[prop];
                                            self.defaultParams[prop] = api.params[prop];
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
                    }
                });

                return deferred.promise;
            };

            HATEOASFactory.prototype.buildUrl = function(url, requiredParams, additonalParams) {
                var paramsUrl = '',
                addParamSyntax = function(paramsUrl){
                    if (paramsUrl === '') {
                        return '?';
                    } else {
                        return '&';
                    }
                };

                if (requiredParams) {
                    angular.forEach(requiredParams, function(value, key) {
                        if (value !== null) {
                            paramsUrl += addParamSyntax(paramsUrl);
                            paramsUrl += key + '=' + value;
                        }
                    });
                }

                if (additonalParams) {
                    angular.forEach(additonalParams, function(value, key) {
                        if (value !== null) {
                            paramsUrl += addParamSyntax(paramsUrl);
                            paramsUrl += key + '=' + value;
                        }
                    });
                }

                return url += paramsUrl;
            };

            return HATEOASFactory;
        }
    ]);
});
