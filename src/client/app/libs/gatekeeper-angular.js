(function() {
    'use strict';

    angular.module('gatekeeper', ['ngRoute', 'ngCookies'])

    .config(['$httpProvider', '$routeProvider',
        function($httpProvider, $routeProvider) {
            $httpProvider.interceptors.push('gatekeeper.Interceptor');

            $routeProvider.when('/access_token=:accessToken', {
                template: '',
                controller: 'gatekeeper.AccessTokenCtrl'
            });

        }
    ])

    .controller('gatekeeper.AccessTokenCtrl', ['$routeParams', 'Gatekeeper', '$location', '$cookies', '$http',
                                               '$window',
    function($routeParams, Gatekeeper, $location, $cookies, $http, $window) {
        $cookies['access-token'] = Gatekeeper.accessToken = $routeParams.accessToken.split('&')[0];
        $http.get(Gatekeeper.serviceUri + '/oauth/token/info')
        .then(function(resp) {
            Gatekeeper.setTokenInfo(resp.data);
            Gatekeeper.setUser(resp.data.resource_owner);
            $location.path($cookies['return-to'] || '/');
            $cookies['return-to'] = null;
        }, function(err) {
            $cookies['access-token'] = null;
            $window.location.href = Gatekeeper.authorizeUri;
        });
    }])

    .factory('gatekeeper.Interceptor', ['Gatekeeper',
        function(Gatekeeper) {
            return {
                request: function(config) {
                    if(Gatekeeper.isProtected(config.url)) {
                        if(!config.headers) config.headers = {};
                        config.headers.Authorization = 'Bearer ' + Gatekeeper.accessToken;
                    }
                    return config;
                }
            };
        }
    ])

    .run(['Gatekeeper', '$http', '$window', '$browser', '$cookies', '$location', '$timeout',
    function(Gatekeeper, $http, $window, $browser, $cookies, $location, $timeout) {
        Gatekeeper.authorizeUri = [Gatekeeper.serviceUri, '/oauth/authorize',
                                   '?response_type=token',
                                   '&redirect_uri=', encodeURIComponent($browser.url()),
                                   '&client_id=', encodeURIComponent(Gatekeeper.clientId)].join('');
        Gatekeeper.accessToken = $cookies['access-token'];
        $timeout(function(){
            if(!Gatekeeper.accessToken) {
                $cookies['return-to'] = $location.path();
                $window.location.href = Gatekeeper.authorizeUri;
            } else if(!Gatekeeper.tokenInfo.token) {
                $cookies['return-to'] = $location.path();
                $location.path('/access_token='+Gatekeeper.accessToken);
            }
        }, 0);

    }])

    .provider('Gatekeeper', function() {
        var Gatekeeper = {
            serviceUri: null,
            clientId: null,
            tokenInfo: null,
            accessToken: null,
            protectedUris: [],
            authorizeUri: null,
            user: null,
            isProtected: function(uri) {
                if (uri.startsWith(Gatekeeper.serviceUri)) return true;
                for (var i in Gatekeeper.protectedUris) {
                    if (uri.startsWith(Gatekeeper.protectedUris[i])) return true;
                }
                return false;
            }
        };
        return {
            configure: function(options) {
                Gatekeeper.serviceUri = options.serviceUri;
                Gatekeeper.clientId = options.clientId;
            },
            protect: function(uri) {
                Gatekeeper.protectedUris.push(uri);
            },
            $get: ['$q', function($q) {
                if(!Gatekeeper.user) {
                    Gatekeeper.user = $q(function(resolve) {
                        Gatekeeper.setUser = function(user) {
                            Gatekeeper.setUser = function(){};
                            resolve(user);
                            angular.copy(user, Gatekeeper.user);
                        };
                    });
                }
                if(!Gatekeeper.tokenInfo) {
                    Gatekeeper.tokenInfo = $q(function(resolve) {
                        Gatekeeper.setTokenInfo = function(tokenInfo) {
                            Gatekeeper.setTokenInfo = function() {};
                            resolve(tokenInfo);
                            angular.copy(tokenInfo, Gatekeeper.tokenInfo);
                        };
                    });
                }
                return Gatekeeper;
            }]
        };
    });
})();
