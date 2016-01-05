define(['angular', 'security'], function(angular) {
    'use strict';
    angular.module('mps.security')
    .factory('SecurityService', [
        '$rootScope',
        '$q',
        function(
            $rootScope,
            $q
            ) {
            var SecurityService = function() {

            };
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
                    var workingPermissionSetPromise = self.getWorkingPermissionSet();
                    workingPermissionSetPromise.then(function(){
                        self.workingPermissionSet.deferred.resolve();
                        pass = self.checkPermission(requestedPermission);
                        passPromise.resolve(pass);
                    }, function(){
                        passPromise.resolve(pass);
                    });
                }
                return passPromise.promise;
            };

            SecurityService.prototype.checkPermission = function(requestedPermission){
                var pass = false,
                self = this;
                if(self.workingPermissionSet && self.workingPermissionSet.data){
                    for(var i = 0; i < self.workingPermissionSet.data.length; ++i){
                        if(self.workingPermissionSet.data[i] === requestedPermission){
                            console.log(requestedPermission + " Passed Check");
                            pass = true;
                            break;
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
                        self.getPermissions($rootScope.currentUser).then(function(permissionSet){
                            self.workingPermissionSet.data = permissionSet;
                            workingPermissionSetPromise.resolve(self.workingPermissionSet.data);
                        }, function(defaultPermissionSet){
                            self.workingPermissionSet.data = defaultPermissionSet;
                            workingPermissionSetPromise.resolve(self.workingPermissionSet.data);
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
                    angular.element(document.getElementsByTagName('body')).attr('style','');
                }, function (){
                    permissions.resolve(defaultPermissionsSet);
                });

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
