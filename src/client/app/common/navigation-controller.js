angular.module('mps.common')
.controller('NavigationController', ['$scope', '$http', '$location', 'BaseService',
    function($scope, $http, $location, BaseService){
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
        $scope.isHeader = function(tags){
            var header = 'header';
            var pass = false;
            if(tags!==''){
                if(tags.indexOf(header) > -1){
                    pass = true;
                }
            }
            return pass;
        };
        $scope.hasChildren = function(children){
            var pass = false;
            if(children!==''){
                var len = children.length;
                if(len>0){
                    pass = true;
                }
            }
            return pass;
        };
        $scope.hasThisChild = function(children,child){
            var pass = false;
            if(children!==''){
                var len = children.length;
                if(len>0){
                   if(children.indexOf(child) > -1){
                        pass = true;
                    } 
                }
            }
            return pass;
        };
        $scope.isChild = function(parent){
            var pass = false;
            if(parent!==''){
                var len = parent.length;
                if(len>0){
                    pass = true;
                }
            }
            return pass;
        };
        
        $http.get('app/common/navigation-details.json').success (function(data){
                $scope.navArray = data;
        });
    }
]);
