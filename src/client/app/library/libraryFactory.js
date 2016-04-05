

angular.module('mps.library')
.factory('Documents', ['serviceUrl', '$translate', '$rootScope', 'FormatterService', 'HATEOASFactory',
    function(serviceUrl, $translate, $rootScope, formatter, HATEOASFactory) {
        var Documents = {
            serviceName: 'documents',
            embeddedName: 'documents',
            columns: 'default',
                springSorting:  true,
            columnDefs: {
                defaultSet: [
                    {name: $translate.instant('DOCUMENT_LIBRARY.DOCUMENT_LISTING.TXT_FILTER_STRATEGIC'), field: 'strategic', width: '30', notSearchable: true,
                        cellTemplate: '<i ng-class="grid.appScope.getStrategicIcon(row.entity.strategic)"></i>'
                    },
                    {name: $translate.instant('DOCUMENT_LIBRARY.DOCUMENT_LISTING.TXT_GRID_FILE'), field: 'name', width: '420',
                        'cellTemplate':'<div>' +
                            '<i ng-class="grid.appScope.getFileIcon(row.entity.ext);"></i> ' +
                            '<a class="text--small" href="#" ng-click="grid.appScope.goToView(row.entity);">{{row.entity.name}} {{grid.appScope.isUnpublished(row.entity)}}</a><br />' +
                                        '<p class="text--small">{{row.entity.description}}</p>' +
                                        '<p class="text--small">' + $translate.instant('DOCUMENT_LIBRARY.COMMON.TXT_TAGGED_AS') + ': ' +
                                            '{{grid.appScope.getTagNames(row.entity.tags)}}</p>' +
                                    '</div>'
                    },
                    {name: $translate.instant('DOCUMENT_LIBRARY.DOCUMENT_LISTING.TXT_GRID_PUBLISHED'), field: 'getPublishedDate()', notSearchable: true, searchOn: 'publishDate' },
                    {name: $translate.instant('DOCUMENT_LIBRARY.DOCUMENT_LISTING.TXT_GRID_OWNER'), field: 'owner', notSearchable: true},
                    {name: $translate.instant('DOCUMENT_LIBRARY.DOCUMENT_LISTING.TXT_GRID_FILE_SIZE'), field: 'getFileSize()', notSearchable: true, searchOn: 'size' },
                    {name: $translate.instant('LABEL.ACTION'), field: '',  width: '220', notSearchable: true,
                        'cellTemplate':'<div ng-show="grid.appScope.getEditAction(row.entity.owner)">' +
                            '<a href="" ng-click="grid.appScope.goToUpdate(row.entity);"><i class="icon-16 icon-psw-edit"></i></a>' +
                                '<a href="" ng-if="grid.appScope.getDeleteAction(row.entity.owner)" library-inline-delete on-confirm-delete="grid.appScope.goToDelete(row.entity);"></div>' +
                            '</a>'
                    }
                ],
                otherReports: [
                        {name: $translate.instant('DOCUMENT_LIBRARY.DOCUMENT_LISTING.TXT_GRID_PUBLISHED'), field: 'getPublishedDate()', width: '120', searchOn: 'publishDate'},
                        {name: $translate.instant('DOCUMENT_LIBRARY.DOCUMENT_LISTING.TXT_FILTER_TAGS'), field: 'tags',
                        'cellTemplate':'<div>' +
                                '{{grid.appScope.getTagNames(row.entity.tags)}}' +
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
                getTranslationKeyFromTag: function(tag) {
                    var parsedTagName = tag.replace(/[^a-zA-Z0-9]+/g, '_').toUpperCase();
                    parsedTagName = 'TAG_' + parsedTagName;
                    return parsedTagName;
                },
                getTranslationValueFromTag: function(tag) {
                    var localized = $translate.instant('DOCUMENT.TAG.' + Documents.getTranslationKeyFromTag(tag));
                    return localized;
                },
            functionArray: [
                {
                    name: 'getFileSize',
                    functionDef: function() {
                        return formatter.getFileSize(this.size);
                    }
                },
                {
                    name: 'getPublishedDate',
                    functionDef: function() {
                        if (this.publishDate === undefined || this.publishDate === null) { return; }

                        var dy = this.publishDate + 'Z';
                        var d = new Date(dy);
                        return formatter.getDisplayDate(d);
                    }
                }
            ]
        };

        return new HATEOASFactory(Documents);
    }
]);

