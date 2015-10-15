define(['angular'], function(angular) {
    'use strict';
    angular.module('mps.utility')
    .factory('PersonalizationServiceFactory', [function() {
        var PersonalizationServiceFactory = function(serviceDefinition){
             var self = this;
             self.modulePesonalization ={};
             return angular.extend(self, serviceDefinition);
        };

        function sync(){

        }

        function getPersonalizedFragment(){
            //call out to new service and fill modulePersonalizationArray
            //if empty then
        }

        PersonalizationServiceFactory.prototype.getPersonalizedConfiguration = function(configPropName){
            if(this.modulePesonalization && this.modulePesonalization.name &&
                 this.modulePesonalization.name === this.serviceName &&
                 this.modulePesonalization[configPropName]){
                return this.modulePesonalization[configPropName];
            }else{
                return undefined;
            }
        };

        PersonalizationServiceFactory.prototype.setPersonalizedConfiguration = function(configPropName, value){
            getPersonalizedFragment();

             if(this.modulePesonalization && this.modulePesonalization.name &&
                 this.modulePesonalization.name === this.serviceName){
                    this.modulePesonalization[configPropName] = value; //update or add
            }else{
                //create Object Array
                this.modulePesonalization =
                    {
                       'name': this.serviceName
                    };
                this.modulePesonalization[configPropName]  = value;
            }
            //push personalization to the database repo via api
            sync();
        };

        return PersonalizationServiceFactory();
    }]);
});
