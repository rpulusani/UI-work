define(['angular','serviceRequest', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestAddresses')
    .controller('ServiceRequestTabController', [
        '$rootScope',
        'SecurityHelper',
        function(
            $rootScope,
            SecurityHelper
        ) {
            new SecurityHelper($rootScope).redirectCheck($rootScope.serviceRequestAccess);
        }
    ]);
});
