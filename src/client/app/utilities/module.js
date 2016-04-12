angular.module('mps.utility', [])
.factory('CountryService', ['$resource', 'serviceUrl', 'halInterceptor', '$q',
    function($resource, serviceUrl, halInterceptor, $q) {
        var url = serviceUrl + 'countries',
        service = $resource(url, {}, {
            'getHAL': { method: 'GET', url: url, interceptor: halInterceptor }
        });

        service.countries;

        service.getCountries = function() {
            var deferred = $q.defer();

            if (!service.countries) {
                service.getHAL().$promise.then(function(res) {
                    service.countries = res.data._embedded.countries;
                    
                    return deferred.resolve(service.countries);
                });
            } else {
                return deferred.resolve(service.countries);
            }

            return deferred.promise;
        };

        service.getCountryByCode = function(isoCountryCode) {
            var deferred = $q.defer(),
            findByCountryCode = function() {
                 angular.forEach(service.countries, function(country, i) {
                    if (country.code === isoCountryCode) {
                        return deferred.resolve(country);
                    }
                });
             };

            if (service.countries) {
               findByCountryCode();
            } else {
                service.getCountries().then(function() {
                   findByCountryCode();
                });
            }

            return deferred.promise;
        };

        service.getCountryByName = function(countryName) {
            var deferred = $q.defer(),
            findByCountryName = function() {
                 angular.forEach(service.countries, function(country, i) {
                    if (country.name === countryName) {
                        return deferred.resolve(country);
                    }
                });
             };

            if (service.countries) {
               findByCountryName();
            } else {
                service.getCountries().then(function() {
                   findByCountryName();
                });
            }

            return deferred.promise;
        };

        return service;
    }
]);

