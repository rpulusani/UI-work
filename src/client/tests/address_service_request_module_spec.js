// Unit tests for Service Request Addresses module
define(['angular','angular-mocks', 'address'], function(angular, mocks, address) {
    describe('Address Service Request Module', function() {
        var scope,
            httpBackend,
            mockAddressListCtrl,
            mockAddressCtrl,
            location,
            deferred,
            rootScope,
            mockedAddressesFactory;
        beforeEach(module('mps'));
        describe('AddressListController', function(){

            beforeEach(inject(function($rootScope, $httpBackend, $controller, $location, Addresses, $q) {
                var translationPlaceHolder = {};
                var allowMakeChange = false;
                scope = $rootScope.$new();
                rootScope = $rootScope.$new();
                deferred= $q.defer();
                httpBackend = $httpBackend;
                location = $location;

                mockedAddressesFactory = Addresses;
                mockedAddressesFactory.get = function(address){
                    return deferred.promise;
                };
                 mockedAddressesFactory.save = function(address) {
                    address.id = 'assigned';
                    return deferred.promise;
                };

                mockedAddressesFactory.update = function(address) {
                    return deferred.promise;
                };

                mockedAddressesFactory.item = {id:'123', _links: {self: {href: '/account/12345/addresses/123'}}};
                mockedAddressesFactory.route = '/service_requests/addresses';

                mockAddressListCtrl = $controller('AddressListController', {$scope: scope, $rootScope: rootScope,
                    Adresses: mockedAddressesFactory});
                mockAddressCtrl = $controller('AddressController', {$scope: scope, Adresses: mockedAddressesFactory,
                    translationPlaceHolder: translationPlaceHolder, allowMakeChange: allowMakeChange});

                httpBackend.when('GET', 'etc/resources/i18n/en.json').respond({it: 'works'});
                httpBackend.when('GET', '/').respond({it: 'works'});

            }));


            describe('goToCreate', function() {
                it('should take to new page', function() {
                    spyOn(scope, 'goToCreate').and.callThrough();
                    spyOn(location, 'path').and.returnValue('/');
                    scope.goToCreate();
                    expect(mockedAddressesFactory.item).toEqual(undefined);
                    expect(location.path).toHaveBeenCalledWith(mockedAddressesFactory.route + '/new');
                });
            });

           /* describe('goToUpdate', function() {
                it('should take to update page', function() {
                    var address = null;
                    spyOn(location, 'path').and.returnValue('/');
                    scope.currentRowList = [{ entity: {
                            id: 1
                        }
                    }];
                    scope.goToUpdate(address);
                    expect(location.path).toHaveBeenCalledWith('/service_requests/addresses/1/update');
                });
            });*/
            /*describe('goToRemove', function() {
                it('should take to delete page', function() {
                    spyOn(scope, 'goToRemove').and.callThrough();
                    spyOn(location, 'path').and.returnValue('');
                    var testItem = { id: '123', _links:{self: {href: '/account/12345/addresses/123'}}};
                    rootScope.currentSelectedRow = testItem;
                    scope.goToRemove();
                    expect(mockedAddressesFactory.item).toEqual(testItem);
                    expect(location.path).toHaveBeenCalledWith('/service_requests/addresses/123/delete');

                });
            });*/

            /*describe('isSingleSelected', function() {
                it('should be a single item', function() {
                    scope.currentRowList = [{ entity: {
                            id: 1
                        }
                    }];
                    var result = scope.isSingleSelected();
                    expect(result).toBe(true);
                });

                it('should not have a single item', function() {
                    scope.currentRowList = [
                    {
                        entity: {
                            id: 1
                        }
                    },
                    {
                        entity: {
                            id: 2
                        }
                    }
                    ];
                    var result = scope.isSingleSelected();
                    expect(result).toBe(false);
                });
            });*/

            /*describe('isMultipleSelected', function() {
                it('should be a single item', function() {
                    scope.currentRowList = [{ entity: {
                            id: 1
                        }
                    }];
                    var result = scope.isMultipleSelected();
                    expect(result).toBe(false);
                });

                it('should not have a single item', function() {
                    scope.currentRowList = [
                    {
                        entity: {
                            id: 1
                        }
                    },
                    {
                        entity: {
                            id: 2
                        }
                    }
                    ];
                    var result = scope.isMultipleSelected();
                    expect(result).toBe(true);
                });
            });*/


        });

        describe('AddressController', function() {
            var scope, ctrl, location, history, mockedAddressesFactory;

            beforeEach(function (){
                mockedAddressesFactory = {
                    remove: function(address, resolve) {
                        resolve(true);
                    },
                    query: jasmine.createSpy()
                };

                module(function($provide) {
                    $provide.value('Addresses', mockedAddressesFactory);
                });


            beforeEach(inject(function($rootScope, $controller, $location) {
                scope = $rootScope.$new();
                location = $location;
                ctrl = $controller('AddressController', {$scope: scope});
            }));



            describe('goToReview', function() {
                it('should take to review page', function() {
                    spyOn(location, 'path').and.returnValue('/');
                    scope.goToReview({id: 1});
                    expect(location.path).toHaveBeenCalledWith('/service_requests/addresses/1/review');
                });
            });

            describe('setStoreFrontName', function() {
                it('should save store name', function() {
                    scope.address = {name: 'Test Name', id: 1, accountId: '1-74XV2R'};

                   //spyOn(scope, 'setStoreFrontName').and.callThrough();

                    scope.setStoreFrontName();

                    expect(scope.setStoreFrontName).toHaveBeenCalled();
                    expect(scope.address.storeFrontName).toEqual(scope.address.name);
                });
            });

            describe('removeAddress', function() {
                it('should remove an item in $scope.addresses', function() {
                    scope.address = {id: 1, accountId: '1-74XV2R'}; // Address to be removed

                    scope.addresses = [{id: 1, accoundId: '1-74XV2R'}, {id:  2, accountId: '1-74XV2R'}];

                    spyOn(mockedAddressesFactory, 'remove').and.callThrough();
                    scope.removeAddress(scope.addresses[0]);

                    expect(mockedAddressesFactory.remove.calls.count()).toBe(1);
                    expect(mockedAddressesFactory.remove).toHaveBeenCalled();
                    expect(scope.addresses[0]).toEqual({id:  2, accountId: '1-74XV2R'});
                    expect(scope.addresses.length).toEqual(1);
                });
            });
        });
    });

        describe('Routes', function(){
            it('should map routes to controllers', function() {
                inject(function($route) {
                    expect($route.routes['/service_requests/addresses'].controller).toBe('AddressListController');
                    expect($route.routes['/service_requests/addresses'].templateUrl).toEqual('/app/address_service_requests/templates/view.html');
                    expect($route.routes['/service_requests/addresses/new'].templateUrl).toEqual('/app/address_service_requests/templates/new.html');
                });
            });
        });
    });
});
