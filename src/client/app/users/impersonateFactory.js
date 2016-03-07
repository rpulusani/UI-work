
'use strict';
angular.module('mps.user')
.factory('Impersonate', ['$resource', 'serviceUrl', '$http',
    function($resource, serviceUrl, $http) {
        var Impersonate = function(){
            var self = this;
            this.data = null;
            this.dataUrl = serviceUrl + 'auth/impersonate';
        };

        Impersonate.prototype.query = function(email, fn){
            var self = this;

            return $http.get(self.dataUrl + '?principal=' + email).success(function(data){
                self.data = data;

                if(typeof fn === 'function'){
                    return fn(data);
                }
            });
        };

        return new Impersonate();
   }
]);

