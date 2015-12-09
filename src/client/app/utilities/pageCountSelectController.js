define(['angular', 'utility', 'utility.pageCountSelectService'], function(angular) {
    'use strict';
    angular.module('mps.utility')
    .controller('PageCountSelectController', ['$scope', '$location', '$filter', '$routeParams', 'PageCountSelect',
        function($scope, $location, $filter, $routeParams, PageCountSelect) {
            $scope.showAllMeterReads = false;
            $scope.sourceObj.meterReads = PageCountSelect.pageCountTypes.query();
        }
    ]);
});
