define(['angular'], function(angular) {
    'use strict';
    angular.module('mps.orders')
    .controller('AgreementCatalogController', [
        '$rootScope',
        '$scope',
        '$location',
        'OrderRequest',
        'BlankCheck',
        function(
            $rootScope,
            $scope,
            $location,
            Orders,
            BlankCheck
        ){
            $scope.print = false;
            $scope.export = false;
            $scope.setAcceptedPayChoice= function(){

            };

        }]);
});
