'use strict';
angular.module('mps.filterSearch')
.controller('InvitedStatusFilterController', ['$scope', '$translate',
    function($scope, $translate) {
        $scope.showClearMessage = false;
        $scope.invitedStatuses = [
            {type: 'INVITED', name: $translate.instant('LABEL.INVITED')},
            {type: 'REJECTED', name: $translate.instant('LABEL.REJECTED')}
        ];

        $scope.$watch('inviteStatus', function(inviteStatus) {
            if (inviteStatus) {
                $scope.showClearMessage = true;
                $scope.params['invitedStatus'] = inviteStatus;
                $scope.filterDef($scope.params, ['roles']);
            }
        });

        $scope.clearUserStatusFilter = function(){
            if($scope.filterDef && typeof $scope.filterDef === 'function'){
                $scope.inviteStatus = '';
                $scope.params = {};
                $scope.filterDef($scope.params, ['invitedStatus', 'roles']);
            }
        };
    }
]);
