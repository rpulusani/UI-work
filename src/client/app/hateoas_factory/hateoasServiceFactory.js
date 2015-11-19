define(['angular', 'hateoasFactory'], function(angular) {
    'use strict';
    angular.module('mps.hateoasFactory')
    .factory('HATEOASFactory', ['$http', '$q', 'HATEAOSConfig', '$rootScope',
        function($http, $q, HATEAOSConfig, $rootScope) {
            var HATEOASFactory = function(serviceDefinition) {
                var self = this;

                self = self.setItemDefaults(self);
              
                self.defaultParams = {};
                self.route = '';

                if (serviceDefinition.columns instanceof Array) {
                    if (!serviceDefinition.columnDefs) {
                       serviceDefinition.columnDefs = {defaultSet: []};
                    }

                    serviceDefinition.columnDefs.defaultSet = serviceDefinition.columns;
                    serviceDefinition.columns = 'defaultSet';
                } else {
                    if (!serviceDefinition.columnDefs) {
                          serviceDefinition.columnDefs = {defaultSet: []};
                    }
                }

                return angular.extend(self, serviceDefinition);
            };

            HATEOASFactory.prototype.setItemDefaults = function(obj) {
                if (!obj) {
                    obj = {};
                }

                obj.item = null;
                obj.data = [];
                obj.page = {};

                obj.params = {};
                obj.page = {};

                obj.links = {};
                obj.url = '';
                obj._links = {};
                obj.linkNames = [];
                obj.columns = 'defaultSet';
                obj.columnDefs = {defaultSet: {}};
                obj.serviceName = '';
                obj.embeddedName = '';

                return obj;
            };

            // Update a secondary service with a matching link in a given envelope
            HATEOASFactory.prototype.getAdditional = function(halObj, newService) {
                var self = this,
                deferred = $q.defer(),
                url;

                newService.item = null;
                newService.data = [];

                if (!newService.url) {
                    newService.params = self.setupParams({
                        url: halObj._links[newService.serviceName].href
                    });
                    newService.url = self.setupUrl(halObj._links[newService.serviceName].href);
                }

                $rootScope.currentUser.deferred.promise.then(function() {
                    newService.params.accountId = $rootScope.currentUser.item.data.accounts[0].accountId;
                    newService.params.accountLevel = $rootScope.currentUser.item.data.accounts[0].level;

                    newService.get({
                        page: newService.params.page,
                        size: newService.params.size
                    }).then(function(processedResponse) {
                        deferred.resolve();
                    });
                });

                return deferred.promise;
            };


            HATEOASFactory.prototype.attachLinksAsFunctions = function(item, links, itemOptions) {
                var self = this,
                deferred = $q.defer(),
                link;

                for (link in links) {
                    if (links[link].href) {
                        (function(item, link) {
                            item[link] = self.setItemDefaults();
                            item[link].url = self.setupUrl(item._links[link].href);
                            item[link].params = self.setupParams({url: item._links[link].href});
                            
                            item.linkNames.push(link);

                            item.links[link] = function(options) {
                                var deferred = $q.defer();

                                if (!options) {
                                    options = {};
                                }

                                if (!options.method) {
                                    options.method = 'get';
                                }  

                                if (!options.url) {
                                    options.url = self.buildUrl(item[link].url, item[link].params);
                                } else {    
                                    options.url = self.buildUrl(options.url, item[link].params);
                                }

                                if (options.serviceName) {
                                    item[link].serviceName = options.serviceName;
                                }

                                if (options.embeddedName) {
                                    item[link].embeddedName = options.embeddedName;
                                }

                                if (options.columns) {
                                    item[link].columns = options.columns;
                                }

                                if (options.columnDefs) {
                                    item[link].columnDefs = options.columnDefs;
                                }

                                item[link].checkForEvent = self.checkForEvent;
                                item[link].setItem = self.setItem;
                                item[link].get = self.get;
                                item[link].getPage = self.getPage;
                                item[link].buildUrl = self.buildUrl;
                                item[link].setupUrl = self.setupUrl;
                                item[link].setupParams = self.setupParams;
                                item[link].send = self.send;
                                item[link].post = self.post;
                                item[link].put = self.put;

                                $http(options).then(function(response) {
                                    var embeddedProperty = null;

                                    self.processedResponse = response;

                                    if (options.embeddedName) {
                                        embeddedProperty = options.embeddedName;
                                    } else if (item[link].embeddedName && options.embeddedName !== null) {
                                        embeddedProperty = item[link].embeddedName;
                                    } else if (item[link].serviceName && options.embeddedName !== null) {
                                        embeddedProperty = item[link].serviceName
                                    }

                                    if (embeddedProperty && response.data._embedded) {
                                        item[link].data = response.data._embedded[embeddedProperty];
                                    } else {
                                        if (response.data._links) {
                                            item[link] = self.attachEmbeds(item, link, response);
                                        } else {
                                            item[link].data = response.data;
                                        }
                                    }

                                    if (response.data.page) {
                                        item[link].page = response.data.page;
                                    }

                                    if (item[link].data && item[link].data.status) {
                                        item[link].data = [];
                                    }

                                    if (response.data._links) {
                                        item[link]._links = response.data._links;
                                        item[link] = self.attachLinksAsFunctions(item[link], response.data._links, options);
                                    }

                                    deferred.resolve(item[link], response);
                                });

                                return deferred.promise;
                            };
                        }(item, link));
                    }
                }

                return item;
            }

            HATEOASFactory.prototype.attachEmbeds = function(item, link, response) {
                var prop;

                item[link].item = response.data;

                if (item[link].item._embedded) {
                    for (prop in item[link].item._embedded) {
                        if (item[link].item._embedded[prop] instanceof Array) {
                            item[prop].data = item[link].item._embedded[prop];
                        } else {
                            item[prop].item = item[link].item._embedded[prop];
                        }
                    }
                }

                return item;
            };
 
            HATEOASFactory.prototype.createItem = function(halObj, itemOptions) {
                if (!itemOptions) {
                    itemOptions = {}
                }

                itemOptions.newItem = true;

                return this.setItem(halObj, itemOptions);
            };

            HATEOASFactory.prototype.setItem = function(halObj, itemOptions) {
                var self = this,
                link, // prop in _links 
                item,
                propName;

                if (!itemOptions) {
                    itemOptions = {};
                }

                self.checkForEvent(self.item, 'onItemSetup');

                if (halObj) {
                    item = halObj;

                    item.linkNames = [];
                    item.links = {};
                    item.url = self.setupUrl(item._links.self.href);
                    item.params = self.setupParams({url: item._links.self.href});

                    item = self.attachLinksAsFunctions(item, item._links, itemOptions);
                    
                    item.all = function(options) {
                        var deferred = $q.defer(),
                        len = item.linkNames.length,
                        deferreds = [],
                        i = 0;

                        for (i; i < len; i += 1) {
                            deferreds.push( item.links[item.linkNames[i]]() );
                        }

                        return $q.all(deferreds);
                    };

                    if (itemOptions.newItem !== true) {
                        self.item = item;
                    } else {
                        return item;
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

            HATEOASFactory.prototype.buildUrl = function(url, params) {
                var paramsUrl = '',
                addParamSyntax = function(paramsUrl) {
                    if (paramsUrl === '') {
                        return '?';
                    } else {
                        return '&';
                    }
                };

                if (params) {
                    angular.forEach(params, function(value, key) {
                        if (value !== null) {
                            paramsUrl += addParamSyntax(paramsUrl);
                            paramsUrl += key + '=' + value;
                        }
                    });
                }

                return url += paramsUrl;
            };

            // given a _link address return its url and parameters {url: '', params: {}}
            HATEOASFactory.prototype.setupUrl = function(url) {
                return url.replace(/{.*}/,'').replace(/\?.*/,'');
            };

            // Get the default url and parameters and then merge with any given params
            HATEOASFactory.prototype.setupParams = function(options) {
                var self = this,
                paramArr = [],
                params = {},
                i = 0;
                
                if (options) {
                    if (options.url) {
                        if (options.url.indexOf('{') !== -1) {
                            paramArr = options.url.replace(/.*{[?]/,'').replace('}', '').split(',');
                        }

                        for (i; i < paramArr.length; i += 1) {
                            if (paramArr[i] === 'page') {
                                params[paramArr[i]] = 0;
                            } else if (paramArr[i] === 'size') {
                                params[paramArr[i]] = 20;
                            } else {
                                params[paramArr[i]] = null;
                            }
                        }
                    }

                    if (options.params) {                        
                        if (options.params instanceof Object) {
                            angular.extend(params, options.params);
                        } else if (options.params instanceof Array) {
                            angular.forEach(options.params, function(value, key) {
                                params[key] = value;
                            });
                        }
                    }
                }

                if (!params.accountId) {
                    params.accountId = self.params.accountId;
                    params.accountLevel = self.params.accountLevel; 
                }

                return params;
            }

            // core logic for put/post
            HATEOASFactory.prototype.send = function(halObj, method, verbName) {
                var self  = this,
                deferred = $q.defer();

                self.checkForEvent(halObj, 'before' + verbName).then(function(canContinue, newObj) {
                    var url;
                    if (canContinue === true) {
                        if (newObj) {
                            halObj = newObj;
                        }

                        url = self.buildUrl(self.url, self.params);

                        self.checkForEvent(self.item, 'on' + verbName);

                        $http({
                            method: method,
                            url: url,
                            data: halObj
                        }).then(function(processedResponse) {
                            self.item = processedResponse;
                            self.processedResponse = processedResponse;

                            self.checkForEvent(self.item, 'after' + verbName);

                            deferred.resolve();
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
                options = {},
                item,
                deferred = $q.defer();

                if (optionsObj) {
                    if (!angular.isString(optionsObj)) {
                        options = optionsObj;
                    } else {
                        options = {
                            url: self.url + optionsObj
                        }
                    }
                }

                if (!options.params) {
                    options.params = {};
                }

                if (!optionsObj.item) {
                    item = self.item;
                } else {
                    item = optionsObj.item;
                }

                if (options.page && options.page >= 0) {
                    self.params.page = options.page;
                }

                if (options.size) {
                    self.params.size = options.size;
                }

                self.checkForEvent(self.item, 'beforeGet').then(function(canContinue, newObj) {
                    if (canContinue) {
                        if (newObj) {
                            self.item = newObj;
                        }

                        $rootScope.currentUser.deferred.promise.then(function() {
                            var processPage = function() {
                                var url;

                                self.params = self.setupParams({
                                    url: self.url,
                                    params: self.params
                                });

                                if (!options.url) {
                                    self.url = self.setupUrl(self.url);
                                } else {
                                    self.url = self.setupUrl(options.url);
                                }

                                url = self.buildUrl(self.url, self.params);

                                $http.get(url).then(function(processedResponse) {
                                    if (processedResponse.data._embedded) {
                                        if (!self.embeddedName) {
                                            self.data = processedResponse.data._embedded[self.serviceName];
                                        } else {
                                            self.data = processedResponse.data._embedded[self.embeddedName];
                                        }
                                    } else {
                                        if (processedResponse.data._links) {
                                            console.log(self.item);

                                            self.item = processedResponse.data;

                                            console.log(self.item);
                                        } else {
                                            self.data = processedResponse.data;
                                        }
                                    }
                            
                                    self.checkForEvent(self.item, 'onGet');

                                    if (processedResponse.data.page) {
                                        self.page = processedResponse.data.page;
                                        self.params.page = self.page.number;
                                        self.params.size = self.page.size;
                                    }

                                    self.processedResponse = processedResponse;

                                    self.checkForEvent(self.item, 'afterGet');

                                    deferred.resolve(processedResponse);
                                });
                            };

                            if (!self.url) {
                                HATEAOSConfig.getApi(self.serviceName).then(function(api) {
                                    var prop; 

                                    self.url = api.url;

                                    // will change once hateoasConfig is its own module as this is handled in this file now
                                    for (prop in api.params) {
                                        if (!self.params[prop]) {
                                            self.params[prop] = api.params[prop];
                                            self.defaultParams[prop] = api.params[prop];
                                        }
                                    }

                                    self.params.accountId = $rootScope.currentUser.item.accounts[0].accountId;
                                    self.params.accountLevel = $rootScope.currentUser.item.accounts[0].level;

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

            return HATEOASFactory;
        }
    ]);
});
