'use strict';
angular.module('mps.account')
.controller('AccountController', [
    '$scope',
    'AccountService',
    '$translate',
    '$rootScope',
    'FormatterService',
    'ServiceRequestService',
    'SRControllerHelperService',
    function($scope, Accounts, $translate, $rootScope, FormatterService, ServiceRequest, SRHelper) {
        $rootScope.currentRowList = [];
    }
]);
