angular.module('mps.common')
.controller('TopNavigationController', ['$scope', '$location', 'BaseService',
    function($scope, $location, BaseService){
        $scope.goTo = function(path){
            $location.path(path);
        };
        $scope.isSelected = function(path){
            var pass = false;
            if(path === '/' && path.toLowerCase() === new BaseService().getCurrentLocation.getPathName().toLowerCase()){
                pass = true;
            } else if(path !== '/' && new BaseService().getCurrentLocation.getPathName().toLowerCase().indexOf(path.toLowerCase()) > -1) {
                    pass = true;
            }else{
                   pass = false;
            }
            return pass;
        };
    }
]);
