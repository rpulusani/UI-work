define(['angular', 'address', 'utility.gridService'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestAddresses')
    .controller('AddressListController', ['$scope', '$location', 'gridService', 'Addresses', '$rootScope','$q',
        function($scope,  $location,  GridService, Addresses, $rootScope, $q) {
            $rootScope.currentAccount = '1-3F2FR9';
            $rootScope.currentRowList = [];


            /* Actions */
            $scope.goToCreate = function() {
                $location.path('/service_requests/addresses/new');
            };

            $scope.goToUpdate = function() {
                var id = GridService.getCurrentEntityId($scope.currentRowList[0]);
                if(id !== null){
                    $location.path('/service_requests/addresses/' + id + '/update');
                }
            };
            $scope.goToRemove = function(){
                var id = GridService.getCurrentEntityId($scope.currentRowList[0]);
                if(id !== null){
                    $location.path('/service_requests/addresses/' + id + '/delete');
                }
            };
            /* grid Check Items   - should prototype*/
            $scope.isSingleSelected = function(){
                 if($scope.currentRowList.length === 1){
                    return true;
                 }else{
                    return false;
                 }
            };

            $scope.isMultipleSelected = function(){
                if($scope.currentRowList.length > 1){
                    return true;
                }else{
                    return false;
                }
            };

            /* grid configuration */
            $scope.gridOptions = {};
            $scope.gridOptions.onRegisterApi = GridService.getGridActions($rootScope, Addresses);
            GridService.getGridOptions(Addresses, '').then(
                function(options){
                    $scope.gridOptions = options;
                    $scope.pagination = GridService.pagination(Addresses, $rootScope);
                    $scope.itemsPerPage = Addresses.getPersonalizedConfiguration('itemsPerPage');
                    var params =[
                        {
                            name: 'size',
                            value: $scope.itemsPerPage
                        },
                        {
                            name: 'page',
                            value: 0
                        }
                    ];

                    Addresses.resource(params).then(
                        function(response){
                            $scope.gridOptions.data = Addresses.getGRIDList();
                        }
                    );
                },
                function(reason){
                     NREUM.noticeError('Grid Load Failed: ' + reason);
                }
            );
        }
      ]);
});
