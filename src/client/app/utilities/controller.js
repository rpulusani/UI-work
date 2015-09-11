'use strict';
angular.module('mps.utility')
.controller('confirmCancelController', ['$scope','$location', function($scope, $location){
    $scope.leave = function() {
        $location.path($scope.returnPath);
    };
}])
.controller('fileUploadController', ['$scope', function($scope){
    $scope.upload = function() {
        // ToDo: upload Logic
    };
}]);
