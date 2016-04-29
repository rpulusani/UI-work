angular.module('mps.serviceRequestAddresses')
.controller('AddressListController', [
'$scope',
'$location',
'$window',
'grid',
'Addresses',
'$rootScope',
'PersonalizationServiceFactory',
'FilterSearchService',
'SecurityHelper',
'ServiceRequestService',
'SRControllerHelperService',
'$q',
'AccountService',
'UserService',
function(
    $scope,
    $location,
    $window,
    GridService,
    Addresses,
    $rootScope,
    Personalize,
    FilterSearchService,
    SecurityHelper,
    ServiceRequest,
    SRHelper,
    $q,
    Account,
    User
    ) {
    $rootScope.currentRowList = [];
    $scope.visibleColumns = [];

    var personal = new Personalize($location.url(),$rootScope.idpUser.id),
    filterSearchService = new FilterSearchService(Addresses, $scope, $rootScope, personal);

    SRHelper.addMethods(Addresses, $scope, $rootScope);
    ServiceRequest.reset();

    $scope.addresses = Addresses;

    $scope.goToLbs = function(){
        $window.open('https://venus-beta-lbs.lexmark.com/group/lbsportal/mapsrequest');
    };

    $scope.goToCreate = function() {
        ServiceRequest.newMessage();
        Addresses.item = undefined;
        $location.path('/service_requests/addresses/new');
    };

    $scope.selectRow = function(btnType) {
        ServiceRequest.newMessage();
        if (btnType !== 'delete') {
            Addresses.goToUpdate($scope.gridApi.selection.getSelectedRows()[0]);
        } else {
            Addresses.goToDelete($scope.gridApi.selection.getSelectedRows()[0]);
        }
    };

    var removeParamsList = ['location', 'search', 'searchOn'];
    filterSearchService.addBasicFilter('All addresses', {'addressType': 'ACCOUNT'}, removeParamsList,
         function(Grid) {
            setTimeout(function() {
                $scope.$broadcast('setupColumnPicker', Grid);
            }, 500);
            
            $scope.$broadcast('setupPrintAndExport', $scope);
    });
    filterSearchService.addPanelFilter('Filter By Location', 'AddressLocationFilter', {'addressType': 'ACCOUNT'},
         function(Grid) {
             setTimeout(function() {
                $scope.$broadcast('setupColumnPicker', Grid);
            }, 500);

            $scope.$broadcast('setupPrintAndExport', $scope);
        });


}]);
