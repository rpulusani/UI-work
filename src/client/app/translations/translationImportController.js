define(['angular','translation', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.translation')
    .controller('TranslationImportController', [
        '$scope',
        '$location',
        '$rootScope',
        'Translations',
        'grid',
        'PersonalizationServiceFactory',
        'FilterSearchService',
        '$http',
        '$route',
        function(
            $scope,
            $location,
            $rootScope,
            Translations,
            Grid,
            Personalize,
            FilterSearchService,
            $http,
            $route
        ) {
            var personal = new Personalize($location.url(),$rootScope.idpUser.id),
            filterSearchService = new FilterSearchService(Translations, $scope, $rootScope, personal, 'defaultSet');

            $rootScope.currentRowList = [];

            $scope.importedFileLanguage = '';

            Translations.getLocales().then(function(res) {
                $scope.languages = res.data.locales;
                console.log($scope.languages)
            });

            $scope.importLanguage = function(formData) {
                console.log($scope.importedFileLanguage);
            };
        }
    ]);
});
