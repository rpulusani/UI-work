
angular.module('mps.filterSearch')
.controller('StatusFilterController', ['$scope', '$translate',
    function($scope, $translate) {
        $scope.showClearMessage = false;
        $scope.statuses = [
            {type: true, name: $translate.instant('LABEL.ACTIVE')},
            {type: false, name: $translate.instant('LABEL.INACTIVE')}
        ];

        $scope.$watch('status', function(status) {
            if (status) {
                $scope.showClearMessage = true;
                $scope.params['activeStatus'] = status;
                $scope.filterDef($scope.params, ['roles']);
            }
        });

        $scope.clearUserStatusFilter = function(){
            if($scope.filterDef && typeof $scope.filterDef === 'function'){
                $scope.status = '';
                $scope.params = {};
                $scope.filterDef($scope.params, ['activeStatus', 'roles']);
            }
        };
    }
]);
