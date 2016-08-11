'use strict';
angular.module('mps.carrier')
.controller('CarrierAddController', ['$scope', '$location', '$rootScope', 'Carriers', '$q', '$http', 'BlankCheck',
    function($scope, $location, $rootScope, Carriers, $q, $http, BlankCheck) {
        $scope.isUpdate = false;
        if (Carriers.data) {
            $scope.carrier = Carriers.data;
            $scope.isUpdate = true;
        } else {
            $scope.carrier = {};
        }
        $scope.isLoading=false;
        $scope.save = function() {
            $scope.isLoading=true;
            Carriers.data = $scope.carrier;
            $http({
                method: 'POST',
                url: Carriers.dataUrl,
                data: Carriers.data
            }).then(function successCallback(response) {
               $location.path('/carrier');
            }, function errorCallback(response) {
                NREUM.noticeError('Failed to CREATE carrier: ' + response.statusText);
            });
        };

        $scope.update = function() {
            $scope.isLoading=true;
            Carriers.data = $scope.carrier;
            $http({
                method: 'PUT',
                url: Carriers.dataUrl,
                data: Carriers.data
            }).then(function successCallback(response) {
               $location.path('/carrier');
            }, function errorCallback(response) {
                NREUM.noticeError('Failed to CREATE carrier: ' + response.statusText);
            });
        };
    }
]);
