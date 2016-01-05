define([
    'nav'
], function(nav){

    'use strict';

    nav
    .factory('NavItem', ['$location', '$rootScope','SecurityService','$q',
        function($location, $rootScope, SecurityService, $q){
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
                    self.permissionFlag = $rootScope[item.permissionFlag] = false;
                    var security = new SecurityService();
                    $q.all(security.requests).then(function(){
                      self.permissionFlag = $rootScope[item.permissionFlag];
                    });

                    self.isActive = function(){
                        return ($location.path() === self.action);
                    };
            };

            return new Item();
        }
    ]);
});
