angular.module('angular-gatekeeper', ['ngRoute', 'ngCookies', 'gatekeeper.templates', 'ngResource'])

.config(['$httpProvider', '$routeProvider',
  function($httpProvider, $routeProvider) {
    $httpProvider.interceptors.push('gatekeeper.Interceptor');

    $routeProvider.when('/access_token=:accessToken', {
      template: '',
      controller: 'gatekeeper.AccessTokenCtrl'
    });

  }
])

.service('gatekeeper-cookie-compat', ['$cookies',
function($cookies) {
  if(typeof($cookies.remove) === 'function') {
    return $cookies;
  } else {
    return {
      put: function(key, value) {
        $cookies[key] = value;
      },
      get: function(key) {
        return $cookies[key];
      },
      remove: function(key) {
        delete $cookies[key];
      }
    };
  }
}])

.controller('gatekeeper.AccessTokenCtrl',
['$routeParams', 'Gatekeeper', '$location', 'gatekeeper-cookie-compat', '$http', '$window', '$timeout',
function($routeParams, Gatekeeper, $location, $cookies, $http, $window, $timeout) {
  $cookies.put('access-token', Gatekeeper.accessToken = $routeParams.accessToken.split('&')[0]);
  Gatekeeper.authenticating = true;
  $http.get(Gatekeeper.serviceUri + '/oauth/token/info')
  .then(function(resp) {
    $timeout(function() {
      Gatekeeper.login(Gatekeeper._last_login_params, true);
    }, Math.max(0, (resp.data.expires_in_seconds - 300) * 1000)); // Relogin 5m before expiration.
    Gatekeeper.setTokenInfo(resp.data);
    Gatekeeper.setUser(resp.data.resource_owner);
    $location.path($cookies.get('return-to') || '/');
    $cookies.remove('return-to');
  }, function(err) {
    $cookies.remove('access-token');
    Gatekeeper.login(Gatekeeper._last_login_params, true);
  });
}])

.factory('gatekeeper.Interceptor', ['Gatekeeper', '$q', 'gatekeeper-cookie-compat', '$rootScope',
  function(Gatekeeper, $q, $cookies, $rootScope) {
    return {
      request: function(config) {
        if(Gatekeeper.isProtected(config.url)) {
          if(!config.headers) {
            config.headers = {};
          }
          //config.headers.Authorization = 'Bearer ' + Gatekeeper.accessToken;
          if ($cookies.get('impersonateToken')) {
            $rootScope.impersonate = true;
            config.headers.Authorization = $cookies.get('impersonateToken');
          } else {
            config.headers.Authorization = 'Bearer ' + Gatekeeper.accessToken;
          }
        }
        return config;
      }
    };
  }
])

