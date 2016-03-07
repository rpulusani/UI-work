
'use strict';
angular.module('mps.utility')
.factory('PersonalizationServiceFactory', [function() {
    var PersonalizationServiceFactory = function(uri, userId){
         var self = this;
         self.modulePesonalization = this.getPersonalizedFragment(uri, userId);
         // tentative place for preference keys
    };

    PersonalizationServiceFactory.prototype.save = function(fragment){
        this.modulePesonalization = fragment;
        //save back to db the updated/new settings
    };

    PersonalizationServiceFactory.prototype.getPersonalizedFragment = function(uri, userId){
        var fragment = {};
        //query for personalized fragment based on  uri and userId
        if(this.modulePesonalization !== undefined && this.modulePesonalization.name === uri){
            fragment = angular.copy(this.modulePesonalization);
        }else{
            //setup starter fragment
            fragment =
                {
                   'name': uri
                };
        }
        return fragment;
    };

     PersonalizationServiceFactory.prototype.getFragment = function(){
        return angular.copy(this.modulePesonalization);
    };

    PersonalizationServiceFactory.prototype.getPersonalizedConfiguration = function(configPropName){
        var fragment = this.getFragment(),
            value;
        if(fragment !== null && fragment !== undefined &&
             fragment[configPropName] !== null &&
             fragment[configPropName] !== undefined ){
            value =  fragment[configPropName];
        }
        return value;
    };

    PersonalizationServiceFactory.prototype.setPersonalizedConfiguration = function(configPropName, value){
        var fragment = this.getFragment();
        fragment[configPropName] = value; //update or add
        //push personalization to the database repo via api
        this.save(fragment);
    };

    return PersonalizationServiceFactory;
}]);

