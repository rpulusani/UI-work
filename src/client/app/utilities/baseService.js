define(['angular', 'utility'], function(angular) {
    angular.module('mps.utility')
    .factory('baseService', [ 'serviceUrl', '$translate','$http','SpringDataRestAdapter',
        function(serviceUrl, $translate, $http, SpringDataRestAdapter) {
            var baseService = function init(){

            };

            baseService.prototype.getBindingServiceName = function(){
                return this.bindingServiceName;
            };
            baseService.prototype.getServiceUrl = function(){
                return baseService.serviceUrl;
            };
            baseService.prototype.setServiceUrl = function(url){
                baseService.serviceUrl = url;
            };

            return new baseService();
    }]);
});
