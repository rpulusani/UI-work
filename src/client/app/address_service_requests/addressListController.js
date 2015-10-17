define(['angular', 'address', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestAddresses')
    .controller('AddressListController', ['$scope', '$location', 'grid', 'Addresses', '$rootScope','$q',
        'PersonalizationServiceFactory',
        function($scope,  $location,  Grid, Addresses, $rootScope, $q, Personalize) {
            $rootScope.currentRowList = [];
            var personal = new Personalize($location.url(), $rootScope.idpUser.id);
            /* Actions */
            $scope.goToCreate = function() {
                Addresses.item = {};
                $location.path(Addresses.route + '/new');
            };

            $scope.goToUpdate = function() {
                var id = Grid.getCurrentEntityId($scope.currentRowList[0]);
                if(id !== null){
                    $location.path(Addresses.route + '/' + id + '/update');
                }
            };
            $scope.goToRemove = function(){
                var id = Grid.getCurrentEntityId($scope.currentRowList[0]);
                if(id !== null){
                    $location.path(Addresses.route + '/' + id + '/delete');
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
            $scope.gridOptions.onRegisterApi = Grid.getGridActions($rootScope, Addresses, personal);
            Addresses.getPage().then(function(){
                Grid.display(Addresses, $scope, personal);
            }, function(reason) {
                NREUM.noticeError('Grid Load Failed for ' + Addresses.serviceName +  ' reason: ' + reason);
            });
        }
      ]);
});
