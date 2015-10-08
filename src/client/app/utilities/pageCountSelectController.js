define(['angular', 'utility', 'utility.pageCountSelectService'], function(angular) {
    'use strict';
    angular.module('mps.utility')
    .controller('PageCountSelectController', ['$scope', '$location', '$filter', '$routeParams', 'PageCountSelect',
        function($scope, $location, $filter, $routeParams, PageCountSelect) {
            var acctId = 1;
            $scope.showLess = true;
            $scope.pageCountList = PageCountSelect.pageCountTypes.query();
            $scope.currentDate = $filter('date')(new Date(), "MM/dd/yyyy");

            $scope.toggleDisplay = function(){
                $scope.showLess = !$scope.showLess;
            }

            $scope.filterByIds = function(pageCountType) {
                var selectedIds = ['lifetime-1','color-1','mono-1'];
                return (selectedIds.indexOf(pageCountType.id) !== -1);
            };
        }
    ]);
});
