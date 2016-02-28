
angular.module('mps.filterSearch')
.controller('CategoryFilterController', ['$scope', '$translate',
    function($scope, $translate) {
        $scope.showClearMessage = false;
        $scope.categories = [
            {type: 'SIEBEL', name: 'SIEBEL'},
            {type: 'NOTIFICATION', name: 'NOTIFICATION'},
            {type: 'PORTAL_UI', name: 'PORTAL UI'}
        ];

        $scope.$watch('category', function(category) {
            if (category) {
                $scope.showClearMessage = true;
                $scope.params['category'] = category;
                $scope.filterDef($scope.params, ['missing']);
            }
        });

        $scope.clearCategoryFilter = function(){
            if($scope.filterDef && typeof $scope.filterDef === 'function'){
                $scope.category = '';
                $scope.params = {};
                $scope.filterDef($scope.params, ['category', 'missing']);
            }
        };
    }
]);