.provider('Gatekeeper', function() {
  var Gatekeeper = {
    serviceUri: null,
    clientId: null,
    tokenInfo: null,
    accessToken: null,
    protectedUris: [],
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
    $get: ['$q', '$window', '$browser', 'gatekeeper-cookie-compat', '$location', '$timeout',
    function($q, $window, $browser, $cookies, $location, $timeout) {
      if(!Gatekeeper.user) {
        Gatekeeper.user = {
          $promise: $q(function(resolve) {
            Gatekeeper.setUser = function(user) {
            Gatekeeper.setUser = function(){};
            resolve(user);
            angular.copy(user, Gatekeeper.user);
            };
          })
        };
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

      if(!Gatekeeper.login) {
        Gatekeeper.login = function(params, force) {
          Gatekeeper._last_login_params = params;
          var defaultPort = {'http': 80, 'https': 443};
          var baseUrl = [$location.protocol(), '://', $location.host()];
          if($location.port() && $location.port() != defaultPort[$location.protocol()]) {
            baseUrl.push(':');
            baseUrl.push($location.port());
          }
          baseUrl.push($browser.baseHref());
          var authorizeUri = [Gatekeeper.serviceUri, '/oauth/authorize',
                                     '?response_type=token',
                                     '&redirect_uri=', encodeURIComponent(baseUrl.join('')),
                                     '&client_id=', encodeURIComponent(Gatekeeper.clientId)];
          for(var k in params) {
            if(k == 'response_type' || k == 'redirect_uri' || k == 'client_id')
              throw('DO NOT PASS ' + k + ' INTO LOGIN!');
            authorizeUri.push('&');
            authorizeUri.push(encodeURIComponent(k));
            authorizeUri.push('=');
            authorizeUri.push(encodeURIComponent(params[k]));
          }
          authorizeUri = authorizeUri.join('');
          Gatekeeper.accessToken = $cookies.get('access-token');
          $timeout(function(){
            if(Gatekeeper.authenticating && !force) return;
            if(!Gatekeeper.accessToken || force) {
              $cookies.put('return-to', $location.path());
              $window.location.href = authorizeUri;
            } else if(!Gatekeeper.tokenInfo.token) {
              $cookies.put('return-to', $location.path());
              $location.path('/access_token='+Gatekeeper.accessToken);
            }
          }, 0);
        };
      }

      if(!Gatekeeper.logout) {
        Gatekeeper.logout = function() {
          $cookies.remove('access-token');
          $window.location.href = Gatekeeper.serviceUri + '/auth/users/sign_out?redirect_uri=' +
                                  encodeURIComponent($window.location.href);
        };
      }

      return Gatekeeper;
    }]
  };
});

angular.module('angular-gatekeeper')
.directive('gatekeeperPrincipalFinder', function() {
  return {
    templateUrl: 'gatekeeper/principal-finder/view.html',
    scope: {
      principal: '@',
      on_select: '&onSelect',
      placeholder: '@',
      types: '='
    },
    controller: ['$scope', '$http', 'Gatekeeper', 'GatekeeperSearch',
    function($scope, $http, Gatekeeper, GatekeeperSearch) {
      $scope.click = function(principal) {
        $scope.model.q = '';
        $scope.$parent[$scope.principal] = principal;
        $scope.on_select(principal);
      };
      $scope.model = {q:''};
      $scope.principals = [];
      $scope.$watch('model.q', function(q, old) {
        if(q !== old) {
          if(q && q.length) {
            GatekeeperSearch(q, $scope.types)
            .then(function(principals) {
              $scope.principals = principals;
            });
          } else {
            $scope.principals = [];
          }
        }
      });
    }]
  };
});

(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('gatekeeper.templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('gatekeeper.templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('gatekeeper/principal-finder/view.html', '<form class=\"form form--search\" data-form=\"\">\n  <div class=\"form__field\">\n    <label for=\"search\" class=\"l-screenreader-only\">Search</label>\n    <i class=\"icon icon--ui icon--search-secondary\"></i>\n    <input type=\"text\" name=\"search\" id=\"search\"\n           placeholder=\"{{placeholder}}\" ng-model=\"model.q\" ng-model-options=\"{debounce: 500}\"></input>\n  </div>\n</form>\n<div class=\"col-1\" ng-if=\"principals.length\">\n  <gatekeeper-principal principal=\"principal\" ng-repeat=\"principal in principals\"\n                        ng-click=\"click(principal)\" type=\"\'card\'\"\n                        style=\"cursor: pointer\"></gatekeeper-principal>\n</div>\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('gatekeeper.templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('gatekeeper.templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('gatekeeper/principal/card.html', '<div class=\"gatekeeper-principal card col-1\" data-card=\"\" ng-if=\"name\">\n <div class=\"card__visual\" ng-if=\"principal.avatar_url\">\n    <img src=\"{{principal.avatar_url}}\" ng-attr-alt=\"{{name}}\">\n  </div>\n  <div class=\"card__content\">\n   <div class=\"card__title\">{{name}}&nbsp;</div>\n   <div class=\"card__sub-title\" ng-if=\"principal.type == \'user\'\">{{principal.email}}</div>\n   <div class=\"card__author\">{{principal.organization.name}}</div>\n </div>\n</div>\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('gatekeeper.templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('gatekeeper.templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('gatekeeper/principal/inline.html', '<span ng-switch=\"principal.type\">\n  <span ng-switch-when=\"user\">\n    {{name}}\n  </span>\n  <span ng-switch-default>\n    {{principal.name}}\n    <span ng-if=\"principal.organization &amp;&amp; principal.organization.id != user_org.id\">\n      ({{principal.organization.name}})\n    </span>\n  </span>\n</span>\n');
    }]);
})();
angular.module('angular-gatekeeper')
.directive('gatekeeperPrincipal', function() {
  return {
    template: '<span ng-include="\'gatekeeper/principal/\'+type+\'.html\'"></span>',
    scope: {
      principal: '=',
      intype: '=type'
    },
    controller: ['$scope', 'Gatekeeper',
    function($scope, Gatekeeper) {
      $scope.type = /card/.test($scope.intype)?'card':'inline';
      $scope.user_org = Gatekeeper.user.organization;
      $scope.$watch('principal', function(principal) {
        if(principal) {
          var attrs = principal.custom_attributes;
          if(principal.name) {
            $scope.name = principal.name;
          } else if(attrs && attrs.display_name) {
            $scope.name = attrs.display_name;
          } else if(attrs && attrs.first_name && attrs.last_name) {
            $scope.name = attrs.first_name + ' ' + attrs.last_name;
          } else if(attrs && attrs.first_name) {
            $scope.name = attrs.first_name;
          } else if(attrs && attrs.last_name) {
            $scope.name = attrs.last_name;
          } else if(principal.email) {
            $scope.name = principal.email;
          }
        }
      });
    }]
  };
});

angular.module('angular-gatekeeper')

.service('GatekeeperUser', ['$resource', 'Gatekeeper',
function($resource, Gatekeeper) {
  return $resource(Gatekeeper.serviceUri + '/users/:id', {id: '@id'},{
    update: { method:'PUT' }
  });
}])

.service('GatekeeperGroup', ['$resource', 'Gatekeeper',
function($resource, Gatekeeper) {
  return $resource(Gatekeeper.serviceUri + '/groups/:id', {id: '@id'},{
    update: { method:'PUT' }
  });
}])

.service('GatekeeperOrganization', ['$resource', 'Gatekeeper',
function($resource, Gatekeeper) {
  return $resource(Gatekeeper.serviceUri + '/organizations/:id', {id: '@id'},{
    update: { method:'PUT' }
  });
}])

.service('GatekeeperApplication', ['$resource', 'Gatekeeper',
function($resource, Gatekeeper) {
  return $resource(Gatekeeper.serviceUri + '/applications/:id', {id: '@id'},{
    update: { method:'PUT' }
  });
}])

.factory('GatekeeperSearch', ['$http', '$q', 'Gatekeeper',
function($http, $q, Gatekeeper) {
  return function(q, types) {
    return $q(function(resolve, reject) {
      var params = {q: q};
      if(types) params['type[]'] = types;
      $http.get(Gatekeeper.serviceUri + '/search', {params: params})
      .then(function(resp) {
        resolve(resp.data);
      }, reject);
    });
  };
}]);


//# sourceMappingURL=angular-gatekeeper.js.map
