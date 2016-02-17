define(['angular', 'library', 'utility.formatters'], function(angular) {
    'use strict';
    angular.module('mps.library')
    .factory('Documents', ['serviceUrl', '$translate', '$rootScope', 'FormatterService', 'HATEOASFactory',
        function(serviceUrl, $translate, $rootScope, formatter, HATEOASFactory) {
            var Documents = {
                serviceName: 'documents',
                embeddedName: 'documents',
                columns: 'default',
                columnDefs: {
                    defaultSet: [
                        {name: $translate.instant('DOCUMENT_LIBRARY.DOCUMENT_LISTING.TXT_FILTER_STRATEGIC'), field: 'strategic', width: '30', notSearchable: true,
                            cellTemplate: '<i ng-class="grid.appScope.getStrategicIcon(row.entity.strategic)"></i>'
                        },
                        {name: $translate.instant('DOCUMENT_LIBRARY.DOCUMENT_LISTING.TXT_GRID_FILE'), field: 'name', width: '420',
                            'cellTemplate':'<div>' +
                                '<i ng-class="grid.appScope.getFileIcon(row.entity.ext);"></i> ' +
                                '<a class="text--small" href="#" ng-click="grid.appScope.goToView(row.entity);">{{row.entity.name}}</a><br />' +
                                            '<p class="text--small">{{row.entity.description}}</p>' +
                                            '<p class="text--small">' + $translate.instant('DOCUMENT_LIBRARY.COMMON.TXT_TAGGED_AS') + ': ' + 
                                            '<span ng-repeat="tag in row.entity.tags">{{tag}}{{$last ? "" : ", "}}</span></p>' +
                                        '</div>'
                        },
                        {name: $translate.instant('DOCUMENT_LIBRARY.DOCUMENT_LISTING.TXT_GRID_PUBLISHED'), field: 'getPublishedDate()', notSearchable: true }, 
                        {name: $translate.instant('DOCUMENT_LIBRARY.DOCUMENT_LISTING.TXT_GRID_OWNER'), field: 'owner', notSearchable: true,
                            'cellTemplate':'<div ng-bind-html="grid.appScope.getFileOwner(row.entity.owner)"></div>'
                        },
                        {name: $translate.instant('DOCUMENT_LIBRARY.DOCUMENT_LISTING.TXT_GRID_FILE_SIZE'), field: 'getFileSize()' , notSearchable: true },
                        {name: $translate.instant('LABEL.ACTION'), field: '',  width: '220', notSearchable: true,
                            'cellTemplate':'<div ng-show="grid.appScope.getEditAction(row.entity.owner)">' +
                                '<i class="icon icon-psw-edit" ng-click="grid.appScope.goToUpdate(row.entity);"></i>' +
                                '<div ng-if="documentLibraryDeleteMyAccess" library-inline-delete on-confirm-delete="grid.appScope.goToDelete(row.entity);"></div>' +
                                '</div>'
                        }
                    ],
                    otherReports: [
                        {name: $translate.instant('DOCUMENT_LIBRARY.DOCUMENT_LISTING.TXT_GRID_PUBLISHED'), field: 'getPublishedDate()', width: '120'},
                        {name: $translate.instant('DOCUMENT_LIBRARY.DOCUMENT_LISTING.TXT_FILTER_TAGS'), field: 'tagNames',
                            'cellTemplate':'<div>' +
                                '<span ng-repeat="tag in row.entity.tagNames">{{tag}}{{$last ? "" : ", "}}</span>' +
                                '</div>'
                        },
                        {name: $translate.instant('DOCUMENT_LIBRARY.DOCUMENT_LISTING.TXT_GRID_FILE'), field: name,
                            'cellTemplate':'<div>' +
                                '<a class="text--small" href="#" ng-click="grid.appScope.goToDocumentView(row.entity);">{{row.entity.name}}</a>' +
                                '</div>'
                        },
                    ]
                },
                route: '/library',
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
                            return formatter.formatDate(this.publishDate);
                        }
                    }
                ]
            };

            return new HATEOASFactory(Documents);
        }
    ]);
});
