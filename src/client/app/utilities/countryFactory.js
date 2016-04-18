angular.module('mps.utility')
.factory('CountryService', ['HATEOASFactory', '$resource', 'serviceUrl', 'halInterceptor', '$q',
    function(HATEOASFactory, $resource, serviceUrl, halInterceptor, $q) {
        'use strict';
        var CountryService = {
            url: serviceUrl + 'countries',
            serviceName: 'countries',
            // the entry in item that relates to a province/state
            state: null,
            stateObj: null,
            province: null,
            // the country select box (not state) has been changed since a value was set
            hasBeenChanged: false,
            setCountryByName: function(countryName) {
                var self = this;

                angular.forEach(self.data, function(country, i) {
                    if (country.name === countryName) {
                        self.hasBeenChanged = true;
                        self.item = country;
                    }
                });
            },
            setCountryByCode: function(countryIsoCode) {
                var self = this;

                angular.forEach(self.data, function(country, i) {
                    if (country.code === countryIsoCode) {
                        self.hasBeenChanged = true;
                        self.item = country;
                    }
                });
            },
            setProvinceByCode: function(provinceCode) {
                var self = this,
                i = 0;1

                for (i; i < self.item.provinces.length; i += 1) {
                    if (self.item.provinces[i].code.toLowerCase() === provinceCode.toLowerCase()) {
                        self.province = self.item.provinces[i].code;
                        self.state = self.province;
                        self.stateObj = self.item.provinces[i];
                    }
                }
            },
            getHAL: function() {
                return $resource(this.url, {}, {
                    'getHAL': { method: 'GET', url: this.url, interceptor: halInterceptor }
                }).getHAL();
            }
        };

        return new HATEOASFactory(CountryService);
    }
]);
