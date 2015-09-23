define(['angular', 'address', 'utility.gridService'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestAddresses')
    .controller('AddressListController', ['$scope', '$location', 'gridService', 'Addresses', '$rootScope',
        function($scope,  $location,  GridService, Addresses, $rootScope) {
            $rootScope.currentAccount = '1-74XV2R';
            $scope.goToCreate = function() {
                $location.path('/service_requests/addresses/new');
            };

         $scope.gridOptions = {};
            GridService.getGridOptions(Addresses, '').then(
                function(options){
                    $scope.gridOptions = options;
                    $scope.pagination = GridService.pagination(Addresses, $rootScope);
                    Addresses.resource($rootScope.currentAccount, 0).then(
                        function(response){
                            $scope.gridOptions.data = Addresses.addFunctions(Addresses.getList());
                        }
                    );
                },
                function(reason){
                     NREUM.noticeError('Grid Load Failed: ' + reason);
                }
            );
      }]);
});
