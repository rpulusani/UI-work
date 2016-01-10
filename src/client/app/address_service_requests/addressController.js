define(['angular', 'address', 'address.factory', 'serviceRequest'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestAddresses')
    .controller('AddressController', [
        '$rootScope',
        '$scope',
        '$location',
        '$routeParams',
        'Addresses',
        'ServiceRequestService',
        '$q',
        'translationPlaceHolder',
        'allowMakeChange',
        function(
            $rootScope,
            $scope,
            $location,
            $routeParams,
            Addresses,
            ServiceRequestService,
            $q,
            translationPlaceHolder,
            allowMakeChange
            ) {

            $scope.translationPlaceHolder = translationPlaceHolder;

            var redirect_to_list = function() {
               $location.path(Addresses.route + '/');
            };



    }]);
});
