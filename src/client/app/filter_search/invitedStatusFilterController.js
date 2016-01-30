define(['angular', 'filterSearch'], function(angular) {
    'use strict';
    angular.module('mps.filterSearch')
    .controller('InvitedStatusFilterController', ['$scope', '$translate',
        function($scope, $translate) {
            $scope.invitedStatuses = [
                {type: 'INVITED', name: $translate.instant('LABEL.INVITED')},
                {type: 'REJECTED', name: $translate.instant('LABEL.REJECTED')}
            ];

            $scope.$watch('inviteStatus', function(inviteStatus) {
                if (inviteStatus) {
                    $scope.params['invitedStatus'] = inviteStatus;
                    $scope.filterDef($scope.params, ['roles']);
                }
            });
        }
    ]);
});