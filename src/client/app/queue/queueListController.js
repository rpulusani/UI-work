

angular.module('mps.queue')
.controller('QueueListController', [
    '$scope',
    '$location',
    '$rootScope',
    'grid',
    'PersonalizationServiceFactory',
    'FilterSearchService',
    'TombstoneService',
    function(
        $scope,
        $location,
        $rootScope,
        Grid,
        Personalize,
        FilterSearchService,
        Tombstones) {
        Tombstones.setParamsToNull();
        var personal = new Personalize($location.url(),$rootScope.idpUser.id),
        filterSearchService = new FilterSearchService(Tombstones, $scope, $rootScope, personal, 'defaultSet');
        $scope.gridOptions.showBookmarkColumn = false;
        filterSearchService.addBasicFilter('REQUEST_MGMT.ALL_REQUESTS', {'status':'QUEUED', embed: 'requester,primaryContact'}, {}, function(){
            $scope.$broadcast('setupPrintAndExport', $scope);
        });
    }
]);

