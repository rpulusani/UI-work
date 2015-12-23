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
            var workingPermissionSet,
            SecurityService = function() {
                workingPermissionSet = {};
                workingPermissionSet.deferred = $q.defer();
                var workingPermissionSetPromise = getUser();
                 workingPermissionSetPromise.then(function(){
                    workingPermissionSet.deferred.resolve();
                 }, function(){
                    workingPermissionSet.deferred.reject('Problem here');
                });
            };

            SecurityService.prototype.isAllowed = function(requestedPermission){
                var self = this,
                pass = false,
                passPromise = $q.defer();
                if(workingPermissionSet.data && workingPermissionSet.data.length > 0){
                    pass = checkPermission(requestedPermission);
                    passPromise.resolve(pass);
                }else{
                   workingPermissionSet.deferred.promise.then(function(){
                        pass = checkPermission(requestedPermission);
                        passPromise.resolve(pass);
                    },
                    function(reason){
                        passPromise.resolve(pass);
                        //output error message;
                    });
                }
                return passPromise.promise;
            };

            function checkPermission(requestedPermission){
                var pass = false;
                if(workingPermissionSet && workingPermissionSet.data){
                    for(var i = 0; i < workingPermissionSet.data.length; ++i){
                        if(workingPermissionSet.data[i] === requestedPermission){
                            console.log(requestedPermission + " Passed Check");
                            pass = true;
                            break;
                        }
                    }
                }
                return pass;
            }

            function getUser(){
                var workingPermissionSetPromise = $q.defer();
                $rootScope.currentUser.deferred.promise.then(function() {
                   workingPermissionSet.data = $rootScope.currentUser.permissions.data;
                   if(!workingPermissionSet || workingPermissionSet.data && workingPermissionSet.data.length === 0){
                     getPermissions($rootScope.currentUser).then(function(permissionSet){
                        workingPermissionSet.data = permissionSet;
                        $rootScope.currentUser.permissions.data = workingPermissionSet.data;
                        workingPermissionSetPromise.resolve();
                      }, function(defaultPermissionSet){
                        workingPermissionSet.data = defaultPermissionSet;
                        $rootScope.currentUser.permissions.data = workingPermissionSet.data;
                        workingPermissionSetPromise.resolve();
                      });
                   }
                });
                return workingPermissionSetPromise.promise;
            }

            function getPermissions(currentUser){
                var permissions = $q.defer(),
                options = {
                    params: {}
                };
                options.params.accountId = currentUser.accounts[0].accountId;
                options.params.accountLevel = currentUser.accounts[0].level;
               currentUser.links['permissions'](options).then(function(data){
                    if(data.permissions){
                        permissions.resolve(data.permissions);
                    }else{
                        permissions.reject([]);
                    }

                }, function (){
                    permissions.resolve([]);
                });

                return permissions.promise;
            }

            return SecurityService;
        }
    ]);
});
