define(['angular','carrier', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.carrier')
    .controller('CarrierListController', [
        '$scope',
        '$location',
        '$rootScope',
        'Carriers',
        'grid',
        '$http',
        '$route',
        function(
            $scope,
            $location,
            $rootScope,
            Carriers,
            Grid,
            $http,
            $route) {
            Carriers.reset();
            Carriers.query(undefined, function(data) {
                $scope.carriers = data;
            });

            $scope.view = function(carrier){
                Carriers.query(carrier.name, function(data) {
                    Carriers.data = data;
                    $location.path('/carrier/review');
                });
            };

            $scope.delete = function(carrier) {
                Carriers.query(carrier.name, function(data) {
                    Carriers.data = data;
                    var deleteItem = {};
                    deleteItem.carrierName = carrier.name;
                    $http({
                        method: 'DELETE',
                        url: Carriers.dataUrl,
                        data: deleteItem
                    }).then(function(response) {
                        $route.reload();
                    }, function(response) {
                        NREUM.noticeError('Failed to DELETE siebel value: ' + response.statusText);
                    });
                });
            };

            $scope.goToCreate = function() {
                Carriers.reset();
                $location.path('/carrier/new');
            };

            
        }
    ]);
});
