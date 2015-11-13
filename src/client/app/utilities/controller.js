define(['angular', 'utility'], function(angular) {
    'use strict';
    angular.module('mps.utility')
    .controller('confirmCancelController', ['$scope','$location', function($scope, $location){
        $scope.leave = function() {
            $location.path($scope.returnPath);
        };
        $scope.dismiss = function(){
        };
    }])
    .controller('fileUploadController', ['$scope', function($scope){
        $scope.leave = function() {
            $location.path($scope.returnPath);
        };
    }]);
});
