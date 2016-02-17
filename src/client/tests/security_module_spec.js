define(['angular', 'angular-mocks', 'security'], function(angular, mocks) {
    describe('Security Module', function() {
        beforeEach(module('mps'));
        beforeEach(inject(['$httpBackend',function(httpBackend){
            httpBackend.when('GET', 'etc/resources/i18n/en.json').respond({it: 'works'});
        }]));
        describe('SecurityService', function(){
            describe('Constructor', function(){

            });
            describe('isAllowed', function(){
                var rootScope;
                beforeEach(inject(['$timeout','$rootScope','$q', 'UserService', '$httpBackend', function($timeout, $rootScope, $q, Users, $httpBackend){
                    $rootScope.currentUser = {
                            accounts: [
                                {
                                    accountId: '1-21AYVOT',
                                    level: 'GLOBAL'
                                }
                            ],
                            links:{
                                permissions: function(options){
                                    var item = $q.defer();
                                    var resolvingItem = {
                                        permissions:{
                                            data:[
                                                'cat',
                                                'dog',
                                                'rat',
                                                'tiger'
                                            ]
                                        }
                                    };
                                    item.resolve(resolvingItem);
                                    return item.promise;
                                }
                        },
                        deferred: $q.defer()
                    };
                    rootScope = $rootScope;

                    $httpBackend.when('GET', '/').respond({});
                }]));
                it('should find the requested permission because its in the local workingPermissionsSet',
                    inject(['SecurityService','$timeout', function(SecurityService, $timeout){
                        var permissionSet = [
                            'cat',
                            'dog',
                            'rat',
                            'tiger'
                        ],
                        expected = true;

                        rootScope.currentUser.deferred.resolve();
                        SecurityService.prototype.setWorkingPermission(permissionSet);
                        var promise = SecurityService.prototype.isAllowed('cat');
                        promise.then(function(actual){
                            expect(actual).toBe(expected);
                        });
                        $timeout.flush();
                }]));
                it('should find the requested permission localPermissionSet is undefined and will pull remote',
                    inject(['SecurityService','$timeout', function(SecurityService, $timeout){
                        var permissionSet = [
                            'cat',
                            'dog',
                            'rat',
                            'tiger'
                        ],
                        expected = true;

                        rootScope.currentUser.deferred.resolve();
                        SecurityService.prototype.setWorkingPermission(undefined);
                        var promise = SecurityService.prototype.isAllowed('rat');
                        promise.then(function(actual){
                            expect(SecurityService.prototype.workingPermissionSet).toBeDefined();
                            expect(SecurityService.prototype.workingPermissionSet.data).toBeDefined();
                            expect(SecurityService.prototype.workingPermissionSet.data.length).toBe(permissionSet.length);
                            expect(SecurityService.prototype.workingPermissionSet.data[2]).toBe(permissionSet[2]);
                            expect(actual).toBe(expected);
                        });
                        SecurityService.prototype.workingPermissionSet.deferred.resolve();
                        $timeout.flush();
                }]));
                it('should find the requested permission localPermissionsSet is empty and will pull remote',
                    inject(['SecurityService','$timeout', function(SecurityService, $timeout){
                        var permissionSet = [
                            'cat',
                            'dog',
                            'rat',
                            'tiger'
                        ],
                        expected = true;

                        rootScope.currentUser.deferred.resolve();
                        SecurityService.prototype.setWorkingPermission([]);
                        var promise = SecurityService.prototype.isAllowed('rat');
                        promise.then(function(actual){
                            expect(SecurityService.prototype.workingPermissionSet).toBeDefined();
                            expect(SecurityService.prototype.workingPermissionSet.data).toBeDefined();
                            expect(SecurityService.prototype.workingPermissionSet.data.length).toBe(permissionSet.length);
                            expect(SecurityService.prototype.workingPermissionSet.data[2]).toBe(permissionSet[2]);
                            expect(actual).toBe(expected);
                        });
                        SecurityService.prototype.workingPermissionSet.deferred.resolve();
                        $timeout.flush();
                }]));
            });
            describe('requests', function(){
                it('should hold an array of pending requests',
                 inject(['SecurityService', function(SecurityService){
                    var expected = 3;
                    var service = new SecurityService();
                    service.requests = [];
                    var promise1 = service.isAllowed('cat');
                    var promise2 = service.isAllowed('dog');
                    var promise3 = service.isAllowed('rat');

                    expect(service.requests.length).toBe(expected);

                }]));

            });
            describe('deRegister', function(){
                it('should hold nothing in the array of pending requests',
                inject(['SecurityService', function(SecurityService){
                    var expected = 3;
                    var service = new SecurityService();
                    service.requests = [];
                    var promise1 = service.isAllowed('cat');
                    var promise2 = service.isAllowed('dog');
                    var promise3 = service.isAllowed('rat');

                    expect(service.requests.length).toBe(expected);
                    service.deRegister(service.requests[1]);
                    expect(service.requests.length).toBe(2);

                }]));
            });
            describe('checkPermission', function(){
                it('should find the requested permission',
                    inject(['SecurityService', function(SecurityService){
                    var expected = true;
                    SecurityService.prototype.setWorkingPermission(['cat']);
                    var actual = SecurityService.prototype.checkPermission('cat');
                    expect(actual).toBe(expected);
                }]));
                it('should not find the requested permission because of capitalization',
                    inject(['SecurityService', function(SecurityService){
                    var expected = false;

                    SecurityService.prototype.setWorkingPermission(['cat']);
                    var actual = SecurityService.prototype.checkPermission('CAT');
                    expect(actual).toBe(expected);
                }]));
                it('should not find the requested permission because workingPermission is undefined',
                    inject(['SecurityService', function(SecurityService){
                    var expected = false;
                    var actual = SecurityService.prototype.checkPermission('CAT');
                    expect(actual).toBe(expected);
                }]));
                it('should not find the requested permission because workingPermissions data is undefined',
                    inject(['SecurityService', function(SecurityService){
                    var expected = false;
                    SecurityService.prototype.setWorkingPermission(undefined);
                    var actual = SecurityService.prototype.checkPermission('CAT');
                    expect(actual).toBe(expected);
                }]));
                it('should not find the requested permission because workingPermissions data is empty',
                    inject(['SecurityService', function(SecurityService){
                    var expected = false;
                    SecurityService.prototype.setWorkingPermission([]);
                    var actual = SecurityService.prototype.checkPermission('CAT');
                    expect(actual).toBe(expected);
                }]));
                it('should not find the requested permission because requestedPermission is empty',
                    inject(['SecurityService', function(SecurityService){
                    var expected = false;
                    SecurityService.prototype.setWorkingPermission(['cat']);
                    var actual = SecurityService.prototype.checkPermission(undefined);
                    expect(actual).toBe(expected);
                }]));
                it('should not find the requested permission because requestedPermission is a value that does not exist',
                    inject(['SecurityService', function(SecurityService){
                    var expected = false;
                    SecurityService.prototype.setWorkingPermission(['cat']);
                    var actual = SecurityService.prototype.checkPermission('dog');
                    expect(actual).toBe(expected);
                }]));
                it('should not find the requested permission because requestedPermission is a value that contains a permission name, but its not alone',
                    inject(['SecurityService', function(SecurityService){
                    var expected = false;
                    SecurityService.prototype.setWorkingPermission(['cat']);
                    var actual = SecurityService.prototype.checkPermission('catdog');
                    expect(actual).toBe(expected);
                }]));
            });
            describe('getWorkingPermissionSet', function(){
                var rootScope;
                beforeEach(inject(['$timeout','$rootScope','$q', '$httpBackend', function($timeout, $rootScope, $q, $httpBackend) {
                    $rootScope.currentUser = {
                            accounts: [
                                {
                                    accountId: '1-21AYVOT',
                                    level: 'GLOBAL'
                                }
                            ],
                            links:{
                                permissions: function(options){
                                    var item = $q.defer();
                                    var resolvingItem = {
                                        permissions:{
                                            data:[
                                                'cat',
                                                'dog',
                                                'rat',
                                                'tiger'
                                            ]
                                        }
                                    };
                                    item.resolve(resolvingItem);
                                    return item.promise;
                                }
                        },
                        deferred: $q.defer()
                    };
                    rootScope = $rootScope;

                    $httpBackend.when('GET', '/').respond({});
                }]));
                it('should get workSetPermissions that is already been stored locally',
                    inject(['SecurityService','$timeout', function(SecurityService, $timeout){
                        var expected = [
                            'cat',
                            'dog',
                            'rat',
                            'tiger'
                        ];

                        rootScope.currentUser.deferred.resolve();
                        SecurityService.prototype.setWorkingPermission(expected);
                        SecurityService.prototype.getWorkingPermissionSet().then(function(workingPermissionSet){
                            expect(workingPermissionSet).toBeDefined();
                            expect(workingPermissionSet.length).toBe(expected.length);
                            expect(SecurityService.prototype.workingPermissionSet).toBeDefined();
                            expect(SecurityService.prototype.workingPermissionSet.data).toBeDefined();
                            expect(SecurityService.prototype.workingPermissionSet.data.length).toBe(expected.length);
                            expect(SecurityService.prototype.workingPermissionSet.data[0]).toBe(expected[0]);
                        });
                        $timeout.flush();
                }]));
                 it('should not get workSetPermissions that is already been stored locally it must be loaded',
                    inject(['SecurityService','$timeout', function(SecurityService, $timeout){
                        var expected = [
                            'cat',
                            'dog',
                            'rat',
                            'tiger'
                        ];

                        rootScope.currentUser.deferred.resolve();
                        SecurityService.prototype.getWorkingPermissionSet().then(function(workingPermissionSet){
                            expect(workingPermissionSet).toBeDefined();
                            expect(workingPermissionSet).toBeDefined();
                            expect(workingPermissionSet.length).toBe(expected.length);
                            expect(workingPermissionSet[0]).toBe(expected[0]);
                            expect(SecurityService.prototype.workingPermissionSet).toBeDefined();
                            expect(SecurityService.prototype.workingPermissionSet.data).toBeDefined();
                            expect(SecurityService.prototype.workingPermissionSet.data.length).toBe(expected.length);
                            expect(SecurityService.prototype.workingPermissionSet.data[0]).toBe(expected[0]);
                        });
                        $timeout.flush();
                }]));
                it('should not get workSetPermissions that is already been stored locally it must be loaded because  data property is missing',
                    inject(['SecurityService','$timeout', function(SecurityService, $timeout){
                        var expected = [
                            'cat',
                            'dog',
                            'rat',
                            'tiger'
                        ];
                        rootScope.currentUser.deferred.resolve();
                        SecurityService.prototype.setWorkingPermission(undefined);
                        SecurityService.prototype.getWorkingPermissionSet().then(function(workingPermissionSet){
                            expect(workingPermissionSet).toBeDefined();
                            expect(workingPermissionSet).toBeDefined();
                            expect(workingPermissionSet.length).toBe(expected.length);
                            expect(workingPermissionSet[0]).toBe(expected[0]);
                            expect(SecurityService.prototype.workingPermissionSet).toBeDefined();
                            expect(SecurityService.prototype.workingPermissionSet.data).toBeDefined();
                            expect(SecurityService.prototype.workingPermissionSet.data.length).toBe(expected.length);
                            expect(SecurityService.prototype.workingPermissionSet.data[0]).toBe(expected[0]);
                        });
                        $timeout.flush();
                }]));
                it('should not get workSetPermissions that is already been stored locally it must be loaded because  data property is zero elements',
                    inject(['SecurityService','$timeout', function(SecurityService, $timeout){
                        var expected = [
                            'cat',
                            'dog',
                            'rat',
                            'tiger'
                        ];
                        rootScope.currentUser.deferred.resolve();
                        SecurityService.prototype.setWorkingPermission([]);
                        SecurityService.prototype.getWorkingPermissionSet().then(function(workingPermissionSet){
                            expect(workingPermissionSet).toBeDefined();
                            expect(workingPermissionSet).toBeDefined();
                            expect(workingPermissionSet.length).toBe(expected.length);
                            expect(workingPermissionSet[0]).toBe(expected[0]);
                            expect(SecurityService.prototype.workingPermissionSet).toBeDefined();
                            expect(SecurityService.prototype.workingPermissionSet.data).toBeDefined();
                            expect(SecurityService.prototype.workingPermissionSet.data.length).toBe(expected.length);
                            expect(SecurityService.prototype.workingPermissionSet.data[0]).toBe(expected[0]);
                        });
                        $timeout.flush();
                }]));
            });
            describe('getPermissions', function(){
                it('should get back a set of permissions',
                    inject(['SecurityService','$q','$timeout', function(SecurityService, q, $timeout){
                        var expected = [
                            'cat',
                            'dog',
                            'rat',
                            'tiger'
                        ];
                        var currentUser = {
                            accounts: [
                                {
                                    accountId: '123',
                                    level: 'legal'
                                }
                            ],
                            links:{
                                permissions: function(options){
                                    var item = q.defer();
                                    var resolvingItem = {
                                        permissions:expected
                                    };
                                    item.resolve(resolvingItem);
                                    return item.promise;
                                }
                            }
                        };
                        SecurityService.prototype.getPermissions(currentUser).then(function(permissionArray){
                            expect(permissionArray).toBeDefined();
                            expect(permissionArray.length).toBe(expected.length);
                            expect(permissionArray[0]).toBe(expected[0]);
                            expect(permissionArray[3]).toBe(expected[3]);
                        });
                        $timeout.flush();

                }]));
                it('should get back a set of permissions of some rejection reason and array should be empty',
                    inject(['SecurityService','$q', '$timeout', function(SecurityService, q, $timeout){
                        var expected = [];
                        var currentUser = {
                            accounts: [
                                {
                                }
                            ],
                            links:{
                                permissions: function(options){
                                    var item = q.defer();
                                    var resolvingItem = {
                                        permissions:expected
                                    };
                                    item.reject();
                                    return item.promise;
                                }
                            }
                        };
                        SecurityService.prototype.getPermissions(currentUser).then(function(permissionArray){
                            expect(permissionArray).toBeDefined();
                            expect(permissionArray.length).toBe(expected.length);
                        });
                        $timeout.flush();
                }]));
                it('should get back a set of permissions but data array does not exist because permissions is missing data array',
                    inject(['SecurityService','$q', '$timeout', function(SecurityService, q, $timeout){
                        var expected = [];
                        var currentUser = {
                            accounts: [
                                {
                                }
                            ],
                            links:{
                                permissions: function(options){
                                    var item = q.defer();
                                    var resolvingItem = {
                                        permissions:[]
                                    };
                                    item.resolve(resolvingItem);
                                    return item.promise;
                                }
                            }
                        };
                        SecurityService.prototype.getPermissions(currentUser).then(function(permissionArray){
                            expect(permissionArray).toBeDefined();
                            expect(permissionArray.length).toBe(expected.length);
                        });
                        $timeout.flush();
                }]));
                it('should get back a set of permissions but data array does not exist because permissions object does not exist',
                    inject(['SecurityService','$q', '$timeout', function(SecurityService, q, $timeout){
                        var expected = [];
                        var currentUser = {
                            accounts: [
                                {
                                }
                            ],
                            links:{
                                permissions: function(options){
                                    var item = q.defer();
                                    var resolvingItem = {
                                        cat:[]
                                    };
                                    item.resolve(resolvingItem);
                                    return item.promise;
                                }
                            }
                        };
                        SecurityService.prototype.getPermissions(currentUser).then(function(permissionArray){

                        }, function(permissionArray){
                            expect(permissionArray).toBeDefined();
                            expect(permissionArray.length).toBe(expected.length);
                        });
                        $timeout.flush();
                }]));
            });
        });
        describe('SecurityHelper', function(){
            var rootScope;
                beforeEach(inject(['$timeout','$rootScope','$q', function($timeout, $rootScope, $q){
                    $rootScope.currentUser = {
                            accounts: [
                                {
                                    accountId: '1-21AYVOT',
                                    level: 'GLOBAL'
                                }
                            ],
                            links:{
                                permissions: function(options){
                                    var item = $q.defer();
                                    var resolvingItem = {
                                        permissions:{
                                            data:[
                                                'cat',
                                                'dog',
                                                'rat',
                                                'tiger'
                                            ]
                                        }
                                    };
                                    item.resolve(resolvingItem);
                                    return item.promise;
                                }
                        },
                        deferred: $q.defer()
                    };
                    rootScope = $rootScope;
                }]));
            describe('singlePermissionCheck', function(){
                it('should add new property and specify if the scenario has passed',
                    inject(['SecurityHelper', '$timeout','SecurityService', '$q',
                        function(SecurityHelper, $timeout, SecurityService, $q){
                            var scope = rootScope,
                            securityHelper = new SecurityHelper(scope),
                            deferred = $q.defer(),
                            expected = true;
                            spyOn(SecurityService.prototype,'isAllowed').and.callFake(function(){
                                return deferred.promise;
                            });
                            securityHelper.singlePermissionCheck('catAccess', 'cat');
                            deferred.resolve(true);
                            scope.$apply();

                            expect(scope.catAccess).toBeDefined();
                            expect(scope.catAccess).toBe(expected);
                }]));
                it('should add new property and specify if the scenario has not passed',
                    inject(['SecurityHelper', '$timeout','SecurityService', '$q',
                        function(SecurityHelper, $timeout, SecurityService, $q){
                            var scope = rootScope,
                            securityHelper = new SecurityHelper(scope),
                            deferred = $q.defer(),
                            expected = false;
                            spyOn(SecurityService.prototype,'isAllowed').and.callFake(function(){
                                return deferred.promise;
                            });
                            securityHelper.singlePermissionCheck('catAccess', 'cat');
                            deferred.resolve(false);
                            scope.$apply();

                            expect(scope.catAccess).toBeDefined();
                            expect(scope.catAccess).toBe(expected);
                }]));
                it('should not add new property - validate permissionHolderName',
                    inject(['SecurityHelper', '$timeout','SecurityService', '$q',
                        function(SecurityHelper, $timeout, SecurityService, $q){
                            var message = 'permissionCheckHolderName is required parameter!',
                            scope = rootScope,
                            securityHelper = new SecurityHelper(scope);

                            expect(function() { securityHelper.singlePermissionCheck('', 'cat'); }).toThrow(new Error(message));
                }]));
                 it('should not add new property - validate permission',
                    inject(['SecurityHelper', '$timeout','SecurityService', '$q',
                        function(SecurityHelper, $timeout, SecurityService, $q){
                            var message = 'permissionToBeChecked is required parameter!',
                            scope = rootScope,
                            securityHelper = new SecurityHelper(scope);

                            expect(function() { securityHelper.singlePermissionCheck('blah', ''); }).toThrow(new Error(message));
                }]));
            });
            describe('setupPermissionList', function(){
                it('should not add new properties - validate permissionCheckHolderName',
                    inject(['SecurityHelper', '$timeout','SecurityService', '$q',
                        function(SecurityHelper, $timeout, SecurityService, $q){
                            var message = 'permissionCheckHolderName is required parameter!',
                            scope = rootScope,
                            securityHelper = new SecurityHelper(scope);

                            expect(function() { securityHelper.setupPermissionList(); }).toThrow(new Error(message));
                }]));
                it('should not add new properties- validate is an array permissionCheckHolderName - testing with object',
                    inject(['SecurityHelper', '$timeout','SecurityService', '$q',
                        function(SecurityHelper, $timeout, SecurityService, $q){
                            var message = 'permissionCheckList is required to be an array!',
                            scope = rootScope,
                            securityHelper = new SecurityHelper(scope);

                            expect(function() { securityHelper.setupPermissionList({}); }).toThrow(new Error(message));
                }]));
                it('should not add new properties - validate is an array permissionCheckHolderName - testing with string',
                    inject(['SecurityHelper', '$timeout','SecurityService', '$q',
                        function(SecurityHelper, $timeout, SecurityService, $q){
                            var message = 'permissionCheckList is required to be an array!',
                            scope = rootScope,
                            securityHelper = new SecurityHelper(scope);

                            expect(function() { securityHelper.setupPermissionList('blah'); }).toThrow(new Error(message));
                }]));
                it('should not add new properties - validate is an array permissionCheckHolderName - testing with string',
                    inject(['SecurityHelper', '$timeout','SecurityService', '$q',
                        function(SecurityHelper, $timeout, SecurityService, $q){
                            var message = 'permissionCheckList is an array but at index: 0 is missing name property',
                            scope = rootScope,
                            securityHelper = new SecurityHelper(scope);

                            expect(function() { securityHelper.setupPermissionList([{cat:'dog', permission:'rat'}]); }).toThrow(new Error(message));
                }]));
                it('should not add new properties - validate is an array permissionCheckHolderName - testing with string',
                    inject(['SecurityHelper', '$timeout','SecurityService', '$q',
                        function(SecurityHelper, $timeout, SecurityService, $q){
                            var message = 'permissionCheckList is an array but at index: 0 is missing permission property',
                            scope = rootScope,
                            securityHelper = new SecurityHelper(scope);

                            expect(function() { securityHelper.setupPermissionList([{name:'dog', snake:'rat'}]); }).toThrow(new Error(message));
                }]));
            });

        });
    });
});
