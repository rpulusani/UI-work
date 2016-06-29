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
        templateUrl: '/app/users/templates/lexmark-user-fields.html'
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
.directive('lexmarkOrgStructure', function() {
    return {
        restrict: 'A',
        templateUrl: '/app/users/templates/lexmark-org-structure.html'
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
.directive('lexmarkRolePermission', function() {
    return {
        restrict: 'A',
        templateUrl: '/app/users/templates/lexmark-role-permission.html'
    };
})
.directive('userLocationFields', function() {
    return {
        restrict: 'A',
        templateUrl: '/app/users/templates/user-location-fields.html',
        controller: ['$scope', 'CountryService', function($scope, CountryService){
            CountryService.get().then(function(){
                $scope.countries=CountryService.data;
            });

            $scope.countrySelected = function(country) {
                var item = $scope.countries.filter(function(item) {
                    return item.code === country; 
                });
                
                $scope.provinces = item[0].provinces;
                $scope.user.address.state = "";
                
                            };
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
            var $ = require('jquery');
                var sets = $(el).find("[data-js=tab], [data-js=set], [data-js=accordion]");
                sets.each(function(i,set){
                    $(set).set({});
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
            var $ = require('jquery');
                var sets = $(el).find("[data-js=tab], [data-js=set], [data-js=accordion]");
                sets.each(function(i,set){
                    $(set).set({});
                });
        }
    };
})
.directive('inputCompare', function() {
    return {
        require: "ngModel",
        scope: {
            compareValue: "=inputCompare"
        },
        link: function(scope, element, attrs, model) {
            model.$validators.inputCompare = function(val) {
                if (val === undefined || val === '' || scope.compareValue === undefined || scope.compareValue === '') {
                    return false;
                }
                return val === scope.compareValue;
            };
 
            scope.$watch("compareValue", function() {
                model.$validate();
            });
        }
    };
})
.directive('userProfileButtons', function() {
    return {
        restrict: 'A',
        templateUrl: '/app/users/templates/user-profile-buttons.html'
    };
});
