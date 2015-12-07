define(['angular', 'filterSearch'], function(angular) {
    'use strict';
    angular.module('mps.filterSearch')
    .controller('GridSearchController', ['$scope',
        function($scope) {
            console.log($scope.columns.length);
        }
    ]);
});
