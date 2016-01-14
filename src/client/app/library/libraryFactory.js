define(['angular', 'library'], function(angular) {
    'use strict';
    angular.module('mps.library')
    .factory('Documents', ['serviceUrl', '$translate', '$rootScope', 'HATEOASFactory',
        function(serviceUrl, $translate, $rootScope, HATEOASFactory) {
            var Documents = {
                serviceName: 'documents',
                embeddedName: 'documents',
                columns: 'defaultSet',
                columnDefs: {
                    defaultSet: [
                        {'name': $translate.instant('DOCUMENT_LIBRARY.FILE'), 'field': 'file',
                         'cellTemplate':'<div>' +
                                            '<a href="#" ng-click="grid.appScope.goToView(row.entity);">{{row.entity.title}}</a>' +
                                        '</div>'
                        },
                        {'name': $translate.instant('DOCUMENT_LIBRARY.PUBLISHED'), 'field': 'published' },
                        {'name': $translate.instant('DOCUMENT_LIBRARY.OWNER'), 'field': 'owner' },
                        {'name': $translate.instant('DOCUMENT_LIBRARY.FILE_SIZE'), 'field': 'fileSize' }
                    ]
                },    
                route: '/library',
                url: 'http://mps-documents-dev-47949683.us-east-1.elb.amazonaws.com' //documents
            };

            return new HATEOASFactory(Documents);
        }
    ]);
});
