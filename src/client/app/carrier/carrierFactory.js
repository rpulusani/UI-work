define(['angular', 'carrier'], function(angular) {
	'use strict';
	angular.module('mps.carrier')
	.factory('Carriers', ['$resource', 'serviceUrl', '$http',
        function($resource, serviceUrl, $http) {
            var Carriers = function(){
                var self = this;
                this.data = null;
                this.dataUrl = serviceUrl + 'lexmark-administration/carriers';
            };

            Carriers.prototype.query = function(name, fn){
                var self = this;
                if (name !== undefined) {
                    self.dataUrl = self.dataUrl + '/' + name;
                }
                return $http.get(self.dataUrl).success(function(data){
                    self.data = data;

                    if(typeof fn === 'function'){
                        return fn(data);
                    }
                });
            };

            Carriers.prototype.reset = function(){
                var self = this;
                this.data = null;
                this.dataUrl = serviceUrl + 'lexmark-administration/carriers';
            };

            return new Carriers();
       }
    ]);
});