define(['angular', 'utility'], function(angular) {
    angular.module('mps.utility')
    .factory('HATEAOSFactory', ['serviceUrl', '$translate','$http', '$q', 'SpringDataRestAdapter',
        function(serviceUrl, $translate, $http, $q, halAdapter) {
            var user = { // mock
                accountId: '1-21AYVOT'
            }

            var HATEAOSFactory = function(serviceDefinition) {
                var self = this;
                self.serviceName = '';
                self.item = null;
                self.data = [];
                self.page = {
                    size : 0,
                    totalElements: 0,
                    totalPages: 0,
                    number: 0
                };
                self.columns = {};
                self.resetServiceMap = false;
                self.url = '';
                // self.params  = {page: 0, size: 20, sort: ''}
                self.params = {};
                self.route = '';
                
                return angular.extend(self, serviceDefinition);
            };

            // abstract this portion to a new service
            HATEAOSFactory.prototype.getApi = function() {
                var self = this,
                deferred = $q.defer();

                if (!self.url || self.resetServiceMap === true) {
                    $http.get(serviceUrl + '/').success(function (data) {
                        var prop,
                        paramArr = [],
                        i = 0;

                        for (prop in data._links) {
                            if (prop === self.serviceName) {
                                self.url = data._links[prop].href.replace(/{.*}/,'');
                                paramArr = data._links[prop].href.replace(/.*{[?]/,'')
                                    .replace('}', '')
                                    .split(',');
                            }
                        }

                        for (i; i < paramArr.length; i += 1) {
                            if (paramArr[i] === 'page') {
                                // default page
                                self.params[paramArr[i]] = 0;
                            } else if (paramArr[i] === 'size') {
                                // default size
                                self.params[paramArr[i]] = 20;
                            } else {
                                // default sort
                                self.params[paramArr[i]] = '';
                            }
                        }

                        deferred.resolve();
                    });
                } else {
                    deferred.resolve();
                }

                return deferred.promise;
            };

            HATEAOSFactory.prototype.get = function(halObj) {
                var self  = this,
                deferred = $q.defer();

                halAdapter.process($http.get(halObj._links.self.href + '?accountId=' + user.accountId)).then(function(processedResponse) {
                    self.item = processedResponse;
                    self.processedResponse = processedResponse;

                    return deferred.resolve();
                });

                return deferred.promise;
            };

            HATEAOSFactory.prototype.save = function(halObj) {
                var self  = this,
                deferred = $q.defer();

                halAdapter.process($http({
                    method: 'post',
                    url: self.url + '?accountId=' + user.accountId,
                    data: halObj
                })).then(function(processedResponse) {
                    self.item = processedResponse;
                    self.processedResponse = processedResponse;

                    return deferred.resolve();
                });

                return deferred.promise;
            };

            HATEAOSFactory.prototype.update = function(halObj) {
                var self  = this,
                deferred = $q.defer();

                halAdapter.process($http({
                    method: 'put',
                    url: halObj._links.self.href + '?accountId=' + user.accountId,
                    data: halObj
                })).then(function(processedResponse) {
                    self.item = processedResponse;
                    self.processedResponse = processedResponse;

                    return deferred.resolve();
                });

                return deferred.promise;
            };

            HATEAOSFactory.prototype.getList = function(page, size) {
                var self  = this,
                deferred = $q.defer();

                self.getApi().then(function() {
                    var url;

                    if (page || page === 0) {
                        self.params.page = page;
                    }

                    if (size) {
                        self.params.size = size;
                    }
                    
                    url = self.url + '?accountId=' + user.accountId 
                     + '&page=' + self.params.page
                     + '&size=' + self.params.size;

                    halAdapter.process($http.get(url)).then(function (processedResponse) {
                        self.data = processedResponse._embeddedItems;
                        self.page = processedResponse.page;
                        self.params.page = self.page.number;
                        self.params.size = self.page.size;
                        self.processedResponse = angular.toJson(processedResponse, true);
                       
                        return deferred.resolve();
                    });
                });

                return deferred.promise;
            };

            return HATEAOSFactory;
    }]);
});
