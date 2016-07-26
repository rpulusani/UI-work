angular.module('mps.user')
.controller('UserAddController', ['$scope', '$location', '$translate', '$routeParams',
        '$rootScope', 'UrlHelper', 'UserService', 'AccountService', 'Roles', '$q', 'UserAdminstration', 'HATEAOSConfig', 'AllAccounts',
        function($scope, $location, $translate, $routeParams, $rootScope, UrlHelper, User, Account, Roles, $q, UserAdminstration, HATEAOSConfig, AllAccounts) {

        $scope.templateUrl = UrlHelper.user_template;
        $scope.addUser = true;
        $scope.user_info_active = true;
        $scope.account_access_active = false;
        $scope.user = {};
        $scope.userInfo = {};
        $scope.user.org = [];
        $scope.accountList = [];
        $scope.basicRoles = [];
        $scope.user.basicRoles = [];
        $scope.user.addonRoles = [];
        $scope.user.permissions = [];
        $scope.user.selectedRoleList = [];
        $scope.showAllAccounts = false;
        $scope.accounts = [];
        $scope.languageOptions = UserAdminstration.languageOptions($translate);
        $scope.errorMessage = false;
        var removeParams,
        addonRoleOptions = {
            'params': {
                customerType: 'customer',
                roleType: 'addon'
            }
        };
        $rootScope.preBreadcrumb = {
            href:'/delegated_admin',
            value:'USER_MAN.MANAGE_USERS.TXT_MANAGE_USERS'
        }
        $scope.userPreference = false;
        if ($location.path() === "/delegated_admin/invite_user") {
            $scope.configure = {
                breadcrumbs:{
                    1: $rootScope.preBreadcrumb,
                    2:{
                        value:'USER_MAN.INVITE_USERS.TXT_INVITE_NEW_USERS'
                    }
                }
            }
        }
        else{
         $scope.configure = {
            breadcrumbs:{
                    1: $rootScope.preBreadcrumb,
                    2:{
                        value:'USER_MAN.CREATE_USER.TXT_CREATE_NEW_USER'
                    }
                }
            }   
        }

        Roles.get(addonRoleOptions).then(function() {
            if(Roles.data) {
                var roleList = Roles.data;
                for (var j=0; j<roleList.length; j++) {
                    var role = roleList[j];
                    if($scope.user.addonRoles.length < roleList.length) {
                        role.selected = false;
                        $scope.user.addonRoles.push(role);
                    }
                }
            }
        });

        if ($rootScope.currentAccount && $rootScope.currentAccount.accountLevel === 'siebel') {
            var siebelAccount = $rootScope.currentAccount;
            siebelAccount._links = {self: {}};
            siebelAccount._links.self.href = siebelAccount.href;
            $scope.accountList.push(siebelAccount);
        } else {
            User.getLoggedInUserInfo().then(function() {
                if($rootScope.portalAdmin || $rootScope.lexmarkAdmin) {
                    $scope.showAllAccounts = true;
                }
            	$scope.userDebug = User;
            	if (User.item._links.accounts) {
                    if (angular.isArray(User.item._links.accounts)) {
                    	
                        var promises = [],
                        options = {},
                        promise, deferred;
                        for (var i=0; i<User.item._links.accounts.length; i++) {
                            var item = User.item.accounts[i];
                            item._links = {
                                self: {}
                            };
                            item._links.self = User.item._links.accounts[i];
                            deferred = $q.defer();
                            Account.setItem(item);
                            options = {
                                updateParams: false,
                                params:{
                                    accountId: Account.item.accountId,
                                    accountLevel: Account.item.level
                                }
                            };
                            
                            
                            promise = Account.item.get(options);
                            promises.push(promise);
                        }
                        var prLength = promises.length;
                        $q.all(promises).then(function(response) {
                            for (var j=0; j<response.length; j++) {
                                if($scope.accountList.length < prLength && response[j] && response[j].data) {
                                    $scope.accountList.push(response[j].data);
                                }
                            }
                            
                        });
                    } else {
                    	$rootScope.currentAccount = {};
                    	$rootScope.currentAccount.accountId = $rootScope.currentUser.accounts[0].accountId;
                        $rootScope.currentAccount.accountLevel = $rootScope.currentUser.accounts[0].level;
                        User.getAdditional(User.item, Account).then(function() {
                        	$rootScope.currentAccount = undefined;
                            if ($scope.accountList.length === 0) {
                                $scope.accountList.push(Account.item);
                            }
                        });
                    }
                } else {
                    $scope.showAllAccounts = true;
                }
            });
        }

        $scope.setAccounts = function() {
            $scope.$broadcast('searchAccount');
        };

        $scope.removeAccount = function(item) {
            if ($scope.accounts && $scope.accounts.length > 0) {
                for (var j=0;j<$scope.accounts.length; j++) {
                    if ($scope.accounts[j].accountId 
                        && $scope.accounts[j].accountId === item.accountId
                        && $scope.accounts[j].level === item.level
                        && $scope.accounts[j].name === item.name) {
                        $scope.accounts.splice(j, 1);
                    }
                }
            }
            $scope.$broadcast('searchAccount');
        };

        $scope.$on('searchAccount', function(evt){
            $scope.accountList = [];
            if($scope.user.accountName && $scope.user.accountName.length >=3) {
                var options = {
                    preventDefaultParams: true,
                    params:{    
                        searchTerm: encodeURIComponent($scope.user.accountName)
                    }
                };
                AllAccounts.get(options).then(function(){
                    $scope.accountList = [];
                    if (AllAccounts.item._embedded && AllAccounts.item._embedded.accounts) {
                        var allAccountList = AllAccounts.item._embedded.accounts;
                        for (var i=0; i<allAccountList.length; i++) {
                            $scope.accountList.push(allAccountList[i]);
                        }
                    }
                });
            }
        });

        $scope.setPermissions = function(role){
            Roles.setItem(role);
            var options = {
                params:{
                    'applicationName': 'customerPortal'
                }
            };

            Roles.item.get(options).then(function(){
                if (Roles.item && Roles.item.permissions) {
                    for (var i=0; i<Roles.item.permissions.length; i++) {
                        if (role.selected && $scope.user.permissions.indexOf(Roles.item.permissions[i]) === -1) {
                            $scope.user.permissions.push(Roles.item.permissions[i]);
                        } else if ($scope.user.permissions && $scope.user.permissions.indexOf(Roles.item.permissions[i])!== -1) {
                            $scope.user.permissions.splice($scope.user.permissions.indexOf(Roles.item.permissions[i]), 1);
                        }
                    }
                }
                if (Roles.item && role.selected) {
                    $scope.user.selectedRoleList.push(role);
                } else if ($scope.user.selectedRoleList && $scope.user.selectedRoleList.indexOf(role) !== -1) {
                    $scope.user.selectedRoleList.splice($scope.user.selectedRoleList.indexOf(role), 1);
                }
            });
        };

        $scope.setPermissionsForBasic = function(role){
            Roles.setItem(role);
            var options = {
                params:{
                    'applicationName': 'customerPortal'
                }
            }, promises = [];

            promises.push(Roles.item.get(options));

            for (var i=0;i<$scope.user.basicRoles.length; i++) {
                if ($scope.basicRole
                    && $scope.user.basicRoles[i].roleId.toString() === $scope.basicRole.toString()) {
                    Roles.setItem($scope.user.basicRoles[i]);
                    var options = {
                        params:{
                            'applicationName': 'customerPortal'
                        }
                    };
                    promises.push(Roles.item.get(options));
                }
            }

            $q.all(promises).then(function(response) {
                if(response[1] && response[1].data && response[1].data.permissions) {
                    var permissionList = response[1].data.permissions;
                    for (var i=0; i<permissionList.length; i++) {
                        if ($scope.user.permissions && $scope.user.permissions.indexOf(permissionList[i])!== -1) {
                            $scope.user.permissions.splice($scope.user.permissions.indexOf(permissionList[i]), 1);
                        }
                    }
                }

                if(response[0] && response[0].data && response[0].data.permissions) {
                    var permissionList = response[0].data.permissions;
                    for (var i=0; i<permissionList.length; i++) {
                        if ($scope.user.permissions.indexOf(permissionList[i]) === -1) {
                            $scope.user.permissions.push(permissionList[i]);
                        }
                    }
                }
            });
        };

        var updateAdminObjectForSubmit = function() {
            if ($location.path() === "/delegated_admin/invite_user") {
                if ($scope.user.emails) {
                    $scope.userInfoList = [];
                    var emailList = $scope.user.emails.split(',');
                    $scope.user.noOfInvitation = emailList.length;
                    for (var i=0;i<emailList.length;i++) {
                        UserAdminstration.newMessage();
                        $scope.userInfoList[i] = UserAdminstration.item;
                        UserAdminstration.addField('type', 'INVITED');
                        UserAdminstration.addField('invitedStatus', 'INVITED');
                        UserAdminstration.addField('active', false);
                        UserAdminstration.addField('resetPassword', false);
                        UserAdminstration.addField('email', emailList[i]);
                        UserAdminstration.addField('userId', emailList[i]);

                        for (var j=0;j<$scope.user.basicRoles.length; j++) {
                            if ($scope.basicRole
                                && $scope.user.basicRoles[j].description === $scope.basicRole
                                && $scope.user.selectedRoleList.indexOf($scope.user.basicRoles[j]) === -1) {
                                $scope.user.selectedRoleList.push($scope.user.basicRoles[j]);
                            }
                        }
                        if ($scope.user.selectedRoleList) {
                            UserAdminstration.addMultipleRelationship('roles', $scope.user.selectedRoleList, 'self');
                        }

                        if ($scope.accounts && $scope.accounts.length > 0) {
                            UserAdminstration.addMultipleRelationship('accounts', $scope.accounts, 'self');
                        }
                    }
                }
            } else {
                UserAdminstration.newMessage();
                $scope.userInfo = UserAdminstration.item;
                UserAdminstration.addField('type', 'BUSINESS_PARTNER');
                UserAdminstration.addField('active', true);
                UserAdminstration.addField('firstName', $scope.user.firstName);
                UserAdminstration.addField('lastName', $scope.user.lastName);
                UserAdminstration.addField('password', $scope.user.password);
                UserAdminstration.addField('email', $scope.user.email);
                UserAdminstration.addField('userId', $scope.user.email);
                UserAdminstration.addField('workPhone', $scope.user.workPhone);
                var addressInfo = {
                    addressLine1: $scope.user.address.addressLine1,
                    addressLine2: $scope.user.address.addressLine2,
                    city: $scope.user.address.city,
                    state: $scope.user.address.state,
                    country: $scope.user.address.country,
                    countryIsoCode: $scope.user.address.country,
                    postalCode: $scope.user.address.postalCode
                };
                UserAdminstration.addField('address', addressInfo);
                UserAdminstration.addField('preferredLanguage', $scope.user.preferredLanguage);
                UserAdminstration.addField('resetPassword', true);
                for (var i=0;i<$scope.user.basicRoles.length; i++) {
                    if ($scope.basicRole
                        && $scope.user.basicRoles[i].description === $scope.basicRole) {
                        $scope.user.selectedRoleList.push($scope.user.basicRoles[i]);
                    }
                }
                if ($scope.user.selectedRoleList) {
                    UserAdminstration.addMultipleRelationship('roles', $scope.user.selectedRoleList, 'self');
                }

                if ($scope.accounts && $scope.accounts.length > 0) {
                    UserAdminstration.addMultipleRelationship('accounts', $scope.accounts, 'self');
                }
            }
        };

        $scope.setUserInfo = function() {
            $scope.user_info_active = true;
            $scope.account_access_active = false;
        };

        $scope.setAccountAccess = function() {
            $scope.user_info_active = false;
            $scope.account_access_active = true;
        };

        $scope.save = function() {
            updateAdminObjectForSubmit();
            UserAdminstration.item.postURL = UserAdminstration.url;
            var deferred = UserAdminstration.post({
                item:  $scope.userInfo
            });

            deferred.then(function(result){
                if(result.statusText === "Created" ){
                    UserAdminstration.wasInvited = false;
                    UserAdminstration.wasSaved = true;
                    $location.path('/delegated_admin');
                }
                else if(result.statusText === "Internal Server Error"){
                    $scope.errorUser = true;
                    $scope.errorMessage = $translate.instant('USER_MAN.CREATE_USER.TXT_ERROR_CREATING_USER');
                    $('.site-content').scrollTop(100);
                    
                }                
                else{
                    $location.path('/delegated_admin');
                }
            }, function(reason){
                NREUM.noticeError('Failed to create SR because: ' + reason);
            });
        };

        $scope.invite = function() {
            updateAdminObjectForSubmit();
            UserAdminstration.item.postURL = UserAdminstration.url;
            var deferredList = [];
            if ($scope.userInfoList && $scope.userInfoList.length > 0) {
                for (var i=0;i<$scope.userInfoList.length;i++) {
                    var deferred = UserAdminstration.post({
                        item:  $scope.userInfoList[i]
                    });
                    deferredList.push(deferred);
                }
            }

            $q.all(deferredList).then(function(result) {
                UserAdminstration.wasSaved = false;
                UserAdminstration.wasInvited = true;
                UserAdminstration.noOfInvitation = $scope.user.noOfInvitation;
                $location.path('/delegated_admin');
            }, function(reason){
                NREUM.noticeError('Failed to create SR because: ' + reason);
            });
        };
    }
]);

