angular.module('mps.serviceRequestAddresses')
.factory('ErrorMsgs', ['$resource', 'serviceUrl', '$http',
    function($resource, serviceUrl, $http) {
        var ErrorMsgs = function(){
            var self = this;
            this.data = null;
            this.dataUrl = '/app/address_service_requests/data/address-cleansing-errors.json';
        };

        ErrorMsgs.prototype.query = function(fn){
            var self = this;
            return $http.get(self.dataUrl).success(function(data){
                self.data = data;

                if(typeof fn === 'function'){
                    return fn(data);
                }
            });
        };

        return new ErrorMsgs();
   }
]);
