

angular.module('mps.serviceRequests')
.controller('ShipmentController', [
    '$translate',
    '$location',
    'BlankCheck',
    'FormatterService',
    '$rootScope',
    '$scope',
    'grid',
    'PersonalizationServiceFactory',
    'HATEOASFactory',
    function(
        $translate,
        $location,
        BlankCheck,
        FormatterService,
        $rootScope,
        $scope,
        GridService,
        Personalize,
        HATEOASFactory
        ) { 
    	
    	var Shipments = {
       		 serviceName: 'shipmentDetails',
       		 embeddedName: 'shipments', //get away from embedded name and move to a function to convert url name to javascript name
               columns: 'defaultSet',
               hideBookmark: true,
               columnDefs: {
                   defaultSet: [
                       {'name': 'Part Number', 'field': 'partNumber'},
                       {'name': 'Description', 'field': 'description'},
                       {'name': 'Part Type', 'field': 'type'},
                       {'name':'Quantity', 'field':'requestedQuantity'}                   
                       
                   ],             
               
             }
       }; 

   
    	
    	
    	$scope.shipmentGridOptions = new HATEOASFactory(Shipments);
        $scope.shipmentGridOptions.data = ($scope.items);
        var Grid = new GridService();
        var personal = new Personalize($location.url(),$rootScope.idpUser.id);
        $scope.shipmentGridOptions.showBookmarkColumn = false;
        Grid.setGridOptionsName('shipmentGridOptions');
        $scope.shipmentGridOptions.onRegisterAPI = Grid.getGridActions($scope,
        $scope.shipmentGridOptions, personal);
        Grid.display($scope.shipmentGridOptions,$scope,personal, 48);
        $scope.shipmentGridOptions.enableColumnMenus = false;
        
       
}]);

