define(['angular', 'serviceRequest'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequests')
    .controller('ServiceRequestCancelController', [
        '$scope',
        '$location',
        '$rootScope',
        'ServiceRequestService',
        'SRControllerHelperService',
        'FormatterService',
        'BlankCheck',
        'Contacts',
        'UserService',
        '$translate',
        function(
            $scope,
            $location,
            $rootScope,
            ServiceRequest,
            SRHelper,
            FormatterService,
            BlankCheck,
            Contacts,
            Users,
            $translate) {

            $rootScope.showCancelBtn = false;

            // temporarily removed configurations due to issues with overwriting other SR templates

        }
    ]);
});
