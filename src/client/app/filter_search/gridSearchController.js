define(['angular', 'filterSearch'], function(angular) {
    'use strict';
    angular.module('mps.filterSearch')
    .controller('GridSearchController', ['$scope',
        function($scope) {
            $scope.searchBy = undefined;
            $scope.searchByValue = '';
            var paramsList = ['search', 'searchOn'];
            $scope.gridSearch = function(){
                $scope.params['search'] = $scope.searchByValue;
                if($scope.searchBy && typeof $scope.search === 'function' && $scope.searchByValue){
                    $scope.params['searchOn'] = $scope.searchBy;
                    $scope.search($scope.params, paramsList);
                }else{
                    $scope.clearSearch();
                }
            };
            $scope.searchByColumn = function(selectedOption){
                $scope.searchBy = selectedOption.field;
            };

            if($scope.columns.length > 0){
                $scope.searchByColumn($scope.columns[0]);
            }

            $scope.clearSearch = function(){
                $scope.searchByValue = '';
                $scope.params = {};
                $scope.search($scope.params, paramsList);
            };

        }
    ]);
});
