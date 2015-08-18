'use strict';
angular.module('mps.navigation')
.controller('TopNavController', ['$scope', '$http', '$location', 'Navigation',
    function($scope, $http, $location, Nav) {
        $scope.navArray = Nav.data;

        $scope.isSelected = function(path) {
            var pass = false,
            currentLocation = angular.lowercase($location.path());

            if (path === '/' && path.toLowerCase() === currentLocation) {
                pass = true;
            } else if (path !== '/' && currentLocation.indexOf(path.toLowerCase()) > -1) {
                pass = true;
            }

            return pass;
        };

        if (Nav.data.length === 0) {
            Nav.query(function() {
                $scope.navArray = Nav.data;
            });
        }
    }
]);
