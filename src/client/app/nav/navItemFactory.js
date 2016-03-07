
'use strict';

angular.module('mps.nav')
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
                self.dropdown = item.dropdown;
                self.dropdownIcon = item.dropdownIcon;
                self.subtext = item.subtext;

                if(item.newWindow){
                    self.window = "_blank";
                }else{
                    self.window = "";
                }
                self.permission = item.permissionFlag;
                self.permissionFlag = $rootScope[item.permissionFlag] = false;
                var security = new SecurityService();
                $q.all(security.requests).then(function(){
                  self.permissionFlag = $rootScope[item.permissionFlag];
                });

        };

        return new Item();
    }
]);
