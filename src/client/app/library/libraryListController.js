define(['angular', 'library', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.library')
    .controller('LibraryListController', ['$scope', '$location', '$translate', '$route', '$http', 'Documents', 'grid', '$rootScope', 'PersonalizationServiceFactory', 'FormatterService', 'FilterSearchService', 'SecurityHelper',
        function($scope, $location, $translate, $route, $http, Documents, Grid, $rootScope, Personalize, formatter, FilterSearchService, SecurityHelper) {
            $rootScope.currentRowList = [];
            $scope.visibleColumns = [];
console.log($rootScope);
            new SecurityHelper($rootScope).redirectCheck($rootScope.documentLibraryAccess);
            var personal = new Personalize($location.url(), $rootScope.idpUser.id),
            filterSearchService = new FilterSearchService(Documents, $scope, $rootScope, personal, $scope.columnSet, 160);

            $scope.gridOptions.showBookmarkColumn = false;
            var removeParamsList = ['bookmarkFilter', 'category', 'owner', 'tag'];

           filterSearchService.addBasicFilter('DOCUMENT_LIBRARY.DOCUMENT_LISTING.TXT_ALL_DOCS', false, removeParamsList,
                function(Grid) {
                    setTimeout(function() {
                        $scope.$broadcast('setupColumnPicker', Grid);
                    }, 500);
                }
            );
            filterSearchService.addPanelFilter('DOCUMENT_LIBRARY.DOCUMENT_LISTING.TXT_FILTERS', 'LibraryFilter', undefined,
                function(Grid) {
                    setTimeout(function() {
                        $scope.$broadcast('setupColumnPicker', Grid);
                    }, 500);
                }
            );

            if ($rootScope.documentLibraryManageGlobalTagAccess) {
                filterSearchService.addPanelFilter('FILTERS.FILTER_BY_ACCOUNT', 'AccountFilter', undefined,
                    function() {
                        $scope.$broadcast('setupColumnPicker', $scope);
                    }
                );
            }

            $scope.getFileOwner = function(owner) {
                return formatter.getFileOwnerForLibrary(owner, $rootScope.idpUser.email);
            };

            $scope.getFileIcon = function(extension) {
                var icon = 'icon ';

                switch (extension) {
                    case 'pdf':
                        icon += 'icon-mps-pdf_document';
                        break;
                    default:
                        icon += '';
                }

                return icon;
            };

            $scope.getStrategicIcon = function(strategic) {
                var icon = 'icon ';

                if (strategic === true) {
                    icon += 'icon-mps-strategic';
                }

                return icon;
            };

            $scope.getEditDeleteAction = function (owner) {
                var showEditDelete = false;

                if (owner === $rootScope.idpUser.email) {
                    showEditDelete = true;
                } else if ($scope.paAdmin === true) {
                    showEditDelete = true;
                }

                return showEditDelete;
            };

            $scope.goToNew = function() {
                Documents.item = {};
                $location.path(Documents.route + '/new');
            };

            $scope.goToManageTags = function() {
                $location.path(Documents.route + '/tags');
            };

            $scope.goToView = function(documentItem) {
                Documents.setItem(documentItem);

                $location.path(Documents.route + '/' + documentItem.id + '/view');
            };

            $scope.goToUpdate = function(documentItem) {
                Documents.setItem(documentItem);

                $location.path(Documents.route + '/' + documentItem.id + '/update');
            };

            $scope.goToDelete = function(documentItem) {
                Documents.setItem(documentItem);

                $http({
                    method: 'DELETE',
                    url: Documents.item.url
                }).then(function successCallback(response) {
                    $route.reload();
                }, function errorCallback(response) {
                    NREUM.noticeError('Failed to DELETE existing document library file: ' + response.statusText);
                });
            };

        }
    ]);
});
