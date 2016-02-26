define(['angular', 'library'], function(angular) {
    'use strict';
    angular.module('mps.library')
    .factory('Tags', ['serviceUrl', '$translate', '$rootScope', 'HATEOASFactory',
        function(serviceUrl, $translate, $rootScope, HATEOASFactory) {
            var Tags = {
                serviceName: 'tags',
                embeddedName: 'tags',
                columns: 'default',
                columnDefs: {
                    defaultSet: [
                        {name: $translate.instant('DOCUMENT_LIBRARY.DOCUMENT_LISTING.TXT_FILTER_TAGS'), field: 'name',
                            'cellTemplate':'<div>' +
                                '{{row.entity.name}} <span ng-if="grid.appScope.documentLibraryManageGlobalTagAccess">|</span> ' +
                                '<i class="icon-16 icon-psw-edit" ng-if="grid.appScope.documentLibraryManageGlobalTagAccess" ' +
                                'ng-click="grid.appScope.goToStartEdit(row.entity)"></i>' +
                                '<i class="icon-16 icon-psw-delete" ng-if="grid.appScope.documentLibraryManageGlobalTagAccess" ' +
                                'ng-click="grid.appScope.goToStartDelete(row.entity)"></i>' +
                                '</div>'
                        }
                    ]
                },
                url: serviceUrl + 'documents/tags',
                route: '/library'
            };

            return new HATEOASFactory(Tags);
        }
    ]);
});

