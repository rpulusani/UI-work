define(['angular', 'filterSearch'], function(angular) {
    'use strict';
    angular.module('mps.filterSearch')
    .controller('LocationFilterController', ['$scope', '$translate',
        function($scope, $translate) {
            $scope.locationFilter = function(selectedList){
                console.log('selectedList', selectedList);
                console.log('$scope.filterDef', $scope);
                if(selectedList && $scope.filterDef && typeof $scope.filterDef === 'function'){
                    var location = selectedList.join('|');
                    console.log('location', location);
                    $scope.params['location'] = location;
                    $scope.filterDef($scope.params, ['bookmarkFilter', 'chlFilter']);
                }
            };
        }
    ]);
});
