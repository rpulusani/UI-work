define([
    'nav',
    'nav.navFactory'
], function(nav){

    'use strict';

    nav
    .controller('NavController', ['$scope',
        '$location',
        'Nav',
        'SecurityHelper',
        'permissionSet',
        function(
            $scope,
            $location,
            Nav,
            SecurityHelper,
            permissionSet
            ) {

            var configurePermissions = [
                {
                    name: 'viewHomePage',
                    permission: permissionSet.dashboard.view
                }
            ];

            new SecurityHelper($scope).setupPermissionList(configurePermissions);

            $scope.items = Nav.items;
            $scope.tags = Nav.getTags();

            $scope.getItemsByTag = function(tag){
                return Nav.getItemsByTag(tag);
            };

            if($scope.items.length === 0){
                Nav.query(function(){
                    $scope.items = Nav.items;
                });
            }
        }
    ]);
});
