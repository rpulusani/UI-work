
angular.module('mps.filterSearch')
.factory('FilterSearchService', ['grid', 'HATEOASFactory', '$routeParams', '$q', '$timeout',
    function(GridService, HATEOASFactory, $routeParams, $q, $timeout) {
        var localScope = {},
        service,
        display,
        failure,
        columnSet,
        personalization,

        FilterSearchService = function(serviceDefinition, scope, rootScope, personalization, columnSet, rowHeight, OptionName, beforeFunction){
            if(!serviceDefinition){
                throw new Error('Service Definition is Required!');
            }
            if(!(serviceDefinition instanceof HATEOASFactory)){
                throw new Error('Only Services of type HATEOASFactory allowed!');
            }
            if(!scope){
                throw new Error('Scope is required!');
            }
            if(!rootScope || !personalization){
                throw new Error('Grid Options onRegisterAPI was not setup, possibly missing rootScope, Service Definition or Personalization');
            }
            
            serviceDefinition.params.accountId = rootScope.currentAccount === undefined? null : rootScope.currentAccount.accountId;
            serviceDefinition.params.accountLevel = rootScope.currentAccount === undefined? null : rootScope.currentAccount.accountLevel;
            
            
            var self = this;
            var $ = require('jquery');
            self.Grid = new GridService();
            self.service = serviceDefinition;
            self.localScope = scope;
            // do we have grid data
            self.localScope.gridDataCnt = 0;
            this.beforeFunction  = beforeFunction;
            self.localScope.gridLoading = true;
            self.columnSet = columnSet;
            self.personalization = personalization;

            function setVisibilityPromise(){
                var visibleDefered = $q.defer();
                self.localScope.visibleColumns = visibleDefered.promise;
                $timeout(function(){
                    visibleDefered.resolve(self.Grid.getVisibleColumns(self.service));
                }, 500);
            }
            self.display = function(fn) {
                if(self.columnSet){
                    self.service.columns = self.columnSet;
                }

                if(!$.isFunction(this.beforeFunction)){
                    this.beforeFunction = function(){
                        var deferred = $q.defer();
                        deferred.resolve();
                        return deferred.promise;
                    };
                }
                var deferred = this.beforeFunction();
                deferred.then(function(){
                    setVisibilityPromise();
                    self.localScope.$broadcast('setUpSearchCss');
                    if (rowHeight) {
                        self.Grid.display(self.service, self.localScope, self.personalization, rowHeight, function() {
                                self.localScope.gridDataCnt = self.service.page.totalPages;
                                self.localScope.gridLoading = false;
                                self.localScope.$broadcast('setupColumnPicker', self.Grid);
                            if (typeof fn === 'function') {
                                return fn(self.Grid);
                            }
                        });
                    } else {
                        self.Grid.display(self.service, self.localScope, self.personalization, undefined, function() {
                                self.localScope.gridDataCnt = self.service.page.totalPages;
                                self.localScope.gridLoading = false;
                                self.localScope.$broadcast('setupColumnPicker', self.Grid);
                            if (typeof fn === 'function') {
                                return fn(self.Grid);
                            }
                        });
                    }
                });
            };
            this.failure = function(reason){
                NREUM.noticeError('Grid Load Failed for ' + self.service.serviceName +  ' reason: ' + reason);
            };

            self.localScope.searchFunctionDef = function(params, removeParams){
                var options  = {
                    'params':{}
                };

                self.clearParameters(removeParams);
                angular.extend(options.params, params);

                self.localScope.gridLoading = true;

                self.service.getPage(0, 20, options).then(function() {
                    self.localScope.gridDataCnt = self.service.data.length;
                    self.localScope.gridLoading = false;

                    self.display();
                }, self.failure);
            };

            this.localScope.optionParams = {};
            this.localScope.filterOptions = [];
            setVisibilityPromise();
            if(OptionName){
                self.Grid.setGridOptionsName(OptionName);
            }
            this.localScope[self.Grid.optionsName] = {};
            if (rowHeight) {
                this.localScope[self.Grid.optionsName].rowHeight = rowHeight;
            }
            this.localScope[self.Grid.optionsName].onRegisterApi = self.Grid.getGridActions(rootScope,
                    this.service, this.personalization);

        };

        FilterSearchService.prototype.addBasicFilter = function(displayText, configuredParams, removeParams, fn) {
            if(!displayText){
                throw new Error('DisplayText is required');
            }
            var self  = this,
            size = 20,
            filter = {
                display: displayText,
                functionDef: function(params) {
                    var options  = {
                        'params':{}
                    },
                    addParams = {};

                    if(configuredParams){
                        angular.extend(options.params, configuredParams);
                    }

                    angular.extend(options.params, params);

                    if (removeParams) {
                        for(var i = 0; i < removeParams.length; ++i){
                            if (removeParams[i] === 'preventDefaultParams') {
                                var preventDefaultParams = {
                                    'preventDefaultParams': true
                                };
                                angular.extend(options, preventDefaultParams);
                            }
                            delete options.params[removeParams[i]];
                        }
                        self.clearParameters(removeParams);
                    }

                    if (!options.params.size) {
                        if (self.service.params.size) {
                            size = self.service.params.size;
                        }

                        addParams = {
                            page: 0,
                            size: size
                        };

                        angular.extend(options.params, addParams);
                    }

                    if ($routeParams.search && $routeParams.searchOn) {
                        options.params.search = $routeParams.search;
                        options.params.searchOn = $routeParams.searchOn;
                    }

                    var promise = self.service.get(options);

                    promise.then(function() {
                        if (!self.service.item) {
                            self.service.setItem(self.service.data[0]);
                        }

                        self.display(fn);
                    }, self.failure);
                },
                params: self.localScope.optionParams
            };

            self.localScope.filterOptions.push(filter);
            self.localScope.$broadcast('updateSearchFilter', filter);
        };

        FilterSearchService.prototype.addPanelFilter = function(displayText,  optionsPanel, configuredParams, fn){
            if(!displayText){
                throw new Error('DisplayText is required');
            }
            if(!optionsPanel){
                throw new Error('OptionsPanel is required');
            }
            var self  = this,
            size = 20,
            filter = {
                display: displayText,
                optionsPanel: optionsPanel,
                functionDef: function(params, removeParams){
                    var options  = {
                        'params':{}
                    },
                    addParams = {};
                        self.localScope.gridLoading = true;

                    if(configuredParams){
                        angular.extend(options.params, configuredParams);
                    }
                    angular.extend(options.params, params);

                    if (removeParams) {
                        for(var i = 0; i < removeParams.length; ++i){
                            delete options.params[removeParams[i]];
                        }
                        self.clearParameters(removeParams);
                    }

                    if (!options.params.size) {
                        if (self.service.params.size) {
                            size = self.service.params.size;
                        }

                        addParams = {
                            page: 0,
                            size: size
                        };

                        angular.extend(options.params, addParams);
                    }

                    var promise = self.service.get(options);

                    promise.then(function(response) {
                    	
                    	self.localScope.status = self.service.status;
                        if (!self.service.item) {
                            self.service.setItem(self.service.data[0]);
                        }

                        self.display(fn);
                    }, self.failure);
                },
                params: self.localScope.optionParams
            };
            self.localScope.filterOptions.push(filter);
        };

        FilterSearchService.prototype.clearParameters = function(paramsArray){
            var self = this;
            if(paramsArray){
                for(var i = 0; i < paramsArray.length; ++i){
                    delete self.service.params[paramsArray[i]];
                }
            }
        };

        return FilterSearchService;
}]);
