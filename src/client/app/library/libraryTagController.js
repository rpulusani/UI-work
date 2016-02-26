define(['angular', 'library', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.library')
    .controller('LibraryTagController', ['$scope', '$location', '$translate', '$route', '$http', 'Documents', 'Tags', 'grid', '$rootScope', 'PersonalizationServiceFactory', 'FormatterService',
        function($scope, $location, $translate, $route, $http, Documents, Tags, GridService, $rootScope, Personalize, formatter) {

            $scope.isCreating = false;
            $scope.isEditing = false;
            $scope.isDeleting = false;

            var personal = new Personalize($location.url(), $rootScope.idpUser.id);
            var Grid = new GridService();

            $scope.goToStartCreate = function () {
                $scope.isCreating = true;
            };

            $scope.goToCancelCreate = function () {
                $scope.isCreating = false;
            };

            $scope.goToStartEdit = function (tag) {
                Tags.setItem(tag);
                $scope.selectedTag = Tags.item.name;

                $scope.isEditing = true;
            };

            $scope.goToCancelEdit = function () {
                $scope.isEditing = false;
            };

            $scope.goToStartDelete = function (tag) {
                Tags.setItem(tag);
                $scope.selectedTag = Tags.item.name;

                $scope.isDeleting = true;
            };

            $scope.goToCancelDelete = function () {
                $scope.isDeleting = false;
            };

            $scope.goToCancelEditStartDelete = function() {
                $scope.goToCancelEdit();
                $scope.goToStartDelete(Tags.item);

            };

            $scope.gridOptions = {};
            $scope.gridOptions.onRegisterApi = Grid.getGridActions($rootScope, Tags, personal);
            $scope.gridOptions.showBookmarkColumn = false;

            Tags.get({
                params: {
                    page: 0,
                    size: 20
                }
            }).then(function() {
                Grid.display(Tags, $scope, personal);
            });


            $scope.goToCreateTag = function() {
                Tags.newMessage();
                Tags.addField("name", $scope.tagName);
                Tags.item.postURL = Tags.url;

                $http({
                    method: 'POST',
                    url: Tags.url,
                    data: Tags.item
                }).then(function successCallback(response) {
                    $route.reload();
                }, function errorCallback(response) {
                    NREUM.noticeError('Failed to CREATE tag: ' + response.statusText);
                });
            };

            $scope.goToEditTag = function() {
                Tags.item.name = $scope.selectedTag;

                $http({
                    method: 'PUT',
                    url: Tags.item.url,
                    data: Tags.item
                }).then(function successCallback(response) {
                    $route.reload();
                }, function errorCallback(response) {
                    NREUM.noticeError('Failed to MODIFY tag: ' + response.statusText);
                });
            };

            $scope.goToDeleteTag = function() {
                $http({
                    method: 'DELETE',
                    url: Tags.item.url
                }).then(function successCallback(response) {
                    $route.reload();
                }, function errorCallback(response) {
                    NREUM.noticeError('Failed to DELETE tag: ' + response.statusText);
                });
            };
        }
    ]);
});
