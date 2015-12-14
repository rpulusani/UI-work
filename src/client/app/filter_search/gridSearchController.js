define(['angular', 'filterSearch'], function(angular) {
    'use strict';
    angular.module('mps.filterSearch')
    .controller('GridSearchController', ['$scope',
        function($scope) {
            $scope.searchBy = undefined;
            $scope.searchByValue = '';
            $scope.gridSearch = function(){
                $scope.params['search'] = $scope.searchByValue;
                if($scope.searchBy && typeof $scope.search === 'function'){
                    $scope.params['searchOn'] = $scope.searchBy;
                    $scope.search($scope.params);
                }
            };
            $scope.searchByColumn = function(selectedOption){
                $scope.searchBy = selectedOption.field;
            };

            if($scope.columns.length > 0){
                $scope.searchByColumn($scope.columns[0]);
            }
        }
    ]);
});
