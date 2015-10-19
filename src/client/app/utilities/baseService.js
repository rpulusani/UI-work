define(['angular', 'utility'], function(angular) {
    'use strict';
    angular.module('mps.utility')
    .factory('baseService', [ 'serviceUrl', '$translate','$http','SpringDataRestAdapter',
        function(serviceUrl, $translate, $http, SpringDataRestAdapter) {
            var BaseService = function init(){
                this.singleItem = {};
                this.list = [];
                this.page = {};
                this.itemsListArray = [{items: 20},{items:40},{items:60},{items:80},{items:100}];
                this.templatedUrl = '';
            };


            BaseService.prototype.getBindingServiceName = function(){
                return this.bindingServiceName;
            };
            BaseService.prototype.setTemplatedParams = function(url){
                if(url.indexOf('{') !== -1){
                    this.paramNames = url.replace(/.*{[?]/,'').replace('}', '').split(',');
                }
            };

            BaseService.prototype.setRequiredParams = function(params){
                this.requiredParams = params;
            };

            BaseService.prototype.getRequiredParams = function(){
                if(this.requiredParams && this.requiredParams.length > 0){
                    return this.requiredParams;
                }else{
                    return [];
                }
            };

            BaseService.prototype.getFullParamsList = function(optionalParams){
                var fullParams = [];
                fullParams = fullParams.concat(this.getRequiredParams());
                fullParams = fullParams.concat(optionalParams);
                return fullParams;
            };

            BaseService.prototype.getItemsPerPage = function(){
                return this.itemsListArray;
            };

            BaseService.prototype.getServiceUrl = function(){
                BaseService.prototype.setServiceUrl(this.templatedUrl);
                return this.resourceUrl;
            };
            BaseService.prototype.setServiceUrl = function(url){
                this.setTemplatedParams(url);
                this.resourceUrl = url.replace(/{.*}/,'');
            };

            //returns a promise
            BaseService.prototype.getCurrent = function(){
                return this.singleItem;
            };
            //returns a promise
            BaseService.prototype.getList = function(){
                return this.list;
            };

            BaseService.prototype.setList = function(mylist){
                this.list = mylist;
            };

            BaseService.prototype.setCurrent = function(item){
                this.singleItem = item;
            };
            BaseService.prototype.getSelfResource = function(id){
                var list = this.getList();
                for(var i = 0; i < list.length; ++i){
                    if(list[i].id === id){
                        var singleAddressResource = list[i]._resources("self");
                        this.setCurrent(singleAddressResource.get());
                        break;
                    }
                }
                return this.getCurrent();
            };
            BaseService.prototype.setSelected = function(urlIdentifier){
                var list = this.getList();

                for(var i = 0; i < list.length; ++i){
                    if(list[i]._links['self']['href'] === urlIdentifier){
                        this.getSelfResource(i);
                    }
                }
            };

            BaseService.prototype.getPage = function(){
                return this.page;
            };

            BaseService.prototype.setPage = function(page){
                this.page = page;
            };

            BaseService.prototype.setParamsList = function(arrayParamNames){
                this.paramNames = arrayParamNames;
            };

            BaseService.prototype.getParamsList = function(){
                return this.paramNames;
            };
            /*
                *params*
                    [
                        {
                            name: 'size',
                            value: '20'
                        }
                    ]
            */
            BaseService.prototype.buildURI = function(params){
                var currentUrl =  angular.copy(this.getServiceUrl());
                if(currentUrl && params && params.length && params.length > 0){
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

            BaseService.prototype.resource = function(params){
                var service  = this;
                var url = service.buildURI(params);

                var httpPromise = $http.get(url).success(function (response) {
                        service.response = angular.toJson(response, true);
                });

                return SpringDataRestAdapter.process(httpPromise).then(function (processedResponse) {
                    service.setList(processedResponse._embeddedItems);
                    service.setPage(processedResponse.page);
                    service.processedResponse = angular.toJson(processedResponse, true);
                });
            };

            return new BaseService();
    }]);
});
