
'use strict';
angular.module('mps.user')
.controller('UserController', ['$scope', '$location', '$translate', '$routeParams',
    '$rootScope', 'UrlHelper', 'UserService', 'AccountService', 'Roles', '$q',
    function($scope, $location, $translate, $routeParams, $rootScope, UrlHelper, User, Account, Roles, $q) {

        $scope.templateUrl = UrlHelper.user_template;

        $scope.user_info_active = true;
        $scope.account_access_active = false;
        $scope.user = {};
        $scope.setUserInfo = function() {
            $scope.user_info_active = true;
            $scope.account_access_active = false;
        };

        $scope.setAccountAccess = function() {
            $scope.user_info_active = false;
            $scope.account_access_active = true;
        };

        $scope.save = function() {
            $location.path('/delegated_admin/return/submitted');
        };

        $scope.invite = function() {
            $location.path('/delegated_admin/return/invited');
        };
    }
]);

