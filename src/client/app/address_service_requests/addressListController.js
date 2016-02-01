define(['angular', 'address', 'address.factory', 'account', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestAddresses')
    .controller('AddressListController', [
        '$scope',
        '$location',
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

            $scope.addresses = Addresses;

            $scope.goToCreate = function() {
                Addresses.item = {};
                $location.path('/service_requests/addresses/new');
            };

            $scope.selectRow = function(btnType) {
                if (btnType !== 'delete') {
                    Addresses.goToUpdate($scope.gridApi.selection.getSelectedRows()[0]);
                } else {
                    Addresses.goToDelete($scope.gridApi.selection.getSelectedRows()[0]);
                }
            };

            User.getLoggedInUserInfo().then(function(user) {
                if (angular.isArray(User.item._links.accounts)) {
                    User.item._links.accounts = User.item._links.accounts[0];
                }

                User.getAdditional(User.item, Account).then(function() {
                    Account.getAdditional(Account.item, Addresses).then(function() {
                        var grid = new GridService();
                        grid.display(Addresses, $scope, personal, false, function() {
                            $scope.$broadcast('setupPrintAndExport', $scope);
                            $scope.$broadcast('setupColumnPicker', grid);

                            filterSearchService.addBasicFilter('ADDRESS.ALL', undefined, undefined);
                            filterSearchService.addPanelFilter('Filter By Location', 'LocationFilter', undefined);
                        });
                    });
                });
            });
        }
    ]);
});
