define(['angular', 'filterSearch'], function(angular) {
    'use strict';
    angular.module('mps.filterSearch')
    .controller('GridSearchController', ['$scope', '$routeParams', '$route', '$location',
        function($scope, $routeParams, $route, $location) {
            var paramsList = ['search', 'searchOn'],
            searchParams = $location.search();

            $scope.showSearchMessage = false;
            $scope.searchBy = undefined;
            $scope.searchByValue = searchParams.search;
            $scope.totalItems = 0;

            if (!$scope.searchByValue) {
                $scope.searchByValue = '';
            }

            $scope.$watch('total', function(total) {
                if (total) {
                    $scope.totalItems = total.totalItems()
                }
            });

            $scope.gridSearch = function(){
                if($scope.searchBy === undefined && $scope.columns && $scope.columns.length > 0){
                    $scope.searchByColumn($scope.columns[0]);
                }
                searchParams = $location.search();

                if (searchParams.searchOn && searchParams.search) {
                    $scope.searchByValue = searchParams.search;
                    $scope.searchBy = searchParams.searchOn;
                }

                if($scope.searchBy && typeof $scope.search === 'function' && $scope.searchByValue){
                    $scope.params['search'] = $scope.searchByValue;
                    $scope.params['searchOn'] = $scope.searchBy;
                    $scope.showSearchMessage = true;

                    $scope.search($scope.params, paramsList);
                }else{
                    $scope.clearSearch();
                }
            };

            $scope.searchByColumn = function(selectedOption) {
                $scope.searchBy = selectedOption.searchOn;
            };

            // if($scope.columns && $scope.columns.length > 0){
            //     $scope.searchByColumn($scope.columns[0]);
            // }

            $scope.clearSearch = function(){
                $scope.showSearchMessage = false;
                $scope.searchByValue = '';
                $scope.params = {};
                $scope.search($scope.params, paramsList);
            };
        }
    ]);
});
