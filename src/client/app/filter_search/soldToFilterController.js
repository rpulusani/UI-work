define(['angular', 'filterSearch'], function(angular) {
    'use strict';
    angular.module('mps.filterSearch')
    .controller('SoldToFilterController', ['$scope', '$translate', 'SoldToNumbers', 'UserService',
        function($scope, $translate, SoldToNumbers, User) {
            $scope.showClearMessage = false;
            SoldToNumbers.get().then(function() {
                if (SoldToNumbers.item && SoldToNumbers.item._embedded && SoldToNumbers.item._embedded.strings &&
                    SoldToNumbers.item._embedded.strings.length > 0) {
                    var soldTos = SoldToNumbers.item._embedded.strings,
                    i = 0;

                    $scope.soldToList = [];

                    for (i; i < soldTos.length; i += 1) {
                        $scope.soldToList.push({
                            soldTo: soldTos[i]
                        });
                    }
                }
            });

            $scope.$watch('soldToFilter', function(soldToFilter) {
                if (soldToFilter) {
                    $scope.showClearMessage = true;
                    $scope.params['soldToNumber'] = soldToFilter;
                    $scope.filterDef($scope.params, ['fromDate', 'toDate']);
                }
            });

            $scope.clearSoldToFilter = function(){
                if($scope.filterDef && typeof $scope.filterDef === 'function'){
                    $scope.soldToFilter = '';
                    $scope.params = {};
                    $scope.filterDef($scope.params, ['soldToNumber', 'fromDate', 'toDate']);
                }
            };
        }
    ]);
});
