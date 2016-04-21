angular.module('mps.filterSearch')
.controller('GridFilterController', ['$scope', '$translate', '$location',
    function($scope, $translate, $location) {
        var initalFilter = '',
        params = $location.search();

        if ($scope.options) {
            initalFilter = $scope.options[0]
        }

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
        
            if (($scope.options[item].optionsPanel && params.filter)
                && $scope.options[item].optionsPanel.toLowerCase() === params.filter.toLowerCase()) {
                initalFilter = $scope.options[item];
            }
        }
        
        if($scope.options && $scope.options.length > 0){
            $scope.filterBy = initalFilter.display;
            $scope.selectedFilter(initalFilter);
        }
    }
]);
