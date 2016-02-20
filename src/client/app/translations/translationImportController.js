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
            
            $scope.configure = {
                detail: {
                    translate: {
                        comments: 'LABEL.COMMENTS',
                        attachments: 'Please select the file you wish to import translations from...',
                        attachmentMessage: '* Acceptable file format: .xliff'
                    },
                    show: {
                        referenceId: true,
                        costCenter: true,
                        comments: true,
                        attachements: true
                    }
                }
            };
            $scope.importedFileLanguage = '';
            
            $rootScope.currentRowList = [];


            Translations.getLocales().then(function(res) {
                $scope.languages = res.data.locales;
            });

            $scope.importLanguage = function(formData) {
                console.log($scope);
                console.log(formData);

                Translations.importFile($scope.importedFileLanguage, $scope.files[0]).then(function() {
                    $location.path(Translations.route + '/');
                });
            };
        }
    ]);
});
