define(['angular', 'utility'], function(angular) {
    'use strict';
    angular.module('mps.utility')
    .controller('confirmCancelController', ['$scope','$location', function($scope, $location){
        $scope.leave = function() {
            $location.path($scope.returnPath);
        };
    }]);
});
