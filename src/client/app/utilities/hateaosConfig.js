define(['angular', 'utility'], function(angular) {
    'use strict';
    angular.module('mps.utility')
    .factory('HATEAOSConfig', ['serviceUrl', '$http', '$q', '$rootScope',
        function(serviceUrl, $http, $q, $rootScope) {
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
                        params[paramArr[i]] = null;
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
                        
                        deferred.resolve(self.serviceMap[name]);
                    });
                } else {
                    deferred.resolve(self.serviceMap[name]);
                }

                return deferred.promise;
            };

            HATEAOSConfig.prototype.getLoggedInUserInfo = function(loginId, serviceName) {
                var self  = this,
                deferred = $q.defer();

                if (!loginId) {
                    loginId = $rootScope.idpUser.email;
                }

                if (!serviceName) {
                    serviceName = 'users';
                }

                this.getApi(serviceName).then(function(api) {
                    var url = api.url + '/' + loginId;
                    $http.get(url).then(function(processedResponse) {
                        angular.extend($rootScope.currentUser, processedResponse.data);
                        $rootScope.currentUser.deferred.resolve($rootScope.currentUser);

                        if (!$rootScope.currentAccount) {
                            self.updateCurrentAccount($rootScope.currentUser.accounts[0]);
                        }

                        deferred.resolve(api);
                    });
                });

                return deferred.promise;
            };

            HATEAOSConfig.prototype.getCurrentAccount = function(account) {
                var deferred = $q.defer();

                if (!$rootScope.currentAccount || !$rootScope.currentAccount.accountLevel) {
                    this.getLoggedInUserInfo().then(function() {
                        deferred.resolve($rootScope.currentAccount);
                    });
                } else {
                    deferred.resolve($rootScope.currentAccount);
                }

                return deferred.promise;
            };

            HATEAOSConfig.prototype.updateCurrentAccount = function(account) {
                if (account.level) {
                    if (!$rootScope.currentAccount) {
                        $rootScope.currentAccount = {}
                    }

                    $rootScope.currentAccount.accountId = account.accountId,
                    $rootScope.currentAccount.accountLevel = account.level,
                    $rootScope.currentAccount.name = account.name;

                    if (!$rootScope.defaultAccount) {
                        $rootScope.defaultAccount = {
                            accountId: account.accountId,
                            accountLevel: account.level,
                            name: account.name
                        };
                    }
                }
            };

            return new HATEAOSConfig();
    }]);
});
