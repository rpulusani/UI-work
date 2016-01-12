define(['angular', 'filterSearch'], function(angular) {
    'use strict';
    angular.module('mps.filterSearch')
    .controller('GridSearchController', ['$scope',
        function($scope) {
            $scope.searchBy = undefined;
            $scope.searchByValue = '';
            var paramsList = ['search', 'searchOn'];
            $scope.gridSearch = function(){
                if($scope.searchBy && typeof $scope.search === 'function' && $scope.searchByValue){
                    if ($scope.source && $scope.source === 'invoices') {
                        var invoiceParamsList = ['accountId','accountLevel'];
                        //invoiceParamsList.push($scope.searchBy);
                        $scope.params[$scope.searchBy] = $scope.searchByValue;
                        //$scope.params['preventDefaultParams'] = true;
                        $scope.search($scope.params, invoiceParamsList);
                    } else {
                        $scope.params['search'] = $scope.searchByValue;
                        $scope.params['searchOn'] = $scope.searchBy;
                        $scope.search($scope.params, paramsList);
                    }
                }else{
                    $scope.clearSearch();
                }
            };
            $scope.searchByColumn = function(selectedOption){
                $scope.searchBy = selectedOption.field;
            };

            if($scope.columns && $scope.columns.length > 0){
                $scope.searchByColumn($scope.columns[0]);
            }

            $scope.clearSearch = function(){
                $scope.searchByValue = '';
                $scope.params = {};
                if ($scope.source && $scope.source === 'invoices') {
                    paramsList = ['accountId','accountLevel',$scope.searchBy];
                }
                $scope.search($scope.params, paramsList);
            };

        }
    ]);
});
