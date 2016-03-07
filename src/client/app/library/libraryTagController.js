
'use strict';
angular.module('mps.library')
    .controller('LibraryTagController', ['$scope', '$location', '$translate', '$route', '$http', 'Documents', 'Tags', 'Translations', 'grid', '$rootScope', 'PersonalizationServiceFactory', 'FormatterService',
        function($scope, $location, $translate, $route, $http, Documents, Tags, Translations, GridService, $rootScope, Personalize, formatter) {

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
            }, function errorCallback(response) {
                NREUM.noticeError('Failed to CREATE tag: ' + response.statusText);
            });

                var parsedTagName = $scope.transformTag($scope.tagName);

                var tagLocalizations = {'EN': $scope.tagName};

                Translations.newMessage();
                Translations.addField('key', 'DOCUMENT.' + parsedTagName);
                Translations.addField('type', 'DOCUMENT');
                Translations.addField('module', 'DOCUMENT');
                Translations.addField('subModule', 'TAG');
                Translations.addField('actualValue', $scope.tagName);
                Translations.addField('values', tagLocalizations);
                Translations.item.postURL = Translations.url;

                $http({
                    method: 'POST',
                    url: Translations.url,
                    data: Translations.item
                }).then(function successCallback(response) {
                }, function errorCallback(response) {
                    NREUM.noticeError('Failed to CREATE translation: ' + response.statusText);
                });

                $route.reload();
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

                var opts = {
                    params: {
                        category: 'DOCUMENT',
                        language: 'EN',
                        search: $scope.selectedTag
                    }
                };

                Translations.get(opts).then(function() {
                    if (Translations.data) {
                        for (var i = 0; i < Translations.data.length; i++) {
                            if (Translations.data[i].actualValue === $scope.selectedTag) {
                                Translations.setItem(Translations.data[i]);
                            }
                        }
                    }

                    Translations.item.actualValue = $scope.selectedTag;

                    $http({
                        method: 'PUT',
                        url: Translations.url + '/' + Translations.item.key,
                        data: Translations.item
                    }).then(function successCallback(response) {
                    }, function errorCallback(response) {
                        NREUM.noticeError('Failed to MODIFY translation: ' + response.statusText);
                    });
                });

                $route.reload();

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

            $scope.transformTag = function(input) {
                var parsedTagName = input.replace(/[^a-zA-Z0-9]+/g, '_').toUpperCase();
                return parsedTagName;
        };
    }
]);

