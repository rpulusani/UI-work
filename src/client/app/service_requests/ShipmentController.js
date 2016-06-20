

angular.module('mps.serviceRequests')
.controller('ShipmentController', [
    '$translate',
    '$location',
    'BlankCheck',
    'FormatterService',
    '$rootScope',
    'ShipmentsService',
    '$scope',
    'grid',
    'PersonalizationServiceFactory',
    'FilterSearchService',
    function(
        $translate,
        $location,
        BlankCheck,
        FormatterService,
        $rootScope,
        ShipmentsService,
        $scope,
        GridService,
        Personalize
        ) { 
    	
    	$scope.shipmentGridOptions = ShipmentsService;
        $scope.shipmentGridOptions.data = ($scope.items);
        console.log($scope.items);
        var Grid = new GridService();
        var personal = new Personalize($location.url(),$rootScope.idpUser.id);
        $scope.shipmentGridOptions.showBookmarkColumn = false;
        Grid.setGridOptionsName('shipmentGridOptions');
        $scope.shipmentGridOptions.onRegisterAPI = Grid.getGridActions($scope,
        $scope.shipmentGridOptions, personal);
        Grid.display($scope.shipmentGridOptions,$scope,personal, 48);
        $scope.shipmentGridOptions.enableColumnMenus = false;
        
       
}]);

