

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

        filterSearchService.addBasicFilter('All Siebel Values', undefined, undefined,
            function(Grid) {
                $scope.$broadcast('setupPrintAndExport', $scope);
            }
        );
    }
]);
