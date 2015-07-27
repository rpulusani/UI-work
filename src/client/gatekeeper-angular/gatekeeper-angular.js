(function (angular) {



    angular.module('gatekeeper', ['ngRoute', 'ngResource'])

    .factory('gatekeeper.TokenInfo', ['$http', '$q', 'gatekeeper.gatekeeper',
        function ($http, $q, gatekeeper) {
            return {
                get: function (options) {
                    var resp = {};
                    resp.$promise = $q(function (resolve, reject) {
                        $http.get(gatekeeper.serviceUri + '/token/info')
                            .success(function (data) {
                                angular.copy(data, resp);
                                resolve(resp);
                            })
                            .error(function (data) {
                                angular.copy(data, resp);
                                reject(resp);
                            });
                    });
                    return resp;
                }
            };
        }
    ])

    .config(['$httpProvider', '$routeProvider',
        function ($httpProvider, $routeProvider) {
            $httpProvider.interceptors.push('gatekeeper.Interceptor');

            $routeProvider.when('/access_token=:accessToken', {
                template: '',
                controller: 'gatekeeper.AccessTokenCtrl'
            });

        }
    ])

    .controller('gatekeeper.AccessTokenCtrl', ['$routeParams', 'gatekeeper.gatekeeper', 'gatekeeper.TokenInfo', '$location',
        function ($routeParams, gatekeeper, TokenInfo, $location) {
            gatekeeper.tokenInfo = TokenInfo.get($routeParams);
            gatekeeper.tokenInfo.$promise.success(function () {
                $location.path('/');
            });
        }
    ])

    .factory('gatekeeper.Interceptor', ['gatekeeper.gatekeeper',
        function (gatekeeper) {
            return {
                request: function (config) {
                    if(gatekeeper.isProtected(config.url)) {
                        if (!config.headers) config.headers = {};
                        config.headers.Authorization = "Bearer " + gatekeeper.accessToken;
                    }
                }
            };
        }
    ])

    .provider('gatekeeper.gatekeeper', function () {
        var gatekeeper;
        return {
            configure: function (options) {
                return new Gatekeeper(
                    options.serviceUri,
                    options.clientId
                );
            },
            $get: function () {
                return gatekeeper;
            }
        };
    });

    function Gatekeeper(serviceUri, clientId) {
        this.serviceUri = serviceUri;
        this.clientId = clientId;
        this.protectedUris = [];
    }
    Gatekeeper.prototype.isProtected = function (uri) {
        //TODO: Compile uri matching to regex?
        if (uri.starsWith(this.serviceUri)) return true;
        for (var protectedUri in this.protectedUris) {
            if (uri.starsWith(protectedUri)) return true;
        }
        return false;
    };



})(window.angular);