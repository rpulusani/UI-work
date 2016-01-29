define(['angular', 'library', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.library')
    .controller('LibraryListController', ['$scope', '$location', '$translate', '$route', '$http', 'Documents', 'grid', '$rootScope', 'PersonalizationServiceFactory', 'FilterSearchService', 'SecurityHelper',
        function($scope, $location, $translate, $route, $http, Documents, GridService, $rootScope, Personalize, FilterSearchService, SecurityHelper) {
            $rootScope.currentRowList = [];
            $scope.visibleColumns = [];

            new SecurityHelper($rootScope).redirectCheck($rootScope.documentLibraryAccess);
            var personal = new Personalize($location.url(), $rootScope.idpUser.id),
            filterSearchService = new FilterSearchService(Documents, $scope, $rootScope, personal, $scope.columnSet, 140);

            filterSearchService.addBasicFilter('DOCUMENT_LIBRARY.DOCUMENT_LISTING.TXT_ALL_DOCS', false, false,
                function(Grid) {
                    setTimeout(function() {
                        $scope.$broadcast('setupColumnPicker', Grid);
                    }, 500);
                    
                    //$scope.$broadcast('setupPrintAndExport', $scope);

                }
            );

            filterSearchService.addPanelFilter('DOCUMENT_LIBRARY.DOCUMENT_LISTING.TXT_FILTERS', 'libraryFilter', false);

            $scope.goToNew = function() {
                Documents.item = {};
                $location.path(Documents.route + '/new');
            };

            $scope.goToView = function(documentItem) {
                var selfHrefArr = documentItem._links.self.href.split('/');
                var documentId = selfHrefArr.pop();

                documentItem.id = documentId;
                Documents.setItem(documentItem);

                $location.path(Documents.route + '/' + documentItem.id + '/view');
            };

            $scope.goToUpdate = function(documentItem) {
                var selfHrefArr = documentItem._links.self.href.split('/');
                var documentId = selfHrefArr.pop();

                documentItem.id = documentId;
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
