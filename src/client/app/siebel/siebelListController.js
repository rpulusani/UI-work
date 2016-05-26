

angular.module('mps.notifications')
.controller('SiebelListController', [
    '$scope',
    '$location',
    '$rootScope',
    'SiebelValues',
    'SecurityHelper',
    'grid',
    'PersonalizationServiceFactory',
    'FilterSearchService',
    '$http',
    '$route',
    function(
        $scope,
        $location,
        $rootScope,
        SiebelValues,
        SecurityHelper,
        Grid,
        Personalize,
        FilterSearchService,
        $http,
        $route) {
        if(!$rootScope.translationAdminAccess){
            new SecurityHelper($rootScope).confirmPermissionCheck("translationAdminAccess");    
        }
        $rootScope.currentRowList = [];
        SiebelValues.setParamsToNull();
        var personal = new Personalize($location.url(),$rootScope.idpUser.id),
        filterSearchService = new FilterSearchService(SiebelValues, $scope, $rootScope, personal, 'defaultSet');

        $scope.view = function(siebel){
          SiebelValues.setItem(siebel);
            SiebelValues.item.get().then(function(){
                $location.path(SiebelValues.route + '/review');
            });
        };

        $scope.delete = function(siebel) {
            SiebelValues.setItem(siebel);
            $http({
                method: 'DELETE',
                url: SiebelValues.item.url
            }).then(function(response) {
                $route.reload();
            }, function(response) {
                NREUM.noticeError('Failed to DELETE siebel value: ' + response.statusText);
            });
        };

        $scope.goToCreate = function() {
            $location.path('/siebel/new');
        };

        var removeParamsList = ['subModule.subModuleName', 'search', 'searchOn'];
        filterSearchService.addBasicFilter('PORTAL_ADMIN_SECTION.MANAGE_SIEBEL.TXT_ALL_SIEBELS', false, removeParamsList,
             function(Grid) {       
                $scope.$broadcast('setupPrintAndExport', $scope);
        });
        filterSearchService.addPanelFilter('PORTAL_ADMIN_SECTION.MANAGE_SIEBEL.TXT_FILTER_OPTIONS', 'SiebelOptionFilter', undefined,
             function(Grid) {
                 $scope.$broadcast('setupPrintAndExport', $scope);
        });
    }
]);
