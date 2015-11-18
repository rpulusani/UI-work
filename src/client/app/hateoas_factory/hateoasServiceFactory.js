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
                self.columns = 'defaultSet';
                self.columnDefs = null;
                self.url = '';
                // self.params  = {page: 0, size: 20, sort: ''}, defined by hateaosconfig
                self.params = {};
                // Placeholder for the original params given to us from server
                self.defaultParams = {};
                self.route = '';
                console.log('new hateoas for: ' + serviceDefinition.serviceName);
                if (serviceDefinition.columns instanceof Array) {
                    if (!serviceDefinition.columnDefs) {
                       serviceDefinition.columnDefs = {};
                    }

                    serviceDefinition.columnDefs.defaultSet = serviceDefinition.columns;
                }

                return angular.extend(self, serviceDefinition);
            };

            HATEOASFactory.prototype.parseOptions = function(options) {

            };

            HATEOASFactory.prototype.reset = function(){
                this.item = null;
            };
            HATEOASFactory.prototype.newMessage  = function(){
                this.item = {
                    '_links':[],
                    'postURL': this.url
                };
            };
            HATEOASFactory.prototype.addField = function(fieldName, fieldValue){
                if(!this.item){
                   this.item = this.newMessage(); //if halObject is empty then fill it with a new message
                }

                this.item[fieldName]  = fieldValue;
            };

            HATEOASFactory.prototype.getMessage = function(){
                if(!this.item){
                    this.newMessage(); //if halObject is empty then fill it with a new message
                }else if(!this.item['_links']){
                    this.item['_links'] = [];   //if halObject is not empty but missing the links sub object add it
                }
            };

            HATEOASFactory.prototype.addRelationship = function(name, link){
                this.getMessage();

                var found = false,
                length = this.item['_links'].length,
                links = this.item['_links'],
                foundId = -1;


                if(name && link){

                    for(var i = 0; i < length; ++i){
                        if(links[i][name]){
                            found  = true;
                            foundId = i;
                            break;
                        }
                    }

                    if(!found){
                        var tempObject = {};
                        tempObject[name] = { href: link };
                        links.push(tempObject);
                    }else{
                         links[foundId][name] = link;
                    }
                }
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
                links,
                item,
                propName;

                if (!itemOptions) {
                    itemOptions = {};
                }

                self.checkForEvent(self.item, 'onItemSetup');

                if (halObj) {
                    item = halObj;
                    links = halObj._links;

                    item.linkNames = [];
                    item.links = {};
                    item.url = self.buildUrl(halObj._links.self.href, false, false);

                    for (link in links) {
                        if (links[link].href) {
                            item[link] = {};
                            item[link].links = {};
                            item[link].data = [];
                            item[link].page = {};
                            item[link].params = self.params;
                            item[link].params.page = 0;
                            item[link].params.size = 20;
                            item[link].params.sort = null;
                            item[link].url = self.buildUrl(halObj._links[link].href, item.params, false);
                            item[link].linkNames = [];
                            item[link].columns = self.columns;
                            item[link].columnDefs = self.columnDefs;
                            item[link].serviceName = link;

                            item.linkNames.push(link);

                            if (!itemOptions.embeddedName) {
                                item[link].embeddedName = null;
                            } else {
                                item[link].embeddedName = itemOptions.embeddedName;
                            }

                            (function(item, link) {
                                item.links[link] = function(options) {
                                    var deferred = $q.defer();

                                    if (!options) {
                                        options = {};
                                    }

                                    if (!options.method) {
                                        options.method = 'get';
                                    }

                                    if (!options.url) {
                                        options.url = self.buildUrl(item[link].url, item[link].params, options.params);
                                    } else {
                                        options.url = self.buildUrl(options.url, item[link].params, options.params);
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
                                    //this is temporary - build url should remove tack on params
                                    //so that this can be used
                                    if(options.params){
                                       delete options.params;
                                    }
                                    $http(options).then(function(response) {
                                        var embeddedProperty = null;

                                        self.processedResponse = response;
                                        //if there is embeded items then add them to the main object
                                        for(var embed in response.data._embedded){
                                            if(!item[embed]){
                                                item[embed] = {};  // only if embed item doesn't exist.
                                            }
                                            item[embed].item = response.data._embedded[embed];
                                        }

                                        if (response.data.page) {
                                            item[link].page = response.data.page;
                                        }

                                        if (item[link].data && item[link].data.status) {
                                            item[link].data = [];
                                        }

                                        deferred.resolve(item[link], response);
                                    });

                                    return deferred.promise;
                                };
                            }(item, link));
                        }
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
            HATEOASFactory.prototype.getHalUrl = function(halObj){
                var url = '';
                if(halObj.item && halObj.item['postURL']){
                    url = halObj.item['postURL'];
                }else if(halObj.item && halObj.item['_links']){
                    for(var i = 0; i < halObj.item['_links'].length; ++i){
                        if(halObj.item['_links'][i]['self'] && halObj.item['_links'][i]['self']['href']){
                            url = halObj.item['_links'][i]['self']['href'];
                        }
                    }
                }
                return url;
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

                        if(method === 'get'){
                            self.params.accountId = $rootScope.currentUser.item.accounts[0].accountId; //get 0 index until account switching and preferences are 100% implemented
                            self.params.accountLevel = $rootScope.currentUser.item.accounts[0].level;  //get 0 index until account switching and preferences are 100% implemented
                        }

                        itemUrl = getHalUrl(halObj);
                        url = self.buildUrl(itemUrl, self.params, []);

                        self.checkForEvent(halObj.item, 'on' + verbName);

                        $http({
                            method: method,
                            url: url,
                            data: halObj.item
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
                return this.send(halObj, 'post', 'post');
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

                if (self.page.next) {
                    return self.get({
                        url: self.page.next
                    });
                } else {
                    return null;
                }
            };

            HATEOASFactory.prototype.prev = function() {
                var self = this;

                self.checkForEvent(self.item, 'onPrev');

                if (self.page.prev) {
                    return self.get({
                        url: self.page.prev
                    });
                } else {
                    return null;
                }
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

            HATEOASFactory.prototype.getAdditional = function(halObj, newService) {
                var self  = this,
                deferred = $q.defer(),
                url = '';

                newService.item = null;
                newService.data = [];

                if (halObj.item && halObj.item._links[newService.serviceName]) {
                    url = halObj.item._links[newService.serviceName].href;
                } else if (halObj.item && halObj.item._links[newService.embeddedName]) {
                    url = halObj.item._links[newService.embeddedName].href;
                } else {
                    url = halObj._links[newService.serviceName].href;
                }

                $http.get(url).then(function(processedResponse) {
                    if (processedResponse._embeddedItems && processedResponse._embeddedItems[newService.embeddedName].constructor === Array) {
                        newService.data = processedResponse.data._embeddedItems[newService.embeddedName];
                        newService.page = processedResponse.data.page;
                        newService.params.page = self.page.number;
                        newService.params.size = self.page.size;
                    } else {
                        newService.item = processedResponse;
                    }

                    newService.processedResponse = angular.toJson(processedResponse, true);
                    deferred.resolve();
                });

                return deferred.promise;
            };

            HATEOASFactory.prototype.get = function(optionsObj, linkName) {
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
                            url: self.url + optionsObj,
                            preventParams: true
                        };
                    }
                }

                if (linkName) {
                    options.linkName = linkName;
                }

                self.checkForEvent(self.item, 'beforeGet').then(function(canContinue, newObj) {
                    if (canContinue) {
                        if (newObj) {
                            self.item = newObj;
                        }

                        // TODO: MAKE SURE THIS DOEST CALL EACH TIME
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

                                if (!options.preventDefaultParams) {
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

                                    self.checkForEvent(self.item, 'afterGet');

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
                addParamSyntax = function(paramsUrl) {
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
                            paramsUrl += value.name + '=' + value.value;
                        }
                    });
                }

                return url += paramsUrl;
            };

            return HATEOASFactory;
        }
    ]);
});
