define(['angular', 'utility'], function(angular) {
    angular.module('mps.utility')
    .factory('baseService', [ 'serviceUrl', '$translate','$http','SpringDataRestAdapter',
        function(serviceUrl, $translate, $http, SpringDataRestAdapter) {
            var baseService = function init(){
                this.singleItem = {};
                this.list = [];
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

            baseService.prototype.getCurrent = function(){
                return baseService.singleItem;
            };

            baseService.prototype.getList = function(){
                return baseService.list;
            };

            baseService.prototype.setList = function(mylist){
                this.list = mylist;
            };

            baseService.prototype.setCurrent = function(item){
                this.singleItem = item;
            };



            return new baseService();
    }]);
});
