'use strict';
angular.module('mps.navigation')
.controller('LeftNavController', ['$scope', '$http', '$location', 'Navigation',
    function($scope, $http, $location, Nav) {
        $scope.navArray = Nav.data;

        $scope.isHeader = function(tags){
            var pass = false;

            if (tags!=='' && tags.indexOf('header') > -1) {
                pass = true;
            }
            return pass;
        };

        $scope.hasChildren = function(children) {
            var pass = false;

            if (children!=='' && children.length > 0) {
                pass = true;
            }
            return pass;
        };

        $scope.hasThisChild = function(children, child) {
            var pass = false;

            if (children!=='' && children.length>0 && children.indexOf(child) > -1) {
                pass = true;
            }
            return pass;
        };

        $scope.isChild = function(child, dataArray) {
            var pass = false,
            i = 0,
            arrLen = dataArray.length;

            for (i; i < arrLen; i++) {
                if (dataArray[i].children !=='' && dataArray[i].children.indexOf(child)>-1) {
                  pass = true;
                  break;
                }
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
