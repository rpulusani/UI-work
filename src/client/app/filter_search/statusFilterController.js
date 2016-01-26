define(['angular', 'filterSearch'], function(angular) {
    'use strict';
    angular.module('mps.filterSearch')
    .controller('StatusFilterController', ['$scope', '$translate',
        function($scope, $translate) {
            $scope.statuses = [
                {type: true, name: $translate.instant('LABEL.ACTIVE')},
                {type: false, name: $translate.instant('LABEL.INACTIVE')}
            ];
            $scope.filterOnStatus = function(selectedOption){
                if(selectedOption && $scope.filterDef && typeof $scope.filterDef === 'function'){
                    console.log('selectedOption', selectedOption);
                    $scope.params['activeStatus'] = selectedOption;
                    $scope.filterDef($scope.params);
                }
            };
        }
    ]);
});