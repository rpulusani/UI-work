define(['angular', 'utility.personalizationService'], function(angular) {
    'use strict';
    angular.module('mps.utility')
    .factory('gridCustomizationService', [ '$translate','$http','SpringDataRestAdapter', 'personalizationService',
        function($translate, $http, SpringDataRestAdapter, personalizationService) {
            var GridCustomizationService = function(){
                this.columns =  { defaultSet:[] };
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
            GridCustomizationService.prototype.setFunctions = function(functionArray){
                var data = Angular.copy(this.getList());
                 for(var i = 0; i < data.length; ++i){
                    for(var j = 0; i < functionArray.length; ++j){
                        data[i][functionArray[j]['name']] = functionArray[j]['functionDef'];
                    }
                 }
                 this.setList(Angular.copy(data));
            };


            return new GridCustomizationService();
    }]);
});
