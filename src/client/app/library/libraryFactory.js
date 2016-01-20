define(['angular', 'library', 'utility.formatters'], function(angular) {
    'use strict';
    angular.module('mps.library')
    .factory('Documents', ['serviceUrl', 'libraryServiceUrl', '$translate', '$rootScope', 'FormatterService', 'HATEOASFactory',
        function(serviceUrl, libraryServiceUrl, $translate, $rootScope, formatter, HATEOASFactory) {
            var Documents = {
                serviceName: 'documents',
                embeddedName: 'documents',
                columns: 'defaultSet',
                columnDefs: {
                    defaultSet: [
                        {'name': $translate.instant('DOCUMENT_LIBRARY.DOCUMENT_LISTING.TXT_GRID_FILE'), 'field': 'name',
                         'cellTemplate':'<div>' +
                                            '<a href="#" ng-click="grid.appScope.goToView(row.entity);">' +
                                            '{{row.entity.strategic === false ? "' + $translate.instant('DOCUMENT_LIBRARY.DOCUMENT_LISTING.TXT_FILTER_STRATEGIC') + '"' +
                                            ' : "' + $translate.instant('DOCUMENT_LIBRARY.DOCUMENT_LISTING.TXT_FILTER_NON_STRATEGIC') + '"}} - {{row.entity.name}}</a><br />' +
                                            '<p>{{row.entity.description}}</p>' +
                                            '<p>' + $translate.instant('DOCUMENT_LIBRARY.DOCUMENT_LISTING.TXT_TAGGED_AS') + ' {{row.entity.tagNames}}</p>' +
                                        '</div>'
                        },
                        {'name': $translate.instant('DOCUMENT_LIBRARY.DOCUMENT_LISTING.TXT_GRID_PUBLISHED'), 'field': 'getPublishedDate()' },
                        {'name': $translate.instant('DOCUMENT_LIBRARY.DOCUMENT_LISTING.TXT_GRID_OWNER'), 'field': 'owner' },
                        {'name': $translate.instant('DOCUMENT_LIBRARY.DOCUMENT_LISTING.TXT_GRID_FILE_SIZE'), 'field': 'getFileSize()' },
                        {'name': 'Action', 'field': 'name',
                         'cellTemplate':'<div>' +
                                            '<i class="icon icon--lxk-ui icon--settings" ng-click="grid.appScope.goToUpdate(row.entity);">Edit</i> | ' +
                                            '<i class="icon icon--lxk-ui icon--cancel" ng-click="grid.appScope.goToDelete(row.entity);">Trash</i>' +
                                        '</div>' }
                    ]
                },    
                route: '/library',
                url: libraryServiceUrl,
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
