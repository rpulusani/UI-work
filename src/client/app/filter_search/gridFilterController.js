define(['angular', 'filterSearch'], function(angular) {
    'use strict';
    angular.module('mps.filterSearch')
    .controller('GridFilterController', ['$scope', '$translate',
        function($scope, $translate) {
            $scope.currentFilterPanel = undefined;

            $scope.selectedFilter = function(selectedOption){
                if(selectedOption.functionDef){
                    $scope.currentFilterPanel = undefined;
                    selectedOption.functionDef();
                }else{
                    console.log(selectedOption.optionsPanel);
                    switch(selectedOption.optionsPanel){
                        case 'locationFilter':
                            $scope.currentFilterPanel = selectedOption.optionsPanel;
                        break;
                        case 'CHLFilter':
                            $scope.currentFilterPanel = selectedOption.optionsPanel;
                        break;
                        default:
                            $scope.currentFilterPanel = undefined;
                        break;
                    }
                }
            };
            for(var item in $scope.options){
                $scope.options[item].display = $translate.instant($scope.options[item].display);
            }
            if($scope.options.length > 0){
                $scope.filterBy =  $scope.options[0].display;
                $scope.selectedFilter($scope.options[0]);
            }

        }
    ]);
});
