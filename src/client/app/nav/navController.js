define([
    'nav',
    'nav.navFactory'
], function(nav){

    'use strict';

    nav
    .controller('NavController', ['$scope',
        '$location',
        '$route',
        'Nav',
        function(
            $scope,
            $location,
            $route,
            Nav
            ) {

            $scope.items = Nav.items;
            $scope.tags = Nav.getTags();
            $scope.$route = $route;

            $scope.getItemsByTag = function(tag){
                return Nav.getItemsByTag(tag);
            };

            $scope.isActive = function(item){
                if(!item){
                    return undefined;
                }
                return($location.path() === item.action || $route.current.activeItem === item.action);
            };

            if($scope.items.length === 0){
                Nav.query(function(){
                    $scope.items = Nav.items;
                });
            }
            $scope.setActive = function(text){

            };
        }
    ]);
});
