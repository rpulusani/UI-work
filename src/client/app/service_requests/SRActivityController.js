angular.module('mps.serviceRequests')
.controller('SRActivityController', [
    '$scope',
    '$location',
    '$rootScope',
    'ActivityService',
    'grid',
    'PersonalizationServiceFactory',
     function(
        $scope,
        $location,
        $rootScope,
        ActivityService,
        GridService,
        Personalize
      ) {
    	
    	$scope.activityGridOptions = ActivityService;
        $scope.activityGridOptions.data =[]; 
        $scope.activityGridOptions.data.push($scope.items);
        console.log($scope.items);
        var Grid = new GridService();
        var personal = new Personalize($location.url(),$rootScope.idpUser.id);
        $scope.activityGridOptions.showBookmarkColumn = false;
        Grid.setGridOptionsName('activityGridOptions');
        $scope.activityGridOptions.onRegisterAPI = Grid.getGridActions($scope,
        $scope.activityGridOptions, personal);
        Grid.display($scope.activityGridOptions,$scope,personal, 48);
        $scope.activityGridOptions.enableColumnMenus = false;
        
        
     }
]);

