angular.module('mps.common')
.controller('NavigationController', ['$scope', '$http', '$location', 'BaseService',
    function($scope, $http, $location, BaseService){        
        $scope.goTo = function(path){
            $location.path(path);
        };
        $scope.isSelected = function(path){
            var pass = false;
            try{
                var currentLocation = angular.lowercase($location.path());
                if (path === '/' && path.toLowerCase() === currentLocation){
                    pass = true;
                } else if (path !== '/' && currentLocation.indexOf(path.toLowerCase()) > -1) {
                    pass = true;
                }
            } catch (error){
                if (error instanceof ReferenceError){
                    NREUM.noticeError(error);
                } else if (error instanceof TypeError){
                    NREUM.noticeError(error);
                }
            }
            
            return pass;
        };
        $scope.isHeader = function(tags){
            var pass = false;
            try{
                if (tags!=='' && tags.indexOf('header') > -1){
                    pass = true;
                }
            }catch (error){
                if (error instanceof ReferenceError){
                    NREUM.noticeError(error);
                } else if (error instanceof TypeError){
                    NREUM.noticeError(error);
                }
            }
            return pass;
        };
        $scope.hasChildren = function(children){
            var pass = false;
            try{
                if (children!=='' && children.length > 0){
                    pass = true;
                }
            }catch (error){
                if (error instanceof ReferenceError){
                    NREUM.noticeError(error);
                } else if (error instanceof TypeError){
                    NREUM.noticeError(error);
                }
            }
            return pass;
        };
        $scope.hasThisChild = function(children,child){
            var pass = false;
            try{
                if (children!=='' && children.length>0 && children.indexOf(child) > -1){
                    pass = true;
                }
            }catch (error){
                if (error instanceof ReferenceError){
                    NREUM.noticeError(error);
                } else if (error instanceof TypeError){
                    NREUM.noticeError(error);
                }
            }
            return pass;
        };
        $scope.isChild = function(child,dataArray){
            var pass = false;
            try{
                for (var i = 0; i < dataArray.length; i++) {
                    if (dataArray[i].children !=='' && dataArray[i].children.indexOf(child)>-1) {
                      pass = true;
                      break;
                    }
                }
            }catch (error){
                if (error instanceof ReferenceError){
                    NREUM.noticeError(error);
                } else if (error instanceof TypeError){
                    NREUM.noticeError(error);
                } 
            }

            return pass;
        };        
        
        $http.get('app/common/navigation-details.json').success (function(data){
            $scope.navArray = data;
        }).error(function(data) {
            NREUM.noticeError(data);
        });
    }
]);
