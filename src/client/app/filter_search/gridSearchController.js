define(['angular', 'filterSearch'], function(angular) {
    'use strict';
    angular.module('mps.filterSearch')
    .controller('GridSearchController', ['$scope',
        function($scope) {
            $scope.searchBy = undefined;
            //$scope.searchByValue = '';
            $scope.gridSearch = function(){
                $scope.params['search'] = $scope.searchByValue;
                $scope.params['searchOn'] = $scope.searchBy;
                $scope.search($scope.params);
            };
            $scope.searchByColumn = function(selectedOption){
                console.log('searchByColumn ', selectedOption.field);
                $scope.searchBy = selectedOption.field;
            };

            if($scope.columns.length > 0){
                $scope.searchBy =  $scope.columns[0].display;
                $scope.searchByColumn($scope.columns[0]);
            }
        }
    ]);
});
