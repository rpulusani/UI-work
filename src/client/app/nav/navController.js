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

            if(Nav.items.length === 0){
                Nav.query(function(){
                    $scope.items = Nav.items;
                });
            }
        }
    ]);
});
