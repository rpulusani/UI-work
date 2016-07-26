

angular.module('mps.user')
.controller('LexmarkUserAddController', ['$scope', '$location', '$translate', '$routeParams',
    '$rootScope', 'UrlHelper', 'UserService', 'AccountService', 'Roles', '$q', 'UserAdminstration',
    'LexmarkUser', 'AllAccounts', 'FormatterService', 'BlankCheck', '$route',
    function($scope, $location, $translate, $routeParams, $rootScope, UrlHelper, User, Account, Roles, $q, UserAdminstration,
        LexmarkUser, AllAccounts, FormatterService, BlankCheck, $route) {

        $scope.headers = [
            $translate.instant('USER_MAN.COMMON.TXT_FIRST_NAME'),
            $translate.instant('USER_MAN.COMMON.TXT_LAST_NAME'),
            $translate.instant('USER_MAN.COMMON.TXT_EMAIL_ADDRESS'),
            $translate.instant('USER_MAN.COMMON.TXT_PHONE_NUMBER'),
            $translate.instant('USER_MAN.COMMON.TXT_USER_ADDRESS'),
            $translate.instant('USER_MAN.MANAGE_LXK_USERS.CHK_PORTAL_ACCESS_ENABLED'),
            $translate.instant('USER_MAN.COMMON.TXT_USER_ACCOUNTS'),
            $translate.instant('USER_MAN.COMMON.TXT_BASE_ROLE'),
            $translate.instant('USER_MAN.COMMON.TXT_ADDITIONAL_PERMISSIONS'),
            $translate.instant('USER_MAN.COMMON.TXT_PERMISSION_DETAILS')
        ];

        function generateCsvRows() {
            var rows = [];

            if ($scope.user.firstName) {
                rows.push($scope.user.firstName);
            } else {
                rows.push('none');
            }
            if ($scope.user.lastName) {
                rows.push($scope.user.lastName);
            } else {
                rows.push('none');
            }
            if ($scope.user.email) {
                rows.push($scope.user.email);
            } else {
                rows.push('none');
            }

            if ($scope.user.workPhone) {
                rows.push($scope.user.workPhone);
            } else {
                rows.push('none');
            }
           
            if ($scope.formattedUserAddress) {
                rows.push($scope.formattedUserAddress.replace(/<br\/>/g, ', '));
            } else {
                rows.push('none');
            }

            if ($scope.userActive) {
                rows.push('YES');
            } else {
                rows.push('NO');
            }

            if ($scope.csvAcntArr && $scope.csvAcntArr.length > 0) {
                rows.push($scope.csvAcntArr.join());              
            } else {
                rows.push('none');
            }

            if ($scope.basicRoleCsvStr) {
                rows.push($scope.basicRoleCsvStr);
            } else {
                rows.push('none');
            }            

            if ($scope.csvAddOnRolesArr && $scope.csvAddOnRolesArr.length > 0) {
                rows.push($scope.csvAddOnRolesArr.join());
            } else {
                rows.push('none');
            }

            if ($scope.csvPermissionsArr && $scope.csvPermissionsArr.length > 0) {
                rows.push($scope.csvPermissionsArr.join());
            } else {
                rows.push('none');
            }
            return rows;
        }

        function setCsvDefinition() {
            var rows = generateCsvRows(),
            i = 0;

            var csvFileName = "download";
            if($scope.user.email && $scope.user.email !== null) {
                csvFileName = $scope.user.email;
            }
            $scope.csvModel = {
                filename: csvFileName + '.csv',
                headers: $scope.headers,
                // rows are just property names found on the dataObj
                rows: rows
            };

            var pdfHeaders1 = [],
            pdfRows1 = [];
            
            var pdfFirstHeaderColumnsCnt = 11;
            var totalColumnsCnt = $scope.headers.length;
            if(totalColumnsCnt <= pdfFirstHeaderColumnsCnt) {
                pdfFirstHeaderColumnsCnt = totalColumnsCnt;
            }            

            for (i; i < pdfFirstHeaderColumnsCnt; i += 1) {
               pdfHeaders1.push({text: $scope.headers[i], fontSize: 8});
            }

            i = 0;
            for (i; i < pdfFirstHeaderColumnsCnt; i += 1) {
               pdfRows1.push({text: rows[i], fontSize: 8});
            }

            $scope.pdfModel = {
              content: [
                {
                  table: {
                    headerRows: 1,
                    body: [
                      pdfHeaders1,
                      pdfRows1
                    ]
                  }
                }

              ]
            };
        }

        $scope.showUserUpdatedMessage = false;        
        
        $scope.templateUrl = UrlHelper.user_template;
        $scope.userCreate = true;
        $scope.isNewUser = true;
        $scope.user = {};
        $scope.accountList = [];
        $scope.basicRoles = [];
        $scope.accounts = [];
        $scope.AssignedAccountList = [];
            $scope.user.basicRoles = [];
        $scope.user.accountName = '';
        var options = {
            params:{
                embed:'roles,accounts'
            }
        };
       
        UserAdminstration.item.get(options).then(function(response){
            if (response.status === 200) {
                $scope.isNewUser = false;
            }
            $scope.user = UserAdminstration.item;
            $scope.user_info_active = true;
            $scope.account_access_active = false;
            $scope.userInfo = {};
            $scope.user.org = [];
            $scope.user.permissions = [];
            $scope.user.selectedRoleList = [];
            $scope.userActive = false;
            $scope.showAllAccounts = false;
            $scope.csvAcntArr = [];

            if ($scope.user.active === true) {
                $scope.userActive = true;
            } else if ($scope.user.item &&  $scope.user.item.active === true) {
                $scope.userActive = true;
            }

            if ($scope.user && $scope.user.address) {
                $scope.formattedUserAddress = FormatterService.formatAddress($scope.user.address);
            }

            if ($scope.user && $scope.user.firstName && $scope.user.lastName) {
                $scope.user.fullName = $scope.user.firstName + ' ' + $scope.user.lastName;
                $scope.formattedUserContact = FormatterService.formatContact($scope.user);
            }

            if ($scope.isNewUser === false) {
                if (!BlankCheck.isNull($scope.user.item._embedded.roles)) {
                    $scope.user.selectedRoleList = $scope.user.item._embedded.roles;
                }
                if (!BlankCheck.isNull($scope.user.item._embedded.accounts)) {
                    $scope.accounts = $scope.user.item._embedded.accounts;
                    if ($scope.accounts.length > 0) {
                        for (var i=0;i<$scope.accounts.length;i++) {
                            $scope.accounts[i].name = $scope.accounts[i].name + ' [' + $scope.accounts[i].accountId +']';
                            $scope.csvAcntArr[i]=$scope.accounts[i].name;
                            if ($scope.accounts[i].country) {
                                $scope.accounts[i].name  = $scope.accounts[i].name + ' [' + $scope.accounts[i].country +']';
                            }
                            $scope.accounts[i]._links = {
                                self: {
                                    href: {}
                                }
                            };
                            if (angular.isArray($scope.user.item._links.accounts)) {
                                $scope.accounts[i]._links.self.href = $scope.user.item._links.accounts[i].href;
                            } else {
                                $scope.accounts[i]._links.self.href = $scope.user.item._links.accounts.href;
                            }
                        }
                    }
                    setCsvDefinition();
                }
            }

            

            User.getLoggedInUserInfo().then(function() {
                if($rootScope.portalAdmin || $rootScope.lexmarkAdmin) {
                    $scope.showAllAccounts = true;
                }
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
                }
                else {
                    $scope.showAllAccounts = true;
                }

            });

            $scope.user.addonRoles = [];
            $scope.csvAddOnRolesArr = [];
            $scope.csvPermissionsArr = [];
            var removeParams,
            addonRoleOptions = {
                'params': {
                    customerType: 'lexmark',
                    roleType: 'addon'
                }
            },
            basicRoleOptions =  {
                'params': {
                    customerType: 'lexmark',
                    roleType: 'basic'
                }
            },
            permissionPromiseList = [];

            Roles.get(basicRoleOptions).then(function() {
                $scope.user.basicRoles = Roles.data;
                for (var j=0;j<Roles.data.length; j++) {
                    var tempRole = Roles.data[j];
                    if ($scope.user.selectedRoleList && $scope.user.selectedRoleList.length > 0) {
                        for (var i=0;i<$scope.user.selectedRoleList.length;i++) {
                            if ($scope.user.selectedRoleList[i].roleId === tempRole.roleId) {
                                $scope.basicRole = tempRole.roleId;
                                $scope.basicRoleCsvStr = $scope.user.selectedRoleList[i].description;
                                $scope.setPermissionsForBasic(tempRole.roleId);
                            }
                        }
                        setCsvDefinition();
                    }
                }
                Roles.get(addonRoleOptions).then(function() {
                    if(Roles.data) {
                        var roleList = Roles.data;
                        var ind = 0;
                        for (var j=0; j<roleList.length; j++) {
                            var role = roleList[j];
                            if($scope.user.addonRoles.length < roleList.length) {
                                role.selected = false;
                                if ($scope.user.selectedRoleList && $scope.user.selectedRoleList.length > 0) {
                                    for (var i=0;i<$scope.user.selectedRoleList.length;i++) {

                                        if ($scope.user.selectedRoleList[i].roleId === role.roleId) {
                                            $scope.csvAddOnRolesArr[ind] = $scope.user.selectedRoleList[i].description;
                                            Roles.setItem(role);
                                            role.selected = true;
                                            var options = {
                                                params:{
                                                        'applicationName': 'lexmark'
                                                }
                                            };
                                            var permissionPromise = Roles.item.get(options);
                                            permissionPromiseList.push(permissionPromise);
                                            ind++;
                                        }
                                    }
                                }
                                $scope.user.addonRoles.push(role);
                            }
                        }
                        setCsvDefinition();
                        
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
                            $scope.csvPermissionsArr = $scope.user.permissions;
                            setCsvDefinition();
                        });
                    }
                });
            });
        });

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
                    'applicationName': 'lexmark'
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

        $scope.setPermissionsForBasic = function(roleId){
            for (var i=0;i<$scope.user.basicRoles.length; i++) {
                if ($scope.basicRole
                    && $scope.user.basicRoles[i].roleId.toString() === $scope.basicRole.toString()) {
                    Roles.setItem($scope.user.basicRoles[i]);
                    var options = {
                        params:{
                            'applicationName': 'lexmark'
                        }
                    };
                    Roles.item.get(options).then(function(response) {
                        if (Roles.item && Roles.item.permissions) {
                            for (var i=0; i<Roles.item.permissions.length; i++) {
                                if ($scope.user.permissions.indexOf(Roles.item.permissions[i]) === -1) {
                                    $scope.user.permissions.push(Roles.item.permissions[i]);
                                } else if ($scope.user.permissions && $scope.user.permissions.indexOf(Roles.item.permissions[i])!== -1 
                                    && roleId && $scope.basicRole !== roleId) {
                                    $scope.user.permissions.splice($scope.user.permissions.indexOf(Roles.item.permissions[i]), 1);
                                }
                            }
                        }
                    });
                }
            }
        };

        var updateAdminObjectForSubmit = function(saveStatus) {
            UserAdminstration.newMessage();
            $scope.userInfo = UserAdminstration.item;
            UserAdminstration.addField('ldapId', $scope.user.ldapId);
            UserAdminstration.addField('type', 'INTERNAL');
            if (saveStatus && saveStatus === 'deactivate') {
                UserAdminstration.addField('active', false);
            } else {
                UserAdminstration.addField('active', true);
            }
            UserAdminstration.addField('firstName', $scope.user.firstName);
            UserAdminstration.addField('lastName', $scope.user.lastName);
            UserAdminstration.addField('email', $scope.user.email);
            UserAdminstration.addField('userId', $scope.user.email);
            if ($scope.user.workPhone) {
                UserAdminstration.addField('workPhone', $scope.user.workPhone);
            }

            if ($scope.user.address) {
                var addressInfo = {
                    addressLine1: $scope.user.address.addressLine1,
                    addressLine2: $scope.user.address.addressLine2,
                    city: $scope.user.address.city,
                    state: $scope.user.address.state,
                    country: $scope.user.address.country,
                    postalCode: $scope.user.address.postalCode
                };
            }

            UserAdminstration.addField('address', addressInfo);
            for (var i=0;i<$scope.user.basicRoles.length; i++) {
                if ($scope.basicRole
                    && $scope.user.basicRoles[i].roleId.toString() === $scope.basicRole.toString()) {
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

        var updateAdminObjectForUpdate = function(updateStatus) {
            UserAdminstration.reset();
            UserAdminstration.newMessage();
            $scope.userInfo = UserAdminstration.item;
            UserAdminstration.addField('ldapId', $scope.user.ldapId);
            UserAdminstration.addField('contactId', $scope.user.contactId);
            UserAdminstration.addField('idpId', $scope.user.idpId);
            UserAdminstration.addField('type', 'INTERNAL');            
            if (updateStatus && updateStatus === 'deactivate') {
                UserAdminstration.addField('active', false);
            } else {
                UserAdminstration.addField('active', true);
            }
            UserAdminstration.addField('firstName', $scope.user.firstName);
            UserAdminstration.addField('lastName', $scope.user.lastName);
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
            for (var i=0;i<$scope.user.basicRoles.length; i++) {
                for (var j=0; j<$scope.user.selectedRoleList.length; j++) {
                    var selectedRole = $scope.user.selectedRoleList[j];
                    if ($scope.user.basicRoles[i].roleId.toString() === selectedRole.roleId.toString()) {
                        $scope.user.selectedRoleList.splice(j,1);
                    }
                }
            }

            for (var i=0;i<$scope.user.basicRoles.length; i++) {
                if ($scope.basicRole
                    && $scope.user.basicRoles[i].roleId.toString() === $scope.basicRole.toString()) {
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

        $scope.update = function(status) {
            if(status == undefined){
                // It will be undefined when update button is clicked...
                updateAdminObjectForUpdate($scope.userActive == false? 'deactivate' : 'activate');  
            }else{
                updateAdminObjectForUpdate(status);
            }            
            UserAdminstration.item.postURL = UserAdminstration.url + '/' + $scope.userInfo.userId;
            var options = {
                preventDefaultParams: true
            }
            var deferred = UserAdminstration.put({
                item:  $scope.userInfo
            }, options);

            deferred.then(function(result){                
                if(status === undefined){
                    UserAdminstration.wasUpdated = true;
                    $location.path('/delegated_admin/lexmark_user');
                }
                else{
                    $scope.showUserUpdatedMessage = true;
                    if(status === "deactivate"){
                        $scope.userActive = false;
                    }
                    else if(status === "activate"){
                        $scope.userActive = true;
                    }
                    window.scrollTo(0,0);
                    setCsvDefinition();
                }
            }, function(reason){
                NREUM.noticeError('Failed to update user because: ' + reason);
            });
        };

        $scope.save = function(status) {
            if(status == undefined){
                // It will be undefined when update button is clicked...
                updateAdminObjectForSubmit($scope.userActive == false? 'deactivate' : 'activate');  
            }else{
                updateAdminObjectForSubmit(status);
            }             
            UserAdminstration.item.postURL = UserAdminstration.url;
            var deferred = UserAdminstration.post({
                item:  $scope.userInfo
            });

            deferred.then(function(result){
                if(status === undefined){
                    UserAdminstration.wasUpdated = true;
                    $location.path('/delegated_admin/lexmark_user');
                }
                else{
                    $scope.isNewUser = false;
                    $scope.showUserUpdatedMessage = true;
                    if(status === "deactivate"){
                        $scope.userActive = false;
                    }
                    else if(status === "activate"){
                        $scope.userActive = true;
                    }
                    window.scrollTo(0,0);
                    setCsvDefinition();
                }
            }, function(reason){
                NREUM.noticeError('Failed to create SR because: ' + reason);
            });
        };

        $scope.verifyDeactivateActivate = function(status) {
            $scope.showUserUpdatedMessage = false;
            if (status === 'activate') {
                createModal('activate-confirm-popup');
            } else if (status === 'deactivate') {
                createModal('deactivate-confirm-popup');
            }
        };

        $scope.deactivate = function() {
            if ($scope.isNewUser === true){
                updateAdminObjectForSubmit('deactivate');
            }
            else{
                updateAdminObjectForUpdate('deactivate');
            }
            UserAdminstration.item.postURL = UserAdminstration.url + '/' + $scope.userInfo.userId;
            var options = {
                preventDefaultParams: true
            }
            var deferred = UserAdminstration.put({
                item:  $scope.userInfo
            }, options);

            deferred.then(function(result){
                $scope.showUserUpdatedMessage = true;
                $scope.userActive = false;
                window.scrollTo(0,0);
                setCsvDefinition();              
            }, function(reason){
                NREUM.noticeError('Failed to update user because: ' + reason);
            });
        };

        $scope.activate = function() {
            if ($scope.isNewUser === true){
                $scope.save('activate');
            }
            else{
                $scope.update('activate');
            }
        };

        $scope.saveLexmarkUser = function() {
            if ($scope.isNewUser === true) {
                $scope.save();
            } else {
                $scope.update();
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

       setCsvDefinition();
    }
]);

