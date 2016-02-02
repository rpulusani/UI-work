define(['angular', 'filterSearch'], function(angular) {
    'use strict';
    angular.module('mps.filterSearch')
    .controller('CHLFilterController', ['$scope', '$translate',
        function($scope, $translate) {
            $scope.showClearMessage = false;
            $scope.chlFilter = function(selectedList){
                if(selectedList && $scope.filterDef && typeof $scope.filterDef === 'function'){
                    if (selectedList.length > 0) {
                        $scope.showClearMessage = true;
                        $scope.noOfSelected = selectedList.length;
                    } else {
                        $scope.showClearMessage = false;
                    }
                    var chl = selectedList.join();
                    $scope.params['chlFilter'] = chl;
                    $scope.filterDef($scope.params, ['bookmarkFilter', 'location', 'status', 'from', 'to']);
                }
            };

            $scope.clearCHLFilter = function(){
                if($scope.filterDef && typeof $scope.filterDef === 'function'){
                    $scope.params = {};
                    $scope.$broadcast('deselectAll');
                    $scope.noOfSelected = 0;
                    $scope.filterDef($scope.params, ['bookmarkFilter', 'chlFilter', 'location', 'status', 'from', 'to']);
                }
            };
        }
    ]);
});
