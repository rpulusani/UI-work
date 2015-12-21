define(['angular', 'security'], function(angular) {
    'use strict';
    angular.module('mps.security')
    .factory('SecurityService', ['$rootScope',
        '$q',
        function($rootScope,
            $q) {


            var workingPermissionSet,
            SecurityService = function() {
                workingPermissionSet = $q.defer();
            };




            SecurityService.prototype.isAllowed = function(requestedPermission){
                var self = this,
                pass = false;
                getUser();
                workingPermissionSet.then(function(){
                    if(workingPermissionSet && workingPermissionSet.data){
                        for(var i = 0; i < workingPermissionSet.data.length; ++i){
                            if(workingPermissionSet.data[i] === requestedPermission){
                                pass = true;
                                break;
                            }
                        }
                    }
                    clearLocalPermisionSet();
                }, function(){
                        passe = false;
                });
                return pass;
            };
            function getUser(){
                   $rootScope.currentUser.deferred.promise.then(function() {
                   workingPermissionSet =  $rootScope.currentUser.permissions;
                   if(!workingPermissionSet){
                      getPermissions($rootScope.currentUser).then(function(permissionSet){
                        workingPermissionSet = permissionSet;
                      }, function(defaultPermissionSet){
                        workingPermissionSet = defaultPermissionSet;
                      });

                   }
                });
            }
            function clearLocalPermisionSet (){
                workingPermissionSet = undefined;
            }
            function getPermissions(currentUser){
                var permissions = $q.defer();
                currentUser.links['permissions']().then(function(){
                    permissions.resolve(currentUser['permissions'].data);

                }, function (){
                    permissions.resolve([]);
                });
                return permissions;
            }

            return new SecurityService();
        }
    ]);
});
