define(['angular', 'library', 'utility.formatters'], function(angular) {
    'use strict';
    angular.module('mps.library')
    .factory('Documents', ['serviceUrl', '$translate', '$rootScope', 'FormatterService', 'HATEOASFactory',
        function(serviceUrl, $translate, $rootScope, formatter, HATEOASFactory) {
            var Documents = {
                serviceName: 'documents',
                embeddedName: 'documents',
                columns: 'defaultSet',
                columnDefs: {
                    defaultSet: [
                        {'name': $translate.instant('DOCUMENT_LIBRARY.DOCUMENT_LISTING.TXT_GRID_FILE'), 'field': 'name',
                         'cellTemplate':'<div>' +
                                            '<a href="#" ng-click="grid.appScope.goToView(row.entity);">{{row.entity.name}}</a><br />' +
                                            '<p>{{row.entity.description}}</p>' + 
                                        '</div>'
                        },
                        {'name': $translate.instant('DOCUMENT_LIBRARY.DOCUMENT_LISTING.TXT_GRID_PUBLISHED'), 'field': 'getPublishedDate()' },
                        {'name': $translate.instant('DOCUMENT_LIBRARY.DOCUMENT_LISTING.TXT_GRID_OWNER'), 'field': 'owner' },
                        {'name': $translate.instant('DOCUMENT_LIBRARY.DOCUMENT_LISTING.TXT_GRID_FILE_SIZE'), 'field': 'getFileSize()' }
                    ]
                },    
                route: '/library',
                url: 'http://mps-documents-dev-47949683.us-east-1.elb.amazonaws.com/documents',
                functionArray: [
                    {
                        name: 'getFileSize',
                        functionDef: function() {
                            return formatter.getFileSize(this.size);
                        }
                    },
                    {
                        name: 'getPublishedDate',
                        functionDef: function(){
                            return formatter.formatDate(this.published);
                        }
                    }
                ]
            };

            return new HATEOASFactory(Documents);
        }
    ]);
});
