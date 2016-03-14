

angular.module('mps.utility', [])
.factory('CountryService', ['$resource', 'serviceUrl', 'halInterceptor',
    function($resource, serviceUrl, halInterceptor) {
        var url = serviceUrl + 'countries';
        return $resource(url, {}, {
            'getHAL': { method: 'GET', url: url, interceptor: halInterceptor }
        });
    }
])
.factory('Country', ['serviceUrl', '$q', 'HATEOASFactory',
        function(serviceUrl, $q, HATEOASFactory) {
            var CountryService = {
                serviceName:'countries',
                embeddedName: 'users',
            };

            return new HATEOASFactory(CountryService);
        }
    ])
    .factory('UserPreferences', ['adminUrl', '$q', '$http',
        function(adminUrl, $q, $http) {
            return {
                get: function(){
                    var defer = $q.defer(),
                    url = adminUrl + 'localizations/locales';
                    $http.get(url).then(function(responseData){
                       defer.resolve(responseData.data.locales);
                    });
                    return defer.promise;
                }
            };
        }
    ]);

