define(['angular','translation', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.translation')
    .controller('TranslationListController', [
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
            $route) {
            $rootScope.currentRowList = [];
            Translations.setParamsToNull();
            var personal = new Personalize($location.url(),$rootScope.idpUser.id),
            filterSearchService = new FilterSearchService(Translations, $scope, $rootScope, personal, 'defaultSet');

            $scope.view = function(translation){
              Translations.setItem(translation);
                Translations.item.get().then(function(){
                    $location.path(Translations.route + '/review');
                });
            };

            filterSearchService.addBasicFilter('All Translations', undefined, undefined,
                function(Grid) {}
            );
        }
    ]);
});
