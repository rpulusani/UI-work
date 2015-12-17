define(['angular', 'utility', 'utility.pageCountSelectService'], function(angular) {
    'use strict';
    angular.module('mps.utility')
    .controller('PageCountSelectController', ['$scope', '$location', '$filter', '$routeParams', 'PageCountSelect',
        function($scope, $location, $filter, $routeParams, PageCountSelect) {
            $scope.showAllMeterReads = false;
            $scope.meterReads = PageCountSelect.pageCountTypes.query();
            console.log($scope.meterReads);
        }
    ]);
});
