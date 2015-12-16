define(['angular', 'filterSearch'], function(angular) {
    'use strict';
    angular.module('mps.filterSearch')
    .factory('FilterSearchService', ['grid',
        function(Grid) {
            var localScope = {},
            service,
            display,
            failure,
            columnSet,
            personalization;
            var FilterSearchService = function(serviceDefinition, scope, rootScope, personalization, columnSet){
                var self = this;
                this.service = serviceDefinition;
                this.localScope = scope;
                this.columnSet = columnSet;
                this.localScope.searchFunctionDef = function(params, removeParams){
                    var options  = {
                        'params':{}
                    };

                    self.clearParameters(removeParams);
                    angular.extend(options.params, params);
                    self.service.getPage(0, 20, options).then(self.display, self.failure);
                };
                this.display =  function(){
                    if(self.columnSet){
                        self.service.columns = self.columnSet;
                    }
                    Grid.display(self.service, self.localScope, self.personalization);
                };
                this.failure = function(reason){
                    NREUM.noticeError('Grid Load Failed for ' + self.service.serviceName +  ' reason: ' + reason);
                };
                this.localScope.optionParams = {};
                this.localScope.filterOptions = [];
                this.personalization = personalization;
                this.localScope.visibleColumns =  Grid.getVisibleColumns(this.service); //sets initial columns visibility
                this.localScope.gridOptions = {};
                this.localScope.gridOptions.onRegisterApi = Grid.getGridActions(rootScope,
                    this.service, this.personalization);
            };

            FilterSearchService.prototype.addBasicFilter = function(displayText, configuredParams){
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
                            self.service.getPage(0, 20, options).then(self.display, self.failure);
                        },
                        params: self.localScope.optionParams
                };
                self.localScope.filterOptions.push(filter);
            };

            FilterSearchService.prototype.addPanelFilter = function(displayText,  optionsPanel, configuredParams){
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
                            self.service.getPage(0, 20, options).then(self.display, self.failure);
                        },
                        params: self.localScope.optionParams
                };
                self.localScope.filterOptions.push(filter);
            };

            FilterSearchService.prototype.clearParameters = function(params){
                var self = this;
                for(var i = 0; i < params.length; ++i){
                    delete self.service.params[params[i]];
                }
            };

         return FilterSearchService;

    }]);
});
