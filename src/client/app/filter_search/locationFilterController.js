
angular.module('mps.filterSearch')
.controller('LocationFilterController', ['$scope', '$translate',
    function($scope, $translate) {
        $scope.showClearMessage = false;
        $scope.locationFilter = function(selectedList){
            if(selectedList && $scope.filterDef && typeof $scope.filterDef === 'function'){
                if (selectedList.length > 0) {
                    $scope.showClearMessage = true;
                    $scope.noOfSelected = selectedList.length;
                } else {
                    $scope.showClearMessage = false;
                }
                var location = selectedList.join('|');
                $scope.params['location'] = location;
                $scope.filterDef($scope.params, ['bookmarkFilter', 'chlFilter', 'requesterFilter', 'source']);
            }
        };

        $scope.clearLocationFilter = function(){
            if($scope.filterDef && typeof $scope.filterDef === 'function'){
                $scope.params = {};
                $scope.$broadcast('deselectAll');
                $scope.noOfSelected = 0;
                $scope.filterDef($scope.params, ['bookmarkFilter', 'chlFilter', 'location', 'requesterFilter', 'source']);
            }
        };

    }
]);
