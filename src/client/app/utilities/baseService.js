define(['angular', 'utility'], function(angular) {
    angular.module('mps.utility')
    .factory('baseService', [ 'serviceUrl', '$translate','$http','SpringDataRestAdapter',
        function(serviceUrl, $translate, $http, SpringDataRestAdapter) {
            var baseService = function init(){
                this.singleItem = {};
                this.list = [];
                this.page = {};
            };

            baseService.prototype.getBindingServiceName = function(){
                return this.bindingServiceName;
            };
            baseService.prototype.setTemplatedParams = function(url){
                if(url.indexOf('{') !== -1){
                    this.paramNames = url.replace(/.*{[?]/,'').replace('}', '').split(',');
                }
            };
            baseService.prototype.getServiceUrl = function(){
                return this.resourceUrl;
            };
            baseService.prototype.setServiceUrl = function(url){
                this.setTemplatedParams(url);
                this.resourceUrl = url.replace(/{.*}/,'');
            };

            baseService.prototype.getCurrent = function(){
                return this.singleItem;
            };

            baseService.prototype.getList = function(){
                return this.list;
            };

            baseService.prototype.setList = function(mylist){
                this.list = mylist;
            };

            baseService.prototype.setCurrent = function(item){
                this.singleItem = item;
            };

            baseService.prototype.getPage = function(){
                return this.page;
            };

            baseService.prototype.setPage = function(page){
                this.page = page;
            };

            baseService.prototype.setParamsList = function(arrayParamNames){
                this.paramNames = arrayParamNames;
            };

            baseService.prototype.getParamsList = function(){
                return this.paramNames;
            };

            /*
                [
                    {
                        name: 'size',
                        value: '20'
                    }
                ]
            */
            baseService.prototype.buildURI = function(params){
                var currentUrl =  angular.copy(this.resourceUrl);
                if(params && params.length && params.length > 0){
                    for(var i = 0; i < params.length; ++i){
                        if(params[i].value && params[i].name){
                            if(currentUrl.indexOf('?') !== -1){
                                currentUrl += '&';
                            }else{
                                currentUrl += '?';
                            }
                            currentUrl += params[i].name + '=' + params[i].value;
                        }
                    }
                }
                return currentUrl;
            };

            baseService.prototype.resource = function(params){
                var service  = this;
                var url = baseService.prototype.buildURI(params);

                var httpPromise = $http.get(url).success(function (response) {
                        service.response = angular.toJson(response, true);
                });

                return SpringDataRestAdapter.process(httpPromise).then(function (processedResponse) {
                    service.setList(processedResponse._embeddedItems);
                    service.setPage(processedResponse.page);
                    service.processedResponse = angular.toJson(processedResponse, true);
                });
            };



            return new baseService();
    }]);
});
