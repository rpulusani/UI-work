define([
    'nav',
    'nav.navFactory'
], function(nav){

    'use strict';

    nav
    .controller('NavController', ['$scope', '$location', 'Nav',
        function($scope, $location, Nav) {
            $scope.items = Nav.items;
            $scope.tags = Nav.getTags();

            $scope.getItemsByTag = function(tag){
                return Nav.getItemsByTag(tag);
            };

            $scope.setActive = function(item){
                $scope.activeItem = item;
            };

            $scope.isInitial = function(item){
                if(!item){
                    return undefined;
                }
                return($location.path() === item.action);
            };

            if($scope.items.length === 0){
                Nav.query(function(){
                    $scope.items = Nav.items;
                });
            }
        }
    ]);
});
