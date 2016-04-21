angular.module('mps.utility')
.factory('CountryService', ['HATEOASFactory', '$resource', 'serviceUrl', 'halInterceptor', '$q',
    function(HATEOASFactory, $resource, serviceUrl, halInterceptor, $q) {
        'use strict';
        var CountryService = {
            url: serviceUrl + 'countries',
            serviceName: 'countries',
            // the entry in item that relates to a province/state
            stateCode: '',
            stateObj: null,
            province: '',
            setCountryByName: function(countryName) {
                var self = this;

                angular.forEach(self.data, function(country, i) {
                    if (country.name === countryName) {
                        self.item = country;
                    }
                });
            },
            setCountryByCode: function(countryIsoCode) {
                var self = this;

                angular.forEach(self.data, function(country, i) {
                    if (country.code === countryIsoCode) {
                        self.item = country;
                    }
                });
            },
            setProvinceByCode: function(provinceCode) {
                var self = this,
                i = 0;

                if (provinceCode) {
                    for (i; i < self.item.provinces.length; i += 1) {
                        if (self.item.provinces[i].code.toLowerCase() === provinceCode.toLowerCase()) {
                            self.province = self.item.provinces[i].code;
                            self.stateCode = self.province;
                            self.stateObj = self.item.provinces[i];
                        }
                    }
                } else {
                    self.province = '';
                    self.stateCode = '';
                    self.stateObj = null;
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
