define(['angular', 'filterSearch', 'hateoasFactory'], function(angular) {
    'use strict';
    angular.module('mps.filterSearch')
    .factory('FilterSearchService', ['grid', 'HATEOASFactory',
        function(Grid, HATEOASFactory) {
            var localScope = {},
            service,
            display,
            failure,
            columnSet,
            personalization;
            var FilterSearchService = function(serviceDefinition, scope, rootScope, personalization, columnSet, rowHeight){
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
                this.service = serviceDefinition;
                this.localScope = scope;
                this.columnSet = columnSet;
                this.personalization = personalization;
                this.display =  function(){
                    if(self.columnSet){
                        self.service.columns = self.columnSet;
                    }
                    Grid.display(self.service, self.localScope, self.personalization);
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
                this.localScope.visibleColumns =  Grid.getVisibleColumns(this.service); //sets initial columns visibility
                this.localScope.gridOptions = {};
                if (rowHeight) {
                    this.localScope.gridOptions.rowHeight = rowHeight;
                }
                this.localScope.gridOptions.onRegisterApi = Grid.getGridActions(rootScope,
                        this.service, this.personalization);
            };

            FilterSearchService.prototype.addBasicFilter = function(displayText, configuredParams){
                if(!displayText){
                    throw new Error('DisplayText is required');
                }
                var self  = this,
                filter = {
                    display: displayText,
                    functionDef: function(params){
                            var options  = {
                                'params':{}
                            };
                            if(configuredParams){
                                angular.extend(options.params, configuredParams);
                            }

                            angular.extend(options.params, params);
                            var promise = self.service.getPage(0, 20, options);
                            promise.then(self.display, self.failure);
                    },
                    params: self.localScope.optionParams
                };
                self.localScope.filterOptions.push(filter);
            };

            FilterSearchService.prototype.addPanelFilter = function(displayText,  optionsPanel, configuredParams){
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
                        functionDef: function(params){
                            var options  = {
                                'params':{}
                            };
                            if(configuredParams){
                                angular.extend(options.params, configuredParams);
                            }
                            angular.extend(options.params, params);

                            var promise = self.service.getPage(0, 20, options);
                            promise.then(self.display, self.failure);
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
