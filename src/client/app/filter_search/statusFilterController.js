define(['angular', 'filterSearch'], function(angular) {
    'use strict';
    angular.module('mps.filterSearch')
    .controller('StatusFilterController', ['$scope', '$translate',
        function($scope, $translate) {
            $scope.statuses = [
                {type: true, name: $translate.instant('LABEL.ACTIVE')},
                {type: false, name: $translate.instant('LABEL.INACTIVE')}
            ];

            $scope.$watch('status', function(status) {
                if (status) {
                    $scope.params['activeStatus'] = status;
                    $scope.filterDef($scope.params);
                }
            });
        }
    ]);
});