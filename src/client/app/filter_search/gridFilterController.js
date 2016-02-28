
angular.module('mps.filterSearch')
.controller('GridFilterController', ['$scope', '$translate',
    function($scope, $translate) {
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
        }
        if($scope.options && $scope.options.length > 0){
            $scope.filterBy =  $scope.options[0].display;
            $scope.selectedFilter($scope.options[0]);
        }

    }
]);
