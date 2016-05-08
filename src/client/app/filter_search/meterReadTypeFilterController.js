
angular.module('mps.filterSearch')
.controller('MeterReadTypeFilterController', ['$scope', '$translate',
    function($scope, $translate) {
        $scope.showClearMessage = false;
        $scope.meterReadTypes = [
            {type: 'ALL', name: $translate.instant('LABEL.ALL')},
            {type: 'MANUAL', name: $translate.instant('LABEL.MANUAL')},
            {type: 'AUTOMATIC', name: $translate.instant('LABEL.AUTOMATIC')}
        ];
        $scope.meterReadType = 'MANUAL';
        if ($scope.missing && $scope.missing === 'Y') {
            $scope.params['missingMeterReads'] = true;
        }
        $scope.params['embed'] = 'asset';

        $scope.$watch('meterReadType', function(meterReadType) {
            if (meterReadType) {
                $scope.showClearMessage = true;
                if (meterReadType !== 'ALL') {
                    $scope.params['source'] = meterReadType;
                    $scope.filterDef($scope.params, ['chlFilter', 'location', 'from', 'to']);
                } else {
                    $scope.params = {};
                    $scope.filterDef($scope.params, ['source', 'chlFilter', 'location', 'from', 'to']);
                }
                
            }
        });

        $scope.clearMeterReadTypeFilter = function(){
            if($scope.filterDef && typeof $scope.filterDef === 'function'){
                $scope.meterReadType = '';
                $scope.params = {};
                $scope.filterDef($scope.params, ['source', 'chlFilter', 'location', 'from', 'to']);
            }
        };
    }
]);
