

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
            var options = {
                preventDefaultParams: true,
                url: Translations.url + '/' + translation.subModule.subModuleName + '/' + translation.contentKey
            };
            Translations.item.get(options).then(function(){
                $location.path(Translations.route + '/review');
            });
        };

        $scope.goToImport = function() {
            $location.path(Translations.route + '/import');
        };

        $scope.goToExport = function() {
            $location.path(Translations.route + '/export');
        };

        filterSearchService.addBasicFilter('All Translations', {'sort':'id,DESC'}, undefined,
            function(Grid) {
                setTimeout(function() {
                    $scope.$broadcast('setupPrintAndExport', $scope);
                }, 500);
            }
        );
            
        filterSearchService.addPanelFilter('Category', 'CategoryFilter', undefined,
            function(Grid) {
                setTimeout(function() {
                    $scope.$broadcast('setupColumnPicker', Grid);
                }, 500);
            }
        );
    }
]);

