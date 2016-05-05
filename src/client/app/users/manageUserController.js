
angular.module('mps.user')
.controller('ManageUserController', [
    '$rootScope',
    '$scope',
    '$location',
    '$routeParams',
    'BlankCheck',
    'UserAdminstration',
    'Roles',
    'AccountService',
    'UserService',
    'FormatterService',
    'PersonalizationServiceFactory',
    'SecurityHelper',
    '$q',
    'AllAccounts',
    '$translate',
    function(
        $rootScope,
        $scope,
        $location,
        $routeParams,
        BlankCheck,
        UserAdminstration,
        Roles,
        Account,
        User,
        FormatterService,
        Personalize,
        SecurityHelper,
        $q,
        AllAccounts,
        $translate
        ) {
        var redirect_to_list = function() {
           $location.path(UserAdminstration.route + '/');
        };

        if (UserAdminstration.item === null) {
            redirect_to_list();
        } else {
            $scope.user = UserAdminstration.item;
            $scope.user.workPhone=$scope.user.item.workPhone;
            $scope.user.preferredLanguage=$scope.user.item.preferredLanguage;
            $scope.languageOptions = UserAdminstration.languageOptions($translate);
            $scope.user.org = [];
            $scope.accountList = [];
            $scope.basicRoles = [];
            $scope.user.basicRoles = [];
            $scope.user.addonRoles = [];
            $scope.user.permissions = [];
            $scope.user.selectedRoleList = [];
            $scope.accounts = [];
            $scope.userActive = false;

            if ($scope.user.active === true) {
                $scope.userActive = true;
            }

            if ($scope.user.item && $scope.user.item.address) {
                $scope.user.address = $scope.user.item.address;
            }

            if (!BlankCheck.isNull($scope.user.item._embedded.roles)) {
                $scope.user.selectedRoleList = $scope.user.item._embedded.roles;
            }
            if (!BlankCheck.isNull($scope.user.item._embedded.accounts)) {
                $scope.accounts = $scope.user.item._embedded.accounts;
                if ($scope.accounts.length > 0) {
                    for (var i=0;i<$scope.accounts.length;i++) {
                        $scope.accounts[i]._links = {
                            self: {
                                href: {}
                            }
                        };
                        if (angular.isArray($scope.user._links.accounts)) {
                            $scope.accounts[i]._links.self.href = $scope.user._links.accounts[i].href
                        } else {
                            $scope.accounts[i]._links.self.href = $scope.user._links.accounts.href;
                        }
                    }
                }
            }

            if ($scope.user && $scope.user.firstName && $scope.user.lastName) {
                $scope.user.fullName = $scope.user.firstName + $scope.user.lastName;
            }

            

            var removeParams,
            addonRoleOptions = {
                'params': {
                    customerType: 'customer',
                    roleType: 'addon'
                }
            },
            permissionPromiseList = [];

            Roles.get(addonRoleOptions).then(function() {
                if(Roles.data) {
                    var roleList = Roles.data;
                    for (var j=0; j<roleList.length; j++) {
                        var role = roleList[j];
                        if($scope.user.addonRoles.length < roleList.length) {
                            role.selected = false;
                            if ($scope.user.selectedRoleList && $scope.user.selectedRoleList.length > 0) {
                                for (var i=0;i<$scope.user.selectedRoleList.length;i++) {
                                    if ($scope.user.selectedRoleList[i].roleId === role.roleId) {
                                        Roles.setItem(role);
                                        role.selected = true;
                                        var options = {
                                            params:{
                                                'applicationName': 'customerPortal'
                                            }
                                        };
                                        var permissionPromise = Roles.item.get(options);
                                        permissionPromiseList.push(permissionPromise);
                                    }
                                }
                            }
                            $scope.user.addonRoles.push(role);
                        }
                    }
                    $q.all(permissionPromiseList).then(function(response) {
                        for (var i=0;i<permissionPromiseList.length;i++) {
                            if (response[i] && response[i].data && response[i].data.permissions) {
                                for (var j=0; j<response[i].data.permissions.length; j++) {
                                    if ($scope.user.permissions.indexOf(response[i].data.permissions[j]) === -1) {
                                        $scope.user.permissions.push(response[i].data.permissions[j]);
                                    }
                                }
                            }
                        }
                    });
                }
            });
                
            if ($rootScope.currentAccount && $rootScope.currentAccount.accountLevel === 'siebel') {
                    var siebelAccount = $rootScope.currentAccount;
                    siebelAccount._links = {self: {}};
                    siebelAccount._links.self.href = siebelAccount.href;
                    $scope.accountList.push(siebelAccount);
            } else {
                User.getLoggedInUserInfo().then(function() {
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
                        User.getAdditional(User.item, Account).then(function() {
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
                        searchTerm: $scope.user.accountName
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
                } else if ($scope.user.selectedRoleList) {
                    for (var j=0; j<$scope.user.selectedRoleList.length; j++) {
                        var selectedRole = $scope.user.selectedRoleList[j];
                        if (role.roleId === selectedRole.roleId) {
                            $scope.user.selectedRoleList.splice(j,1);
                        }
                    }
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

        var updateAdminObjectForUpdate = function(updateStatus) {
            UserAdminstration.reset();
            UserAdminstration.newMessage();
            $scope.userInfo = UserAdminstration.item;
            UserAdminstration.addField('ldapId', $scope.user.ldapId);
            UserAdminstration.addField('contactId', $scope.user.contactId);
            UserAdminstration.addField('idpId', $scope.user.idpId);
            UserAdminstration.addField('type', 'BUSINESS_PARTNER');
            if (updateStatus && updateStatus === 'deactivate') {
                UserAdminstration.addField('active', false);
            } else {
                UserAdminstration.addField('active', true);
            }
            UserAdminstration.addField('firstName', $scope.user.firstName);
            UserAdminstration.addField('lastName', $scope.user.lastName);
            if (BlankCheck.checkNotBlank($scope.user.password)) {
                UserAdminstration.addField('password', $scope.user.password);
            }
            UserAdminstration.addField('email', $scope.user.email);
            UserAdminstration.addField('userId', $scope.user.email);
            UserAdminstration.addField('workPhone', $scope.user.workPhone);
            var addressInfo = {
                addressLine1: $scope.user.address.addressLine1,
                addressLine2: $scope.user.address.addressLine2,
                city: $scope.user.address.city,
                state: $scope.user.address.state,
                country: $scope.user.address.country,
                postalCode: $scope.user.address.postalCode
            };
            UserAdminstration.addField('address', addressInfo);
            UserAdminstration.addField('preferredLanguage',  $scope.user.preferredLanguage);
            UserAdminstration.addField('resetPassword', true);
            for (var i=0;i<$scope.user.basicRoles.length; i++) {
                for (var j=0; j<$scope.user.selectedRoleList.length; j++) {
                    var selectedRole = $scope.user.selectedRoleList[j];
                    if ($scope.user.basicRoles[i].description === selectedRole.description) {
                        $scope.user.selectedRoleList.splice(j,1);
                    }
                }
            }

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
        };

        function createModal(popupName){
            var $ = require('jquery');
            $('#'+popupName).modal({
                show: true,
                static: true
            });
        }

        $scope.update = function() {
            updateAdminObjectForUpdate();
            UserAdminstration.item.postURL = UserAdminstration.url + '/' + $scope.userInfo.userId;
            var options = {
                preventDefaultParams: true
            }
            var deferred = UserAdminstration.put({
                item:  $scope.userInfo
            }, options);

            deferred.then(function(result){
                UserAdminstration.wasInvited = false;
                UserAdminstration.wasSaved = false;
                UserAdminstration.wasUpdated = true;
                $location.path('/delegated_admin');
            }, function(reason){
                NREUM.noticeError('Failed to update user because: ' + reason);
            });
        };

        $scope.verifyDeactivateActivate = function(status) {
            if (status === 'activate') {
                createModal('activate-confirm-popup');
            } else if (status === 'deactivate') {
                createModal('deactivate-confirm-popup');
            }
        };

        $scope.deactivate = function() {
            updateAdminObjectForUpdate('deactivate');
            UserAdminstration.item.postURL = UserAdminstration.url + '/' + $scope.userInfo.userId;
            var options = {
                preventDefaultParams: true
            }
            var deferred = UserAdminstration.put({
                item:  $scope.userInfo
            }, options);

            deferred.then(function(result){
                UserAdminstration.wasInvited = false;
                UserAdminstration.wasSaved = false;
                $location.path('/delegated_admin');
            }, function(reason){
                NREUM.noticeError('Failed to update user because: ' + reason);
            });
        };
    }
]);

