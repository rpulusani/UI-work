

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
                    comments: 'LABEL.COMMON.COMMENTS',
                    attachments: 'Please select the file you wish to import translations from...',
                    attachmentMessage: '* Acceptable file format: .xliff, .xlf'
                },
                show: {
                    referenceId: true,
                    costCenter: true,
                    comments: true,
                    attachements: true
                }
            },
            attachments:{
                maxItems:1
            }
        };

        $scope.importedFileLanguage = '';
        $rootScope.sourcefeature = 'translation';
        
        $rootScope.currentRowList = [];

        Translations.getLocales().then(function(res) {
            $scope.languages = res.data.locales;
        });

        $scope.importLanguage = function(formData) {
            if($scope.files[0] && $scope.files[0].complete) {
                Translations.importFile($scope.importedFileLanguage, $scope.files[0]).then(function(res) {               
                    $location.path(Translations.route + '/');
                });
            }
        };
    }
]);

