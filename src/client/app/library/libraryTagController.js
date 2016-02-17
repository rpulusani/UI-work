define(['angular', 'library', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.library')
    .controller('LibraryTagController', ['$scope', '$location', '$translate', '$route', '$http', 'Documents', 'Tags', 'grid', '$rootScope', 'PersonalizationServiceFactory', 'FormatterService',
        function($scope, $location, $translate, $route, $http, Documents, Tags, Grid, $rootScope, Personalize, formatter) {

            $scope.isCreating = false;
            $scope.isEditing = false;
            $scope.isDeleting = false;

            $scope.goToStartCreate = function () {
                $scope.isCreating = true;
            };

            $scope.goToCancelCreate = function () {
                $scope.isCreating = false;
            };

            $scope.goToStartEdit = function (tag) {
                Tags.setItem(tag);
                $scope.tagItem = Tags.item;

                $scope.isEditing = true;
            };

            $scope.goToCancelEdit = function () {
                $scope.isEditing = false;
            };

            $scope.goToStartDelete = function (tag) {
                Tags.setItem(tag);
                $scope.tagItem = Tags.item;

                $scope.isDeleting = true;
            };

            $scope.goToCancelDelete = function () {
                $scope.isDeleting = false;
            };

            $scope.goToCancelEditStartDelete = function(tag) {
                $scope.goToCancelEdit();
                $scope.goToStartDelete(tag);
            };

            $scope.tags = [];
            Tags.get().then(function() {

                if (Tags.data) {
                    $scope.tags = Tags.data;
                }
                console.log($scope.tags);
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

            $scope.goToEditTag = function(tag) {

                Tags.setItem(tag);

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

            $scope.goToDeleteTag = function(tag) {

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
