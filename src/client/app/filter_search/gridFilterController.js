angular.module('mps.filterSearch')
.controller('GridFilterController', ['$scope', '$rootScope', '$translate', '$location',
    function($scope, $rootScope, $translate, $location) {
        var initalFilter = $scope.options[0],
        params = $location.search();

        $scope.selectedFilter = function(selectedOption){
            if(selectedOption.optionsPanel){
                $scope.currentFilterPanel = selectedOption.optionsPanel;
                $scope.currentParams = selectedOption.params;
                $scope.currentFunctionDef = selectedOption.functionDef;
            }else{

                $scope.currentFilterPanel = undefined;
                if(selectedOption.functionDef && typeof selectedOption.functionDef === 'function'){
                    selectedOption.functionDef(selectedOption.params);
                }
            }
        };

        for(var item in $scope.options){
            $scope.options[item].display = $translate.instant($scope.options[item].display);
        
            if (($scope.options[item].optionsPanel && $rootScope.searchParamsFromHome 
                && $rootScope.searchParamsFromHome.filterSelectric.doSearch)
                && $scope.options[item].optionsPanel.toLowerCase() === $rootScope.searchParamsFromHome.filterSelectric.filter) {
                initalFilter = $scope.options[item];
                $rootScope.searchParamsFromHome.filterSelectric.doSearch = false;   
            }
        }
        
        if($scope.options && $scope.options.length > 0){
            $scope.filterBy = initalFilter.display;
            $scope.selectedFilter(initalFilter);
        }
    }
]);
