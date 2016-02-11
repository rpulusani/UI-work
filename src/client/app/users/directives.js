define(['angular', 'user', 'account.accountFactory', 'account.roleFactory'], function(angular) {
    'use strict';
    angular.module('mps.user')
    .directive('allUsersTab', function(){
        return {
            restrict: 'A',
            templateUrl : '/app/users/templates/tabs/all-users-tab.html',
            controller: 'UsersController'
        };
    })
    .directive('invitedUsersTab', function(){
        return {
            restrict: 'A',
            templateUrl : '/app/users/templates/tabs/invite-users-tab.html',
            controller: 'InvitedUsersController'
        };
    })
    .directive('userProfileTab', function(){
        return {
            restrict: 'A',
            templateUrl : '/app/users/templates/tabs/user-profile-tab.html',
            controller: 'ManageUserController'
        };
    })
    .directive('accountAccessTab', function(){
        return {
            restrict: 'A',
            templateUrl : '/app/users/templates/tabs/account-access-tab.html',
            controller: 'ManageUserController'
        };
    })
    .directive('userNewFields', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/users/templates/user-new-fields.html',
            controller: 'UserAddController'
        };
    })
    .directive('lexmarkUserFields', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/users/templates/lexmark-user-fields.html',
            controller: 'LexmarkUserAddController'
        };
    })
    .directive('userInviteFields', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/users/templates/user-invite-fields.html',
            controller: 'UserAddController'
        };
    })
    .directive('userCoreFields', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/users/templates/user-core-fields.html'
        };
    })
    .directive('userOrgStructure', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/users/templates/user-org-structure.html'
        };
    })
    .directive('userRolePermission', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/users/templates/user-role-permission.html',
            controller: ['$scope', 'Roles', function($scope, Roles){
                var basicRoleOptions =  {
                    'params': {
                        customerType: 'customer',
                        roleType: 'basic'
                    }
                };
                Roles.get(basicRoleOptions).then(function() {
                    $scope.user.basicRoles = Roles.data;
                    for (var j=0;j<Roles.data.length; j++) {
                        var tempRole = Roles.data[j];
                        if ($scope.user.selectedRoleList && $scope.user.selectedRoleList.length > 0) {
                            for (var i=0;i<$scope.user.selectedRoleList.length;i++) {
                                if ($scope.user.selectedRoleList[i].description === tempRole.description) {
                                    $scope.setPermissionsForBasic($scope.user.selectedRoleList[i]);
                                    $scope.basicRole = tempRole.description;
                                }
                            }
                        }
                    }
                });
            }]
        };
    })
    .directive('userLocationFields', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/users/templates/user-location-fields.html',
            controller: ['$scope', 'CountryService', function($scope, CountryService){
                $scope.countryHAL = CountryService.getHAL();
                $scope.countrySelected = function(country) {
                  $scope.country = country;
                };

                var loaded = false;
                $scope.$watchGroup(['countryHAL', 'address'], function(vals) {
                    var countries = vals[0], address = vals[1];
                    if(countries && address && !loaded) {
                        countries.$promise.then(function() {
                            $.each(countries.countries, function(_i, c) {
                            if(c.code == address.country) {
                                $scope.country = c;
                            }
                        });
                        loaded = true;
                        });
                    }
               });
            }]
        };
    })
    .directive('userLoginFields', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/users/templates/user-login-fields.html'
        };
    })
    .directive('userFormButtons', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/users/templates/user-form-buttons.html'
        };
    })
    .directive('userInviteButtons', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/users/templates/user-invite-buttons.html'
        };
    })
    .directive('userUpdateButtons', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/users/templates/user-update-buttons.html'
        };
    })
    .directive('lexmarkUserButtons', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/users/templates/lexmark-user-buttons.html'
        };
    })
    .directive('manageUserTabs', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/users/templates/manage-user-tabs.html',
            controller: 'ManageUserTabController',
            link: function(scope, el, attr){
                require(['lxk.fef'], function() {
                    var $ = require('jquery'),
                         sets = $(el).find("[data-js=tab], [data-js=set], [data-js=accordion]");
                    sets.each(function(i,set){
                        $(set).set({});
                    });
                });
            }
        };
    })
    .directive('userTabs', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/users/templates/user-tabs.html',
            controller: 'UserTabController',
            link: function(scope, el, attr){
                require(['lxk.fef'], function() {
                    var $ = require('jquery'),
                         sets = $(el).find("[data-js=tab], [data-js=set], [data-js=accordion]");
                    sets.each(function(i,set){
                        $(set).set({});
                    });
                });
            }
        };
    });
});
