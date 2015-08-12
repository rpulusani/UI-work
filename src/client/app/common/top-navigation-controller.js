angular.module('mps.common')
.controller('TopNavigationController', ['$scope', '$location', 'BaseService',
    function($scope, $location, BaseService){
        $scope.goTo = function(path){
            $location.path(path);
        };
        $scope.isSelected = function(path){
            var pass = false,
             currentLocation = angular.lowercase($location.path());
            if(path === '/' && path.toLowerCase() === currentLocation){
                pass = true;
            } else if(path !== '/' && currentLocation.indexOf(path.toLowerCase()) > -1) {
                    pass = true;
            }else{
                   pass = false;
            }
            return pass;
        };
    }
]);
