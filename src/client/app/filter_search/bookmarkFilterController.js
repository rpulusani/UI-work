
angular.module('mps.filterSearch')
.controller('BookmarkFilterController', ['$scope', '$translate',
    function($scope, $translate) {
        $scope.params['bookmarkFilter'] = true;
        $scope.filterDef($scope.params, ['chlFilter', 'location']);
    }
]);
