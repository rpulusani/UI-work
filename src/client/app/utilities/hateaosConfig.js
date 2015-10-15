define(['angular', 'utility'], function(angular) {
    'use strict';
    angular.module('mps.utility')
    .factory('HATEAOSConfig', ['serviceUrl', '$http', '$q',
        function(serviceUrl, $http, $q) {
            var HATEAOSConfig = function() {
                var self = this;
                self.resetServiceMap = false;
                self.serviceMap = {};
            };

            HATEAOSConfig.prototype.createParams = function(paramArr) {
                var params = {},
                i = 0;
                // Default param values are defined here
                for (i; i < paramArr.length; i += 1) {
                    if (paramArr[i] === 'page') {
                        params[paramArr[i]] = 0;
                    } else if (paramArr[i] === 'size') {
                        params[paramArr[i]] = 20;
                    } else {
                        params[paramArr[i]] = '';
                    }
                }

                return params;
            };

            HATEAOSConfig.prototype.getApi = function(name) {
                var self = this,
                deferred = $q.defer();

                if (!self.serviceMap[name] || self.resetServiceMap === true) {
                    $http.get(serviceUrl + '/').success(function(hateaosMap) {
                        var prop,
                        paramArr = [];

                        for (prop in hateaosMap._links) {
                            if (!self.serviceMap[prop]) {
                                self.serviceMap[prop] = {};
                            }

                            self.serviceMap[prop].url = hateaosMap._links[prop].href.replace(/{.*}/,'');
                            paramArr = hateaosMap._links[prop].href.replace(/.*{[?]/,'')
                                .replace('}', '')
                                .split(',');

                            self.serviceMap[prop].params = self.createParams(paramArr);
                        }
                        console.log(self.serviceMap);
                        deferred.resolve(self.serviceMap[name]);
                    });
                } else {
                    deferred.resolve(self.serviceMap[name]);
                }

                return deferred.promise;
            };

            return new HATEAOSConfig();
    }]);
});
