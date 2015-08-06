angular.module('mps')
.controller('TopNavigationController', ['$scope', '$location', 'BaseService',
    function($scope, $location, BaseService){
        $scope.goTo = function(path){
            $location.path(path);
        };
        $scope.isSelected = function(path){
            if(new BaseService().getCurrentLocation.getPathName().toLowerCase() === path.toLowerCase()){
                return true;
            }else{
                return false;
            }
        };
    }
]);
