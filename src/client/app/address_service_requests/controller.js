define(['angular', 'address', 'utility.gridService'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestAddresses')
    .controller('AddressesController', ['$scope', '$http', '$location', '$routeParams', 'gridService', 'Addresses',
      '$timeout', '$rootScope', function($scope, $http, $location, $routeParams, GridService, Addresses,
        $rootScope, $timeout) {
            $scope.continueForm = false;
            $scope.submitForm = false;
            $scope.attachmentIsShown = false;
            $rootScope.currentAccount = '1-74XV2R';
            if ($routeParams.id) {
            $scope.address = Addresses.get({id: $routeParams.id, accountId: $rootScope.currentAccount});
            } else {
            $scope.address = {accountId: $rootScope.currentAccount};
            }


            $scope.file_list = ['.csv', '.xls', '.xlsx', '.vsd', '.doc',
                                '.docx', '.ppt', '.pptx', '.pdf', '.zip'].join(',');

            $scope.contact = {};

            $scope.setStoreFrontName = function() {
                $scope.address.storeFrontName =  $scope.address.name;
            };

            $scope.save = function() {
                if ($scope.address.id) {
                    Addresses.update({
                        id: $scope.address.id,
                        accountId: $scope.address.accountId
                    }, $scope.address, $scope.goToViewAll);
                } else {
                    Addresses.save({
                        accountId: $scope.address.accountId
                    }, $scope.address, $scope.goToViewAll);
                }
            };

            $scope.cancel = function() {
                $location.path('/service_requests/addresses');
            };

            $scope['continue'] = function() {
                $scope.continueForm = true;
            };

            $scope.attachmentToggle = function() {
                $scope.attachmentIsShown = !$scope.attachmentIsShown;
            };

            $scope.goToCreate = function() {
                $location.path('/service_requests/addresses/new');
            };

            $scope.goToReview = function(address) {
                $location.path('/service_requests/addresses/' + address.id + '/review');
            };

            $scope.goToViewAll = function(address) {
                $location.path('/service_requests/addresses');
            };

            $scope.goToUpdate = function(address) {
                $location.path('/service_requests/addresses/' + address.id + '/update');
            };

            $scope.goToVerify = function(address) {
               // Addresses.verify($scope.address, function(res) {
                  //  console.log(res);
                    $location.path('/service_requests/addresses/' + address.id + '/verify');
                //});
            };

            $scope.removeAddress = function(address) {
                Addresses.remove($scope.address, function() {
                    $scope.addresses.splice($scope.addresses.indexOf(address), 1);
                });
            };

            $scope.gridOptions = {};
            GridService.getGridOptions(Addresses, '').then(
                function(options){
                    $scope.gridOptions = options;
                    $scope.pagination = GridService.pagination(Addresses, $rootScope);
                    Addresses.resource($rootScope.currentAccount, 0).then(
                        function(response){
                            $scope.gridOptions.data = Addresses.getList();
                        }
                    );
                },
                function(reason){
                    alert('failed: ' + reason);
                }
            );
    }]);
});
