define(['angular', 'filterSearch', 'hateoasFactory'], function(angular) {
    'use strict';
    angular.module('mps.filterSearch')
    .factory('FilterSearchService', ['grid', 'HATEOASFactory',
        function(GridService, HATEOASFactory) {
            var localScope = {},
            service,
            display,
            failure,
            columnSet,
            personalization,

            FilterSearchService = function(serviceDefinition, scope, rootScope, personalization, columnSet, rowHeight, OptionName){
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
                var self = this;
                self.Grid = new GridService();
                this.service = serviceDefinition;
                this.localScope = scope;
                this.columnSet = columnSet;
                this.personalization = personalization;
                this.display = function(fn) {

                    if(self.columnSet){
                        self.service.columns = self.columnSet;
                    }

                    if (rowHeight) {
                        self.Grid.display(self.service, self.localScope, self.personalization, rowHeight, function() {
                            if (typeof fn === 'function') {
                                return fn(self.Grid);
                            }
                        });
                    } else {
                        self.Grid.display(self.service, self.localScope, self.personalization, undefined, function() {
                            if (typeof fn === 'function') {
                                return fn(self.Grid);
                            }
                        });
                    }
                };
                this.failure = function(reason){
                    NREUM.noticeError('Grid Load Failed for ' + self.service.serviceName +  ' reason: ' + reason);
                };

                this.localScope.searchFunctionDef = function(params, removeParams){
                    var options  = {
                        'params':{}
                    };

                    self.clearParameters(removeParams);
                    angular.extend(options.params, params);
                    self.service.getPage(0, 20, options).then(self.display, self.failure);
                };

                this.localScope.optionParams = {};
                this.localScope.filterOptions = [];
                this.localScope.visibleColumns =  self.Grid.getVisibleColumns(this.service); //sets initial columns visibility
                if(OptionName){
                    self.Grid.setGridOptionsName(OptionName);
                }
                this.localScope[self.Grid.optionsName] = {};
                if (rowHeight) {
                    this.localScope[self.Grid.optionsName].rowHeight = rowHeight;
                }
                this.localScope.gridOptions.onRegisterApi = self.Grid.getGridActions(rootScope,
                        this.service, this.personalization);

            };

            FilterSearchService.prototype.addBasicFilter = function(displayText, configuredParams, removeParams, fn) {
                if(!displayText){
                    throw new Error('DisplayText is required');
                }
                var self  = this,
                filter = {
                    display: displayText,
                    functionDef: function(params) {
                        var options  = {
                            'params':{}
                        };
                        if(configuredParams){
                            angular.extend(options.params, configuredParams);
                        }

                        angular.extend(options.params, params);

                        if (removeParams) {
                            for(var i = 0; i < removeParams.length; ++i){
                                if (removeParams[i] === 'preventDefaultParams') {
                                    var preventDefaultParams = {
                                        'preventDefaultParams': true
                                    }
                                    angular.extend(options, preventDefaultParams);
                                }
                                delete options.params[removeParams[i]];
                            }
                            self.clearParameters(removeParams);
                        }

                        var promise = self.service.getPage(0, self.service.params.size, options);
                        promise.then(function() {
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
                filter = {
                    display: displayText,
                    optionsPanel: optionsPanel,
                    functionDef: function(params, removeParams){
                        var options  = {
                            'params':{}
                        };
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

                        var promise = self.service.getPage(0, self.service.params.size, options);

                        promise.then(function() {
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
});
