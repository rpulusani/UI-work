define(['angular', 'utility'], function(angular) {
    'use strict';
    angular.module('mps.utility')
    .factory('HATEAOSConfig', ['serviceUrl', '$http', '$q', '$rootScope',
        function(serviceUrl, $http, $q, $rootScope) {
            var HATEAOSConfig = function() {
                var self = this;
                self.resetServiceMap = false;
                self.serviceMap = {};
                self.mapCallComplete = false;
                self.mapCallInProgress = false;
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

                if (!self.serviceMap[name] || self.resetServiceMap === true 
                    && self.mapCallInProgress === false && self.mapCallComplete === false) {

                    self.mapCallInProgress = true;

                    if (self.mapCallInProgress === true && self.mapCallComplete === false) {
                        $http.get(serviceUrl + '/').success(function(hateaosMap) {
                            var prop,
                            paramArr = [];

                            self.mapCallInProgress = false;
                            self.mapCallComplete = true;

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
                    }
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
                    var url = api.url + '/' + loginId,
                    acctLink; // String for account link needed for initial setup

                    $http.get(url).then(function(processedResponse) {
                        angular.extend($rootScope.currentUser, processedResponse.data);
                        $rootScope.currentUser.deferred.resolve($rootScope.currentUser);

                        if (!$rootScope.currentAccount) {
                            if ($rootScope.currentUser._links.accounts) {
                                if (angular.isArray($rootScope.currentUser._links.accounts)) {
                                    acctLink = $rootScope.currentUser._links.accounts[0].href;
                                } else {
                                    acctLink = $rootScope.currentUser._links.accounts.href;
                                }

                                self.updateCurrentAccount($rootScope.currentUser.accounts[0], acctLink);
                            }

                        }

                        deferred.resolve(api);
                    });
                });

                return deferred.promise;
            };

            HATEAOSConfig.prototype.getCurrentAccount = function(account) {
                var deferred = $q.defer();

                if ((!$rootScope.currentAccount || !$rootScope.currentAccount.accountLevel)) {
                    this.getLoggedInUserInfo().then(function() {
                        deferred.resolve($rootScope.currentAccount);
                    });
                } else {
                    deferred.resolve($rootScope.currentAccount);
                }

                return deferred.promise;
            };

            HATEAOSConfig.prototype.updateCurrentAccount = function(account, accountLink) {
                if (account.level) {
                    if (!$rootScope.currentAccount) {
                        $rootScope.currentAccount = {};
                    }

                    if (!accountLink && account.url) {
                        accountLink = account.url;
                    }

                    $rootScope.currentAccount.accountId = account.accountId;
                    $rootScope.currentAccount.accountLevel = account.level;
                    $rootScope.currentAccount.name = account.name;
                    $rootScope.currentAccount.href = accountLink;
                    $rootScope.currentAccount.refresh = false;
                    $rootScope.currentAccount.isDefault = false;

                    if (!$rootScope.defaultAccount) {
                        $rootScope.defaultAccount = angular.copy($rootScope.currentAccount);
                        $rootScope.defaultAccount.isDefault = true;
                        $rootScope.currentAccount.isDefault = true;
                    }
                }
            };

            return new HATEAOSConfig();
    }]);
});