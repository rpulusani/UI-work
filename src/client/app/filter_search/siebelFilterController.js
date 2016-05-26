
angular.module('mps.filterSearch')
.controller('SiebelFilterController', ['$scope', '$translate',
    function($scope, $translate) {
        $scope.showClearMessage = false;
        $scope.options = [
            {type: 'HARDWARE_PAYMENT_TYPE', name: $translate.instant('PORTAL_ADMIN_SECTION.LABEL.HARDWARE_PAYMENT_TYPE')},
            {type: 'ENTITLEMENT_SERVICE_DETAILS', name: $translate.instant('PORTAL_ADMIN_SECTION.LABEL.ENTITLEMENT_SERVICE_DETAILS')},
            {type: 'SERVICE_ACTIVITY_STATUS_DESCRIPTION', name: $translate.instant('PORTAL_ADMIN_SECTION.LABEL.SERVICE_ACTIVITY_STATUS_DESCRIPTION')},
            {type: 'SERVICE_STATUS', name: $translate.instant('PORTAL_ADMIN_SECTION.LABEL.SERVICE_STATUS')}   
        ];

        $scope.$watch('option', function(option) {
            if (option) {
                $scope.showClearMessage = true;
                $scope.params['subModule.subModuleName'] = option;
                $scope.filterDef($scope.params, ['missing']);
            }
        });

        $scope.clearOptionFilter = function(){
            if($scope.filterDef && typeof $scope.filterDef === 'function'){
                $scope.option = '';
                $scope.params = {};
                $scope.filterDef($scope.params, ['subModule.subModuleName', 'missing']);
            }
        };
    }
]);
