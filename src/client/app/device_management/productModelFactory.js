define(['angular', 'deviceManagement'], function(angular) {
    'use strict';
    angular.module('mps.deviceManagement')
    .factory('ProductModel', ['serviceUrl', '$rootScope', 'HATEOASFactory',
        function(serviceUrl, $rootScope, HATEOASFactory) {
            var ProductModel = {
                serviceName: "search",
                embeddedName: "search",
                url: serviceUrl + 'assets/models/search'
            };

            return new HATEOASFactory(ProductModel);
        }
    ]);
});
