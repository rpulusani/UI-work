define(['angular', 'address', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestAddresses')
    .controller('AddressListController', ['$scope', '$location', 'grid', 'Addresses', '$rootScope','$q',
        function($scope,  $location,  Grid, Addresses, $rootScope, $q) {
            $rootScope.currentRowList = [];

            /* Actions */
            $scope.goToCreate = function() {
                $location.path('/service_requests/addresses/new');
            };

            $scope.goToUpdate = function() {
                var id = Grid.getCurrentEntityId($scope.currentRowList[0]);
                if(id !== null){
                    $location.path('/service_requests/addresses/' + id + '/update');
                }
            };
            $scope.goToRemove = function(){
                var id = Grid.getCurrentEntityId($scope.currentRowList[0]);
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
            $scope.gridOptions.onRegisterApi = Grid.getGridActions($rootScope, Addresses);
            Addresses.getList().then(function(){
                Grid.display(Addresses, $scope);
            }, function(reason) {
                NREUM.noticeError('Grid Load Failed for ' + Addresses.serviceName +  ' reason: ' + reason);
            });

        }
      ]);
});
