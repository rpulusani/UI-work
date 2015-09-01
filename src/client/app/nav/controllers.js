'use strict';

angular.module('mps.nav')
.controller('NavController', ['$scope', 'filterFilter', 'orderByFilter', 'Nav',
    function($scope, filter, orderBy, Nav) {
        $scope.navArray = Nav.data;

        $scope.getItemsByTag = function(itemArray, tag){
            return filter(itemArray, function(value, index, array){
                if(value.tags.indexOf(tag) !== -1){
                    return value;
                }
            });
        };

        $scope.getTags = function(itemArray){
            var limit = itemArray.length,
                tags = [],
                tagCount = 0;

            for(var i=0;i<limit;i++){
                tagCount = itemArray[i].tags.length;

                for(var n=0;n<tagCount;n++){
                    if(tags.indexOf(itemArray[i].tags[n]) === -1){
                        tags.push(itemArray[i].tags[n]);
                    }
                }
            }

            return tags;
        };

        if (Nav.data.length === 0) {
            Nav.query(function() {
                $scope.navArray = Nav.data;
            });
        }
    }
])
.controller('NavItemController', ['$scope', '$location', 'filterFilter', 'Nav',
    function($scope, $location, filter, Nav){
        $scope.navArray = Nav.data;
        $scope.children = filter($scope.navArray, function(item, i, items){
            if(item.tags.indexOf($scope.item.id) !== -1){
                return item;
            }
        });

        $scope.hasTag = function(tag){
            return ($scope.item.tags.indexOf(tag) !== -1);
        };

        $scope.hasChildren = function(){
            return ($scope.children.length > 0);
        };

        $scope.isActive = function(){
            return ($location.path() === $scope.item.action || $scope.hasActiveChild());
        };

        $scope.hasActiveChild = function(){
            var limit = $scope.children.length;

            for(var i=0;i<limit;i++){
                // Would be better to use:
                // if($scope.children[i].isActive()){
                if($location.path() === $scope.children[i].action){
                    return true;
                }
            }

            return false;
        };

        if (Nav.data.length === 0) {
            Nav.query(function() {
                $scope.navArray = Nav.data;
            });
        }
    }
]);
