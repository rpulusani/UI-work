define(['angular', 'utility.baseService'], function(angular) {
    angular.module('mps.utility')
    .factory('gridCustomizationService', [ '$translate','$http','SpringDataRestAdapter', 'baseService',
        function($translate, $http, SpringDataRestAdapter, baseService) {
            var gridCustomizationService = function(){
                this.columns =  { defaultSet:[] };
            };
            gridCustomizationService.prototype = baseService;

            gridCustomizationService.prototype.setupBookmarkColumn = function(columns){
                columns['bookmarkColumn'] = 'getBookMark()';
                return columns;
            };

            gridCustomizationService.prototype.getColumnDefinition = function(type){
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
            gridCustomizationService.prototype.setFunctions = function(functionArray){
                var data = Angular.copy(this.getList());
                 for(var i = 0; i < data.length; ++i){
                    for(var j = 0; i < functionArray.length; ++j){
                        data[i][functionArray[j]['name']] = functionArray[j]['functionDef'];
                    }
                 }
                 this.setList(Angular.copy(data));
            };


            return new gridCustomizationService();
    }]);
});
