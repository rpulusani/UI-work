'use strict';
angular.module('mps.serviceRequestAddresses')
.controller('AddressesController', ['$scope', '$http', '$location', '$routeParams', 'GridService', 'Addresses','$timeout',
    '$rootScope',
    function($scope, $http, $location, $routeParams, GridService, Addresses, $rootScope,$timeout) {
        $scope.continueForm = false;
        $scope.submitForm = false;
        $scope.attachmentIsShown = false;

        if ($routeParams.id) {
            $scope.address = Addresses.get({id: $routeParams.id, accountId: $rootScope.currentAccount});
        } else {
            $scope.address = {accountId: $rootScope.currentAccount};
        }

       /* $scope.addresses = Addresses.query({accountId: $scope.address.accountId}, function() {
            $scope.addresses = $scope.addresses.addresses;
        });*/

        $scope.file_list = ['.csv', '.xls', '.xlsx', '.vsd', '.doc',
                            '.docx', '.ppt', '.pptx', '.pdf', '.zip'].join(',');

        $scope.contact = {};

        $scope.serviceRequest = {
            customerReferenceId: '1-23654-AB',
            costCenter: '',
            addtnlDescription: '',
            requestedEffectiveDate: '',
            hours: 3
        };

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

        $scope.goToReview = function(id) {
            $location.path('/service_requests/addresses/' + id + '/review');
        };

        $scope.goToViewAll = function(id) {
            $location.path('/service_requests/addresses');
        };

        $scope.goToUpdate = function(id) {
            $location.path('/service_requests/addresses/' + id + '/update');
        };

        $scope.removeAddress = function(address) {
            Addresses.remove({id: address.id, accountId: '1-74XV2R'},
                function() {
                    $scope.addresses.splice($scope.addresses.indexOf(address), 1);
                }
            );
        };

         $scope.gridOptions = {};
            GridService.getGridOptions(Addresses, '').then(
                function(options){
                    $scope.gridOptions = options;
                    $rootScope.currentAccount = '1-74XV2R';
                    $scope.pagination = GridService.pagination(Addresses, $rootScope);
                    Addresses.resource($rootScope.currentAccount, 0).then(
                        function(response){
                            $scope.gridOptions.data = Addresses.getList();
                            console.log($scope.pagination.totalItems());
                            console.log($scope.pagination.pageSize());
                            console.log($scope.pagination.totalPages());
                            console.log($scope.pagination.currentPage());
                        }
                    );
                },
                function(reason){
                    alert('failed: ' + reason);
                }
            );
    }
]);
