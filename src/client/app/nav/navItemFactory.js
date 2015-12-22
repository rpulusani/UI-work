define([
    'nav'
], function(nav){

    'use strict';

    nav
    .factory('NavItem', ['$location',
        function($location){
            var Item = function(){
                var self = this;
            };

            Item.prototype.init = function(item){
                var self = this;
                self.id = item.id;
                self.action = item.action;
                self.text = item.text;
                self.description = item.description;
                self.icon = item.icon;
                self.target = item.target;
                self.tags = item.tags;
                self.isActive = function(){
                    var currentPath = $location.path();
                    var selfActionLength = self.action.length;
                    if($location.path() === self.action){
                        return true;
                    }else if(currentPath.substring(0, selfActionLength) === self.action && selfActionLength > 1){
                        console.log("self.action length is " + selfActionLength);
                        return true;
                    }
                    
                };
            };

            return new Item();
        }
    ]);
});
