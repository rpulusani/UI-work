
'use strict';
angular.module('mps.library')
.controller('libraryDeleteInlineController', ['$scope', function($scope) {
    $scope.isDeleting = false;

    $scope.startDelete = function () {
        return $scope.isDeleting = true;
    };

    $scope.cancelDelete = function () {
        return $scope.isDeleting = false;
    };

    return $scope.confirmDelete = function () {
        return $scope.onConfirmDelete();
    };
}]);
