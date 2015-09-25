define(['angular', 'address', 'utility.gridService'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestAddresses')
    .controller('AddressListController', ['$scope', '$location', 'gridService', 'Addresses', '$rootScope',
        function($scope,  $location,  GridService, Addresses, $rootScope) {
            $rootScope.currentAccount = '1-3F2FR9';
            $scope.goToCreate = function() {
                $location.path('/service_requests/addresses/new');
            };




         $scope.gridOptions = {};
         $scope.gridOptions.onRegisterApi = GridService.getGridActions($scope, Addresses);
        GridService.getGridOptions(Addresses, '').then(
            function(options){
                $scope.gridOptions = options;


                $scope.pagination = GridService.pagination(Addresses, $rootScope);
                var params =[
                    {
                        name: 'size',
                        value: '20'
                    },
                    {
                        name: 'accountId',
                        value: $rootScope.currentAccount
                    },
                    {
                        page: 'page',
                        value: 0
                    }
                ];
                Addresses.resource(params).then(
                    function(response){
                        $scope.gridOptions.data = Addresses.getList();
                        var item = Addresses.getSelected(2);
                        console.log(item.name);
                    }
                );
            },
            function(reason){
                 NREUM.noticeError('Grid Load Failed: ' + reason);
            }
        );
      }]);
});
