define(['angular', 'filterSearch'], function(angular) {
    'use strict';
    angular.module('mps.filterSearch')
    .controller('LocationFilterController', ['$scope', '$translate',
        function($scope, $translate) {
            $scope.locationFilter = function(selectedList){
                if(selectedList && $scope.filterDef && typeof $scope.filterDef === 'function'){
                    var location = selectedList.join('|');
                    $scope.params['location'] = location;
                    $scope.filterDef($scope.params, ['bookmarkFilter', 'chlFilter']);
                }
            };
        }
    ]);
});
