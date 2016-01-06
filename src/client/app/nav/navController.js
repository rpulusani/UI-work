define([
    'nav',
    'nav.navFactory'
], function(nav){

    'use strict';

    nav
    .controller('NavController', ['$scope',
        '$rootScope',
        '$location',
        '$route',
        'Nav',
        function(
            $scope,
            $rootScope,
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
                var passed = false;
                if(!item){
                    return undefined;
                }
                if($location.path() === item.action || $route.current.activeItem === item.action){
                    passed = true;
                    $rootScope.sectionTitle = item.text;
                }
                return passed;
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
