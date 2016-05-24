
angular.module('mps.serviceRequestContacts')
.controller('ContactListController', [
'$scope',
'$location',
'grid',
'Contacts',
'$rootScope',
'PersonalizationServiceFactory',
'FilterSearchService',
'SecurityHelper',
'FormatterService',
'SRControllerHelperService',
'ServiceRequestService',
function(
    $scope,
    $location,
    GridService,
    Contacts,
    $rootScope,
    Personalize,
    FilterSearchService,
    SecurityHelper,
    formatter,
    SRHelper,
    ServiceRequest
) {
    var personal = new Personalize($location.url(), $rootScope.idpUser.id),
    filterSearchService = new FilterSearchService(Contacts, $scope, $rootScope, personal);
    if(!$rootScope.addressContactAccess){
        new SecurityHelper($rootScope).confirmPermissionCheck("addressContactAccess");    
    }

    SRHelper.addMethods(Contacts, $scope, $rootScope);
    ServiceRequest.reset();

    $rootScope.currentRowList = [];

    $scope.contacts = Contacts;

    $scope.selectRow = function(btnType) {
        ServiceRequest.newMessage();
        if(btnType === 'delete'){
            Contacts.goToDelete($scope.gridApi.selection.getSelectedRows()[0]);
        }else{
            Contacts.goToUpdate($scope.gridApi.selection.getSelectedRows()[0]);
        }
    };

    $scope.goToCreate = function() {
        Contacts.newMessage();
        Contacts.tempSpace = {};
        $location.path('/service_requests/contacts/new');
    };


    Contacts.alertState = false;
    var removeParamsList = ['location'];
    filterSearchService.addBasicFilter('CONTACT.ALL', undefined, removeParamsList,
        function(Grid) {
            $scope.$broadcast('setupPrintAndExport', $scope);

            setTimeout(function() {
                $scope.$broadcast('setupColumnPicker', Grid);
            }, 500);
        }
    );
    filterSearchService.addPanelFilter('REQUEST_MAN.COMMON.TXT_FILTER_LOCATION', 'LocationFilter', undefined,
        function(Grid) {
            setTimeout(function() {
                $scope.$broadcast('setupColumnPicker', Grid);
            }, 500);
            $scope.$broadcast('setupPrintAndExport', $scope);
        }
    );
}]);
