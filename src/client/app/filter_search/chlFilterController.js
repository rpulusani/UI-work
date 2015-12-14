define(['angular', 'filterSearch'], function(angular) {
    'use strict';
    angular.module('mps.filterSearch')
    .controller('CHLFilterController', ['$scope', '$translate',
        function($scope, $translate) {
            console.log($scope.service);
        }
    ]);
});
