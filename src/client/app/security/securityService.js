define(['angular', 'security'], function(angular) {
    'use strict';
    angular.module('mps.security')
    .factory('SecurityService', [
        '$rootScope',
        '$q',
        'UserService',
        function(
            $rootScope,
            $q,
            Users
            ) {
            var SecurityService = function() {

            };
            SecurityService.prototype.requestPermission = null;
            SecurityService.prototype.requests = [];
            SecurityService.prototype.workingPermissionSet = {
                deferred: $q.defer(),
                data:[]
            };
            SecurityService.prototype.isAllowed = function(requestedPermission){
                var self = this,
                pass = false,
                passPromise = $q.defer();
                if(self.workingPermissionSet.data && self.workingPermissionSet.data.length > 0){
                    pass = self.checkPermission(requestedPermission);
                    passPromise.resolve(pass);
                }else{
                    if(!self.requestPermission){
                        self.requestPermission = self.getWorkingPermissionSet();
                    }
                     self.requests.push(self.requestPermission);
                     self.requestPermission.then(function(){
                        self.workingPermissionSet.deferred.resolve();
                        pass = self.checkPermission(requestedPermission);
                        self.deRegister();
                        passPromise.resolve(pass);
                    }, function(){
                        self.deRegister();
                        passPromise.resolve(pass);
                    });
                }
                return passPromise.promise;
            };

            SecurityService.prototype.deRegister = function(){
                var self = this;
                self.requests.pop();
            };

            //this is an or check of permissions as long as one is found.
            SecurityService.prototype.checkPermissions = function(requestedPermissionSet){
                var pass = false,
                    self = this;
                    if(self.workingPermissionSet && self.workingPermissionSet.data){
                        for(var i = 0; i < self.workingPermissionSet.data.length; ++i){
                            for(var j = 0; j < requestedPermissionSet.length; ++j){
                                if(self.workingPermissionSet.data[i] === requestedPermissionSet[j]){
                                    pass = true;
                                    break;
                                }
                            }
                        }
                    }
                return pass;
            };
            SecurityService.prototype.checkPermission = function(requestedPermission){
                var pass = false,
                    self = this;
                if(Object.prototype.toString.call( requestedPermission ) === '[object Array]'){
                    pass = self.checkPermissions(requestedPermission);
                }else{
                    if(self.workingPermissionSet && self.workingPermissionSet.data){
                        for(var i = 0; i < self.workingPermissionSet.data.length; ++i){
                            if(self.workingPermissionSet.data[i] === requestedPermission){
                                pass = true;
                                break;
                            }
                        }
                    }
                }
                return pass;
            };

            SecurityService.prototype.getWorkingPermissionSet = function(){
                var self = this,
                workingPermissionSetPromise = $q.defer();
                $rootScope.currentUser.deferred.promise.then(function() {
                    if(self.workingPermissionSet && (!self.workingPermissionSet.data || self.workingPermissionSet.data.length === 0)){
                        Users.getLoggedInUserInfo().then(function() {
                            self.getPermissions($rootScope.currentUser).then(function(permissionSet){
                                self.workingPermissionSet.data = permissionSet;
                                workingPermissionSetPromise.resolve(self.workingPermissionSet.data);
                            }, function(defaultPermissionSet){
                                self.workingPermissionSet.data = defaultPermissionSet;
                                workingPermissionSetPromise.resolve(self.workingPermissionSet.data);
                            });
                        });
                    }else{
                        workingPermissionSetPromise.resolve(self.workingPermissionSet.data);
                    }
                });
                return workingPermissionSetPromise.promise;
            };

            SecurityService.prototype.getPermissions  = function(currentUser){
                var permissions = $q.defer(),
                options = {
                    params: {}
                },
                defaultPermissionsSet= [];
                if(currentUser.accounts && currentUser.accounts[0] && currentUser.accounts[0].accountId){
                    options.params.accountId = currentUser.accounts[0].accountId;
                    options.params.accountLevel = currentUser.accounts[0].level;

                    currentUser.links['permissions'](options).then(function(data){
                        if(data.permissions && data.permissions.data){
                            permissions.resolve(data.permissions.data);
                        }else if(data.permissions && !data.permissions.data){
                            permissions.resolve(data.permissions);
                        }else{
                            permissions.reject(defaultPermissionsSet);
                        }
                    }, function (){
                        permissions.resolve(defaultPermissionsSet);
                    });
                }else{
                    if (currentUser.type === 'INTERNAL') {
                        //options.preventDefaultParams = true;
                        currentUser.links['permissions']().then(function(data){
                            if(data.permissions && data.permissions.data){
                                permissions.resolve(data.permissions.data);
                            }else if(data.permissions && !data.permissions.data){
                                permissions.resolve(data.permissions);
                            }else{
                                permissions.reject(defaultPermissionsSet);
                            }
                        }, function (){
                            permissions.resolve(defaultPermissionsSet);
                        });
                    } else {
                        permissions.reject(defaultPermissionsSet);
                    }
                    
                }
                return permissions.promise;
            };

            SecurityService.prototype.setWorkingPermission  = function(data){
                var self = this;
                self.workingPermissionSet.data = data;
            };

            return SecurityService;
        }
    ]);
});
