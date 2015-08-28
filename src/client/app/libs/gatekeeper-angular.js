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
        $cookies.accessToken = Gatekeeper.accessToken = $routeParams.accessToken.split('&')[0];
        Gatekeeper.authenticating = true;
        $http.get(Gatekeeper.serviceUri + '/oauth/token/info')
        .then(function(resp) {
            Gatekeeper.setTokenInfo(resp.data);
            Gatekeeper.setUser(resp.data.resource_owner);
            $location.path($cookies.returnTo || '/');
            delete $cookies.returnTo;
        }, function(err) {
            delete $cookies.accessToken;
            $window.location.href = Gatekeeper.authorizeUri;
        });
    }])

    .factory('gatekeeper.Interceptor', ['Gatekeeper', '$q',
        function(Gatekeeper, $q) {
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
        var defaultPort = {'http': 80, 'https': 443};
        var baseUrl = [$location.protocol(), '://', $location.host()];
        if($location.port() && $location.port() != defaultPort[$location.protocol()]) {
          baseUrl.push(':');
          baseUrl.push($location.port());
        }
        baseUrl.push($browser.baseHref());
        Gatekeeper.authorizeUri = [Gatekeeper.serviceUri, '/oauth/authorize',
                                   '?response_type=token',
                                   '&redirect_uri=', encodeURIComponent(baseUrl.join('')),
                                   '&client_id=', encodeURIComponent(Gatekeeper.clientId)].join('');
        Gatekeeper.accessToken = $cookies.accessToken;
        $timeout(function(){
            if(Gatekeeper.authenticating) return;
            if(!Gatekeeper.accessToken) {
                $cookies.returnTo = $location.path();
                $window.location.href = Gatekeeper.authorizeUri;
            } else if(!Gatekeeper.tokenInfo.token) {
                $cookies.returnTo = $location.path();
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
