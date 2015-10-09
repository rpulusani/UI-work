define(['angular', 'utility.baseService'], function(angular) {
    'use strict';
    angular.module('mps.utility')
    .factory('personalizationService', ['baseService', function(baseService) {
        var PersonalizationService = function init(){
             this.modulePesonalization =
                {
                    'name': 'addresses',  //serviceBindingname
                    'itemsPerPage': '40', //property is added and value
                    //'columns': []         // columns if exists will override default columns set
                }
            ;
        };

        PersonalizationService.prototype = baseService;

        function sync(){

        }

        function getPersonalizedFragment(){
            //call out to new service and fill modulePersonalizationArray
            //if empty then
        }

        PersonalizationService.prototype.getPersonalizedConfiguration = function(configPropName){
            if(this.modulePesonalization && this.modulePesonalization.name &&
                 this.modulePesonalization.name === this.getBindingServiceName() &&
                 this.modulePesonalization[configPropName]){
                return this.modulePesonalization[configPropName];
            }else{
                return undefined;
            }
        };

        PersonalizationService.prototype.setPersonalizedConfiguration = function(configPropName, value){
            getPersonalizedFragment();

             if(this.modulePesonalization && this.modulePesonalization.name &&
                 this.modulePesonalization.name === this.getBindingServiceName()){
                    this.modulePesonalization[configPropName] = value; //update or add
            }else{
                //create Object Array
                this.modulePesonalization = [
                    {
                       'name': this.getBindingServiceName()
                    }
                ];
                this.modulePesonalization[configPropName]  = value;
            }
            //push personalization to the database repo via api
            sync();
        };

        return new PersonalizationService();
    }]);
});
