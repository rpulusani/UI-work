define(['angular', 'library', 'utility.formatters'], function(angular) {
    'use strict';
    angular.module('mps.library')
    .factory('Documents', ['serviceUrl', 'libraryServiceUrl', '$translate', '$rootScope', 'FormatterService', 'HATEOASFactory',
        function(serviceUrl, libraryServiceUrl, $translate, $rootScope, formatter, HATEOASFactory) {
            var Documents = {
                serviceName: 'documents',
                embeddedName: 'documents',
                columns: 'default',
                columnDefs: {
                    defaultSet: [
                        {'name': $translate.instant('DOCUMENT_LIBRARY.DOCUMENT_LISTING.TXT_FILTER_STRATEGIC'), 'field': 'strategic', 'width':'30',
                            'headerCellClass': 'no-border', 'enableSorting': false, 'enableColumnMenu': false, 'exporterSuppressExport': true,
                            'notSearchable': true, 'cellTemplate': '<i ng-class="grid.appScope.getStrategicIcon(row.entity.strategic)"></i>'
                        },
                        {'name': $translate.instant('DOCUMENT_LIBRARY.DOCUMENT_LISTING.TXT_GRID_FILE'), 'field': 'name',
                            'cellTemplate':'<div>' +
                                '<i ng-class="grid.appScope.getFileIcon(row.entity.ext);"></i> ' +
                                '<a class="text--small" href="#" ng-click="grid.appScope.goToView(row.entity);">{{row.entity.name}}</a><br />' +
                                            '<p class="text--small">{{row.entity.description}}</p>' +
                                            '<p class="text--small">' + $translate.instant('DOCUMENT_LIBRARY.COMMON.TXT_TAGGED_AS') + ': ' + 
                                            '<span ng-repeat="tag in row.entity.tagNames">{{tag}}{{$last ? "" : ", "}}</span></p>' +
                                        '</div>'
                        },
                        {'name': $translate.instant('DOCUMENT_LIBRARY.DOCUMENT_LISTING.TXT_GRID_PUBLISHED'), 'field': 'getPublishedDate()' },
                        {'name': $translate.instant('DOCUMENT_LIBRARY.DOCUMENT_LISTING.TXT_GRID_OWNER'), 'field': 'owner',
                            'cellTemplate':'<div ng-bind-html="grid.appScope.getFileOwner(row.entity.owner)"></div>'
                        },
                        {'name': $translate.instant('DOCUMENT_LIBRARY.DOCUMENT_LISTING.TXT_GRID_FILE_SIZE'), 'field': 'getFileSize()' },
                        {'name': $translate.instant('LABEL.ACTION'), 'field': 'owner', 'width':'60', 'headerCellClass': 'no-border',
                            'enableSorting': false, 'enableColumnMenu': false, 'exporterSuppressExport': true, 'notSearchable': true,
                            'cellTemplate':'<div ng-show="grid.appScope.getEditDeleteAction(row.entity.owner)">' +
                            '<i class="icon icon-psw-edit" ng-click="grid.appScope.goToUpdate(row.entity);"></i> | ' +
                            '<i class="icon icon-psw-error" name="cancel" ng-click="grid.appScope.goToDelete(row.entity);"></i></div>'
                        }
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
                            return formatter.formatDate(this.publishDate);
                        }
                    }
                ]
            };

            return new HATEOASFactory(Documents);
        }
    ]);
});
