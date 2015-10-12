define(['angular', 'utility.personalizationService'], function(angular) {
    'use strict';
    angular.module('mps.utility')
    .factory('gridCustomizationService', [ '$translate','$http','SpringDataRestAdapter', 'personalizationService',
        function($translate, $http, SpringDataRestAdapter, personalizationService) {
            var GridCustomizationService = function(){
                this.columns =  { defaultSet:[] };
                this.functionArray = [];
            };
            GridCustomizationService.prototype = personalizationService;

            GridCustomizationService.prototype.setupBookmarkColumn = function(columns){
                columns['bookmarkColumn'] = 'getBookMark()';
                return columns;
            };

            GridCustomizationService.prototype.getColumnDefinition = function(type){
                return this.columns;
            };

            /*
             --Example--
                var functionArray = [
                    {
                        'name': 'addressFilter',
                        'functionDef': function(){
                            return this.blah + this.blah2;
                        }
                    }
                ];
            */
            GridCustomizationService.prototype.setFunctions = function(){
                var data = angular.copy(this.getList());
                 for(var i = 0; i < data.length; ++i){
                    for(var j = 0; j < this.functionArray.length; ++j){
                        data[i][this.functionArray[j]['name']] = this.functionArray[j]['functionDef'];
                    }
                 }
                 this.setList(angular.copy(data));
            };

            GridCustomizationService.prototype.getGRIDList = function(){
                 this.setFunctions();
                 return this.getList();
            };

            return new GridCustomizationService();
    }]);
});
