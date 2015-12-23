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
            };

            return new Item();
        }
    ]);
});
