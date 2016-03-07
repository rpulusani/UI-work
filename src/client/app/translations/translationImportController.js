
'use strict';
angular.module('mps.translation')
.controller('TranslationImportController', [
    '$scope',
    '$location',
    '$rootScope',
    'Translations',
    function(
        $scope,
        $location,
        $rootScope,
        Translations
    ) {
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
            Translations.importFile($scope.importedFileLanguage, $scope.files[0]).then(function() {
                $location.path(Translations.route + '/');
            });
        };
    }
]);

