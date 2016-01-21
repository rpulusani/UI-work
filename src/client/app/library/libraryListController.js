define(['angular', 'library'], function(angular) {
    'use strict';
    angular.module('mps.library')
    .controller('LibraryListController', ['$scope', '$location', '$translate', '$route', '$http', 'Documents', 'grid', '$rootScope', 'PersonalizationServiceFactory', 'FilterSearchService',
        function($scope, $location, $translate, $route, $http, Documents, Grid, $rootScope, Personalize, FilterSearchService) {

            var personal = new Personalize($location.url(), $rootScope.idpUser.id);

            $scope.gridOptions = {};
            $scope.gridOptions.onRegisterApi = Grid.getGridActions($rootScope, Documents, personal);

            var filterSearchService = new FilterSearchService(Documents, $scope, $rootScope, personal);

            Documents.getPage().then(function() {
                Grid.display(Documents, $scope, personal, false, function() {
                    $scope.$broadcast('setupColumnPicker', Grid);
                });
            }, function(reason) {
                NREUM.noticeError('Grid Load Failed for ' + Documents.serviceName +  ' reason: ' + reason);
            });

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
