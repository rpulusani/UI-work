define(['angular', 'utility'], function(angular) {
    'use strict';
    angular.module('mps.utility')
    .controller('confirmCancelController', ['$scope','$location', function($scope, $location){
        $scope.leave = function() {
            if($scope.confirmAction){
                $scope.confirmAction();
            }
            $location.path($scope.returnPath);

        };
        $scope.dismiss = function(){
            if($scope.cancelAction){
                $scope.cancelAction();
            }
        };
    }])
    .controller('fileUploadController', ['$scope', function($scope){
        $scope.leave = function() {
            $location.path($scope.returnPath);
        };
    }]);
});
