define(['angular', 'library'], function(angular) {
    'use strict';
    angular.module('mps.library')
    .factory('Tags', ['serviceUrl', '$translate', '$rootScope', 'HATEOASFactory',
        function(serviceUrl, $translate, $rootScope, HATEOASFactory) {
            var Tags = {
                serviceName: 'tags',
                embeddedName: 'tags',
                url: serviceUrl + 'documents/tags',
                route: '/library'
            };

            return new HATEOASFactory(Tags);
        }
    ]);
});
