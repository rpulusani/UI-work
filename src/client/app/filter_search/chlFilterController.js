define(['angular', 'filterSearch'], function(angular) {
    'use strict';
    angular.module('mps.filterSearch')
    .controller('CHLFilterController', ['$scope', '$translate',
        function($scope, $translate) {
            $scope.chlFilter = function(selectedList){
                if(selectedList && $scope.filterDef && typeof $scope.filterDef === 'function'){
                    var chl = selectedList.join();
                    $scope.params['chlFilter'] = chl;
                    $scope.filterDef($scope.params);
                }
            };
        }
    ]);
});
