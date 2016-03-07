
'use strict';
angular.module('mps.utility')
.factory('PageCountSelect', ['$http',
    function($http){
        var Items = function(){
            var self = this;
            this.data = null;
            this.dataUrl = 'app/device_management/data/meter-read-types.json';
        };

        Items.prototype.query = function(fn){
            var self = this;

            return $http.get(self.dataUrl).success(function(data){
                self.data = data;

                if(typeof fn === 'function'){
                    return fn(data);
                }
            });
        };

        return new Items();
    }
]);


