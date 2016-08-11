angular.module('mps.library')
    .controller('LibraryTagController', ['$scope', '$location', '$translate', '$route', '$http', 'Documents',
        'Tags', 'Translations', 'grid', '$rootScope', 'PersonalizationServiceFactory', 'FormatterService', 'FilterSearchService',
        function($scope, $location, $translate, $route, $http, Documents, Tags, Translations, GridService,
            $rootScope, Personalize, formatter, FilterSearchService) {

        $scope.isCreating = false;
        $scope.isEditing = false;
        $scope.isDeleting = false;
        $scope.gridLoading = true;
        $scope.gridDataCnt = 0;
        var personal = new Personalize($location.url(), $rootScope.idpUser.id);
        filterSearchService = new FilterSearchService(Tags, $scope, $rootScope, personal, $scope.columnSet);
        var Grid = new GridService();
        Tags.setParamsToNull();

        if (Tags.item) {
            $scope.phTagName = Tags.item.name;

            if (Tags.item.createSuccess) {
                $scope.displayCreateSuccess = true;
                Tags.item.createSuccess = false;
            }

            if (Tags.item.modifySuccess) {
                $scope.displayModifySuccess = true;
                Tags.item.modifySuccess = false;
            }

            if (Tags.item.deleteSuccess) {
                $scope.displayDeleteSuccess = true;
                Tags.item.deleteSuccess = false;
            }
        }

        $scope.goToStartCreate = function () {
            $scope.isCreating = true;

            $scope.isEditing = false;
            $scope.isDeleting = false;
            setTimeout(function() {
                $('div.site-content').scrollTop($("form[name='newTag']").offset().top);
            },1000);
        };

        $scope.goToCancelCreate = function () {
            $scope.isCreating = false;
            $scope.tagName = '';

            $scope.isEditing = false;
            $scope.isDeleting = false;
        };

        $scope.goToStartEdit = function (tag) {
            Tags.setItem(tag);
            $scope.selectedEditTag = Tags.item.name;

            $scope.isEditing = true;

            $scope.isCreating = false;
            $scope.isDeleting = false;

            $('div.site-content').scrollTop(0);         
            setTimeout(function() {
                offset = $("form[name='editTag']").offset().top;
                $('div.site-content').scrollTop(offset);
            },10);
        };

        $scope.goToCancelEdit = function () {
            $scope.isEditing = false;

            $scope.isCreating = false;
            $scope.isDeleting = false;
        };

        $scope.goToStartDelete = function (tag) {
            var offset = 0;
            Tags.setItem(tag);
            $scope.selectedTag = Tags.item.name;

            $scope.isDeleting = true;

            $scope.isCreating = false;
            $scope.isEditing = false;

            $('div.site-content').scrollTop(0);         
            setTimeout(function() {
                offset = $("form[name='deleteTag']").offset().top;
                $('div.site-content').scrollTop(offset);
            },10);
        };

        $scope.goToCancelDelete = function () {
            $scope.isDeleting = false;

            $scope.isCreating = false;
            $scope.isEditing = false;
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
            $scope.gridDataCnt = Tags.page.totalElements;
            $scope.gridLoading = false;
            Grid.display(Tags, $scope, personal);
        });
        $scope.isLoading=false;
        $scope.goToCreateTag = function() {
            $scope.isLoading=true;
            Tags.newMessage();
            Tags.addField("name", $scope.tagName);
            Tags.item.postURL = Tags.url;

            $http({
                method: 'POST',
                url: Tags.url,
                data: Tags.item
            }).then(function successCallback(response) {
                Tags.item.createSuccess = true;
                $scope.isLoading=false;
                $route.reload();
            }, function errorCallback(response) {
                $route.reload();
                NREUM.noticeError('Failed to CREATE tag: ' + response.statusText);
            });

            var parsedTagName = Documents.getTranslationKeyFromTag($scope.tagName);

            var tagLocalizations = {'EN': $scope.tagName};

            Translations.newMessage();
            Translations.addField('key', parsedTagName);
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
        };

        $scope.goToEditTag = function() {
            $scope.isLoading=true;
            var origParsedTagName = Documents.getTranslationKeyFromTag(Tags.item.name);
            
            Tags.item.name = $scope.selectedEditTag;

            var tagName = Tags.item.name;
            var parsedTagName = Documents.getTranslationKeyFromTag(Tags.item.name);

            $http({
                method: 'PUT',
                url: Tags.item.url,
                data: Tags.item
            }).then(function successCallback(response) {
                Tags.item.modifySuccess = true;
                $route.reload();
            }, function errorCallback(response) {
                $route.reload();
                NREUM.noticeError('Failed to MODIFY tag: ' + response.statusText);
            });

            // When editing a tag we don't edit the translation, we DELETE and INSERT
            $http({
                method: 'DELETE',
                url: Translations.url + '/' + origParsedTagName
            }).then(function successCallback(response) {
            }, function errorCallback(response) {
                NREUM.noticeError('Failed to DELETE translation: ' + response.statusText);
            });

            var tagLocalizations = {'EN': tagName};

            Translations.newMessage();
            Translations.addField('key', parsedTagName);
            Translations.addField('type', 'DOCUMENT');
            Translations.addField('module', 'DOCUMENT');
            Translations.addField('subModule', 'TAG');
            Translations.addField('actualValue', tagName);
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
        };

        $scope.goToDeleteTag = function() {
            $scope.isLoading=true;
            var parsedTagName = Documents.getTranslationKeyFromTag(Tags.item.name);

            $http({
                method: 'DELETE',
                url: Tags.item.url
            }).then(function successCallback(response) {
                Tags.item.deleteSuccess = true;
                $route.reload();
            }, function errorCallback(response) {
                $route.reload();
                NREUM.noticeError('Failed to DELETE tag: ' + response.statusText);
            });

            $http({
                method: 'DELETE',
                url: Translations.url + '/' + parsedTagName
            }).then(function successCallback(response) {
            }, function errorCallback(response) {
                NREUM.noticeError('Failed to DELETE translation: ' + response.statusText);
            });
        };
    }
]);

