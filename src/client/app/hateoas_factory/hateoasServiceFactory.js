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

                    if (!serviceDefinition.columns || serviceDefinition.columns.toLowerCase() === 'default') {
                        serviceDefinition.columns = 'defaultSet';
                    }
                }

                self = angular.extend(self, serviceDefinition);

                return self;
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
                obj.embeddedName = false;

                return obj;
            };

             HATEOASFactory.prototype.getLoggedInUserInfo = function(loginId) {
                var self  = this,
                deferred = $q.defer(),
                url = '';

                if (!loginId) {
                    loginId = $rootScope.idpUser.email;
                }

                HATEAOSConfig.getApi(self.serviceName).then(function(api) {
                    self.url = api.url;
                    url = self.url + '/' + loginId;

                    $http.get(url).then(function(processedResponse) {
                        var user = self.createItem(processedResponse.data);
                        // this should be working directly with UserService
                        if (self.serviceName === 'users' && !self.item) {
                            self.item = user;
                        }

                       $rootScope.currentUser.item = self.setItem(user);

                        deferred.resolve(user);
                    });
                });

                return deferred.promise;
            };

            HATEOASFactory.prototype.reset = function(){
                this.item = null;
                this.data = null;
            };

            HATEOASFactory.prototype.newMessage  = function(){
                this.item = {
                    _links:{},
                    postURL: this.url
                };
            };

            HATEOASFactory.prototype.addField = function(fieldName, fieldValue) {
                if (!this.item) {
                   this.item = this.newMessage(); //if halObject is empty then fill it with a new message
                }

                this.item[fieldName] = fieldValue;
            };

            HATEOASFactory.prototype.getMessage = function() {
                if (!this.item) {
                    this.newMessage(); //if halObject is empty then fill it with a new message
                } else if (!this.item._links) {
                    this.item._links = {};   //if halObject is not empty but missing the links sub object add it
                }
            };

            HATEOASFactory.prototype.addRelationship = function(name, halObj, altName){
                var tempObject = {},
                calculatedName = (altName) ? altName: name;

                this.getMessage();

                if (halObj && halObj._links && halObj._links[calculatedName] &&
                     halObj._links[calculatedName].href) {
                    tempObject[name] = { href: halObj._links[calculatedName].href};
                    angular.extend(this.item._links, tempObject);
                }
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
                        url: halObj._links[newService.embeddedName].href,
                        params: newService.params
                    });
                    newService.url = self.setupUrl(halObj._links[newService.embeddedName].href);
                }

                $rootScope.currentUser.deferred.promise.then(function() {
                    newService.params.accountId = $rootScope.currentUser.accounts[0].accountId;
                    newService.params.accountLevel = $rootScope.currentUser.accounts[0].level;

                    newService.get({
                        page: newService.params.page,
                        size: newService.params.size
                    }).then(function(processedResponse) {
                        deferred.resolve();
                    });
                });

                return deferred.promise;
            };

            HATEOASFactory.prototype.setupDefaultFunctions = function(obj) {
                var self = this;

                obj.createItem = self.createItem;
                obj.setItemDefaults = self.setItemDefaults;
                obj.checkForEvent = self.checkForEvent;
                obj.setupItem = self.setupItem;
                obj.setupOptions = self.setupOptions;
                obj.setItem = self.setItem;
                obj.get = self.get;
                obj.getPage = self.getPage;
                obj.buildUrl = self.buildUrl;
                obj.setupUrl = self.setupUrl;
                obj.setupParams = self.setupParams;
                obj.send = self.send;
                obj.post = self.post;
                obj.put = self.put;
                obj.setParamsToNull = self.setParamsToNull;
                obj.getHalUrl = self.getHalUrl;
                obj.processCall = self.processCall;
                obj.getAdditional = self.getAdditional;
                obj.reset = self.reset;
                obj.newMessage = self.newMessage;
                obj.addField = self.addField;
                obj.getMessage = self.getMessage;
                obj.addRelationship = self.addRelationship;
                obj.attachLinksAsFunctions = self.attachLinksAsFunctions;
                obj.setupDefaultFunctions = self.setupDefaultFunctions;

                return obj;
            }

            HATEOASFactory.prototype.attachLinksAsFunctions = function(item, links, itemOptions) {
                var self = this,
                deferred = $q.defer(),
                link;

                for (link in links) {
                    if (links[link] && links[link].href && link !== 'self') {
                        (function(item, link) {
                            if (!links[link].serviceName && !links[link].embeddedName) {
                                item[link] = self.setItemDefaults();
                            }

                            item[link].serviceName = link;
                            item[link].url = self.setupUrl(item._links[link].href);
                            item[link].params = self.setupParams({url: item._links[link].href});

                            item.linkNames.push(link);

                            item.links[link] = function(options) {
                                item[link] = self.setupDefaultFunctions(item[link]);

                                item[link].get(options).then(function(res) {
                                    deferred.resolve(res);
                                });

                                return deferred.promise;
                            };
                        }(item, link));
                    }
                }

                return item;
            };

            HATEOASFactory.prototype.createItem = function(halObj, itemOptions) {
                if (!itemOptions) {
                    itemOptions = {};
                }

                itemOptions.newItem = true;

                return this.setItem(halObj, itemOptions);
            };

            HATEOASFactory.prototype.setItem = function(halObj, itemOptions) {
                var self = this,
                link, // prop in _links
                item,
                propName;

                if (halObj) {
                    item = halObj;

                    if (!itemOptions) {
                        itemOptions = {};
                    }

                    self.checkForEvent(item, 'onItemSetup');

                    item.linkNames = [];
                    item.links = {};
                    item.url = self.setupUrl(item._links.self.href);
                    item.params = self.setupParams({url: item._links.self.href});

                    if (!item.get) {
                        item = self.setupDefaultFunctions(item);
                    }

                    if (item._links) {
                        item = self.attachLinksAsFunctions(item, item._links, itemOptions);
                    }

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

            HATEOASFactory.prototype.getHalUrl = function(halObj) {
                var url = '',
                i = 0;

                if (halObj.item && halObj.item.postURL) {
                    url = halObj.item.postURL;
                } else if (halObj.item && halObj.item._links){
                    for (i; i < halObj.item._links.length; i += 1) {
                        if (halObj.item._links[i].self && halObj.item._links[i].self.href) {
                            url = halObj.item._links[i].self.href;
                        }
                    }
                }

                return url;
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
            };

            // core logic for put/post
            HATEOASFactory.prototype.send = function(halObj, method, verbName) {
                var self  = this,
                deferred = $q.defer();

                self.checkForEvent(halObj, 'before' + verbName).then(function(canContinue, newObj) {
                    var url,
                    itemUrl;

                    if (canContinue === true) {
                        if (newObj) {
                            halObj = newObj;
                        }

                        if (method === 'get') {
                            //get 0 index until account switching and preferences are 100% implemented
                            self.params.accountId = $rootScope.currentUser.accounts[0].accountId;
                            self.params.accountLevel = $rootScope.currentUser.accounts[0].level;
                        }

                        if (halObj.item.id && halObj.item.id === '') {
                            delete halObj.item.id;
                        }

                        itemUrl = self.getHalUrl(halObj);
                        url = self.buildUrl(itemUrl, self.params, []);

                        self.checkForEvent(self.item, 'on' + verbName);

                        $http({
                            method: method,
                            url: url,
                            data: halObj.item
                        }).then(function(processedResponse) {
                            self.item = processedResponse.data;
                            self.processedResponse = processedResponse;

                            self.checkForEvent(self.item, 'after' + verbName);

                            deferred.resolve(processedResponse);
                        });
                    } else {
                        deferred.resolve(false);
                    }
                });

                return deferred.promise;
            };

            HATEOASFactory.prototype.post = function(halObj) {
                return this.send(halObj, 'post', 'post');
            };

            HATEOASFactory.prototype.put = function(halObj) {
                return this.send(halObj, 'put', 'put');
            };

            // Provided for convenience
            HATEOASFactory.prototype.save = function(halObj) {
                return this.send(halObj, 'post', 'post');
            };

            HATEOASFactory.prototype.update = function(halObj) {
                return this.send(halObj, 'put', 'put');
            };

            HATEOASFactory.prototype.getPage = function(page, size, additionalOptions) {
                var self = this,
                options;

                if (page !== 0 && !page) {
                    page = self.params.page;
                } else {
                    self.params.page = page;
                }

                if (!size) {
                    size = self.params.size;
                } else {
                    self.params.page = page;
                }

                options = {
                    page: page,
                    size: size
                };
                
                if (additionalOptions) {
                    angular.extend(options, additionalOptions);
                
                }

                return this.get(options);
            };

            HATEOASFactory.prototype.setupOptions = function(optionsObj, fn) {
                var self = this,
                options = {};

                if (optionsObj) {
                    if (!angular.isString(optionsObj)) {
                        options = optionsObj;
                    } else {
                        options = {
                            url: self.url + optionsObj
                        };
                    }
                }

                if (options.params) { // if params exist extend from self params list
                    angular.extend(options.params, self.params);
                }else{ //if not then set params list based on self params list
                    options.params = self.params;
                }

                if (options.page && options.page >= 0) {
                    self.params.page = options.page;
                }

                if (options.size) {
                    self.params.size = options.size;
                }

                if (options.embeddedName) {
                    self.embeddedName = options.embeddedName;
                }

                if (options.serviceName) {
                    self.serviceName = options.serviceName;
                }

                if (options.columns) {
                    self.columns = options.columns;
                }

                if (options.columnDefs) {
                    self.columnDefs = options.columnDefs;
                }

                //update self params to match the latest options param calls
                self.params = options.params;

                return options;
            };

            HATEOASFactory.prototype.setupItem = function(processedResponse) {
                var self = this,
                prop;

                if (processedResponse.data._embedded && processedResponse.data.page) {
                    if (!self.embeddedName) {
                        self.data = processedResponse.data._embedded[self.serviceName];
                    } else {
                        self.data = processedResponse.data._embedded[self.embeddedName];
                    }
                } else {
                    if (processedResponse.data._links) {
                         if (self.serviceName && (processedResponse.data._embedded 
                            && processedResponse.data._embedded[self.serviceName]) ) {

                            if (processedResponse.data._embedded[self.serviceName] instanceof Array) {
                                self.data = processedResponse.data._embedded[self.serviceName];
                            } else {
                                self.item = processedResponse.data._embedded[self.serviceName];
                            }
                        } else {
                            self.setItem(processedResponse.data);
                        }
                    } else {
                        self.data = processedResponse.data;
                    }

                    if (self.item && self.item._embedded) {
                        for (prop in self.item._embedded) {
                            if (!self.item[prop]) {
                                self.item[prop] = self.setItemDefaults();
                            }

                            if (self.item._embedded[prop] instanceof Array) {
                                self.item[prop].data = self.item._embedded[prop];
                            } else {
                                if (!self.item._embedded[prop]._links) {
                                    self.item[prop].item = self.item._embedded[prop];
                                } else {
                                    self.item[prop].item = self.createItem(self.item._embedded[prop]);
                                }
                            }
                        }
                    }
                }

                if (processedResponse.data.page) {
                    self.page = processedResponse.data.page;
                    self.params.page = self.page.number;
                    self.params.size = self.page.size;
                }
            };

            HATEOASFactory.prototype.setParamsToNull = function() {
                var self = this,
                prop;

                for (prop in self.params) {
                    self.params[prop] = null;
                }
            };

            HATEOASFactory.prototype.processCall = function(options, deferred) {
                var self = this,
                currentParams = self.params,
                url;

                if (!options.preventDefaultParams) {
                    self.params = self.setupParams({
                        url: self.url,
                        params: self.params
                    });
                } else {
                   self.setParamsToNull();
                }

                if (options.params) {
                   angular.extend(options.params, self.params);
                } else {
                    options.params = self.params;
                }

                if (!options.url) {
                    self.url = self.setupUrl(self.url);
                    options.url = self.buildUrl(self.url, options.params);
                } else {
                    options.url = self.buildUrl(options.url, options.params);
                }

                self.checkForEvent(self.item, 'onGet');

                options.params = {};    

                $http(options).then(function(processedResponse) {
                    self.setupItem(processedResponse);

                    self.processedResponse = processedResponse;

                    self.params = currentParams;

                    self.checkForEvent(self.item, 'afterGet');

                    deferred.resolve(processedResponse);
                });
            };

            HATEOASFactory.prototype.get = function(optionsObj) {
                var self  = this,
                deferred = $q.defer();

                self.checkForEvent(self.item, 'beforeGet').then(function(canContinue, newObj) {
                    if (canContinue) {
                        if (newObj) {
                            self.item = newObj;
                        }

                        $rootScope.currentUser.deferred.promise.then(function() {
                            var item,
                            options = self.setupOptions(optionsObj);
                            
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

                                    self.params.accountId = $rootScope.currentUser.accounts[0].accountId;
                                    self.params.accountLevel = $rootScope.currentUser.accounts[0].level;

                                    self.processCall(options, deferred);
                                });
                            } else {
                                self.processCall(options, deferred);
                            }
                        }, function(reason) {
                            $rootScope.currentUser.deferred.reject(reason);
                        });
                    }
                });

                return deferred.promise;
            };

            return HATEOASFactory;
        }
    ]);
});
