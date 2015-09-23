define(['angular', 'utility.baseService'], function(angular) {
    angular.module('mps.utility')
    .factory('gridCustomizationService', [ '$translate','$http','SpringDataRestAdapter', 'utility.baseService',
        function($translate, $http, SpringDataRestAdapter, baseService) {
            var gridCustomizationService = function(){

            };
            gridCustomizationService.prototype = baseService;

            gridCustomizationService.prototype.setupBookmarkColumn = function(columns){
                columns['bookmarkColumn'] = 'getBookMark()';
                return columns;
            };

            gridCustomizationService.prototype.setupColumnDefinition = function(){
                var columns =  { defaultSet:[], names: [], fields: [] };

                return columns;
            };
            gridCustomizationService.prototype.getColumnDefinition = function(type){
                return this.columns;
            };

            return new gridCustomizationService();
    }]);
});
