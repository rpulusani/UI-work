/* global describe it beforeEach inject expect */
define(['angular', 'angular-mocks', 'deviceManagement', 'deviceServiceRequest'],
  function() {
    describe('Device Management Module', function() {
        beforeEach(module('mps'));

        describe('DeviceListController', function(){
            var scope,
            httpBackend,
            mockDeviceListCtrl,
            location,
            deferred,
            mockDeviceFactory;

            beforeEach(inject(function($rootScope, $httpBackend, $controller, $location, Devices, $q) {
                scope = $rootScope.$new();
                deferred= $q.defer();
                httpBackend = $httpBackend;
                location = $location;

                mockDeviceFactory = Devices;

                mockDeviceFactory.get = function(device) {
                    return deferred.promise;
                };

                mockDeviceFactory.save = function(device) {
                    device.id = 'assigned';
                    return deferred.promise;
                };

                mockDeviceFactory.update = function(device) {
                    return deferred.promise;
                };

                mockDeviceFactory.item = {id:'123', _links: {self: {href: '/assets/123'}}};
                mockDeviceFactory.route = '/device_management';

                mockDeviceListCtrl = $controller('DeviceListController', {$scope: scope, Devices: mockDeviceFactory});

                httpBackend.when('GET', 'etc/resources/i18n/en.json').respond({it: 'works'});
                httpBackend.when('GET', '/').respond({it: 'works'});

            }));

            it('should go to a full device view', function(){
                    spyOn(scope, 'view').and.callThrough();
                    spyOn(location, 'path').and.returnValue('/');

                    scope.device = mockDeviceFactory.item;

                    deferred.resolve();
                    scope.view(scope.device);

                    scope.$digest();
                    expect(location.path).toHaveBeenCalledWith(mockDeviceFactory.route + '/123/review');
            });

        });

        describe('DevicePageCountsController', function() {
            describe('goToReview', function() {
                it('should navigate to device review page', function() {
                    spyOn(location, 'path').and.returnValue('/');
                    var device = {id: '12345'};
                    scope.goToReview(device);
                    expect(location.path).toHaveBeenCalledWith('/device_management/12345/review');
                });
            });
        });

        describe('DeviceController', function() {
            var scope, ctrl, location, mockedFactory, httpBackend;

            beforeEach(function (){
                mockedFactory = {
                    resource: jasmine.createSpy(),
                    devices: jasmine.createSpy()
                };

                module(function($provide) {
                    $provide.value('Devices', mockedFactory);
                });
            });

            beforeEach(inject(function($rootScope, $controller, $location, BlankCheck, $httpBackend, HATEAOSFactory) {
                scope = $rootScope.$new();
                location = $location;
                blankCheck = BlankCheck;
                httpBackend = $httpBackend;
                ctrl = $controller('DeviceController', {$scope: scope});
                var hateaosConfig = {
                    serviceName: 'test',
                    columns: [
                        {
                            'name': 'fullname',
                            'field': '',
                            'cellTemplate':
                                '<div>' +
                                    '<a href="" ng-click="grid.appScope.goToUpdate(row.entity)" ' +
                                    'ng-bind="row.entity.lastName + \', \' +  row.entity.firstName"></a>' +
                                '</div>'
                        },
                        {'name': 'address', 'field': 'address'},
                        {'name': 'work phone', 'field': 'workPhone'},
                        {'name': 'alternate phone', 'field': 'alternatePhone'},
                        {'name': 'email', 'field': 'email'}
                    ],
                    route: ''
                };
                mockFactory = new HATEAOSFactory(hateaosConfig);
                mockFactory.url = 'http://127.0.0.1/test';
                httpBackend.when('GET', mockFactory.url + '/1-ACCT-ID').respond({
                    "serialNumber": "406336990F9Y5",
                    "assetTag": null,
                    "hostName": null,
                    "ipAddress": null,
                    "contractType": null,
                    "assetPhase": null,
                    "costCenter": null,
                    "productModel": null,
                    "partNumber": "Lexmark MS811dn",
                    "machineType": "MS811dn",
                    "installDate": "2014-08-21 00:00:00.0",
                    "id": "1-T7X0-266",
                    "_embedded": {
                        "address": {
                          "name": "Walmart Chile Comercial Limitada",
                          "storeFrontName": null,
                          "addressLine1": "Avda.NeptunoN°720",
                          "addressLine2": null,
                          "city": "PUDAHUEL",
                          "stateCode": null,
                          "province": "Santiago",
                          "county": null,
                          "district": null,
                          "country": "Chile",
                          "countryIsoCode": null,
                          "postalCode": "8991560",
                          "siteId": null,
                          "siteName": null,
                          "buildingId": null,
                          "buildingName": null,
                          "floorId": null,
                          "floorName": null,
                          "zoneId": null,
                          "zoneName": null,
                          "lbsIdentifierFlag": null,
                          "region": null,
                          "latitude": null,
                          "longitude": null,
                          "lbsGridX": null,
                          "lbsGridY": null,
                          "assets": null,
                          "id": "1-CMP8BEW",
                          "state": null
                        },
                        "primaryContact": {
                          "firstName": "TAMARA",
                          "middleName": null,
                          "lastName": "GALLARDO",
                          "email": null,
                          "workPhone": "+000000000",
                          "alternatePhone": "",
                          "department": "",
                          "type": null,
                          "userFavorite": null,
                          "physicalAddress": null,
                          "id": "1-CMN655B"
                        }
                    },
                    "_links" : {
                        "self" : {
                            "href" : mockFactory.url + "/1-ACCT-ID"
                        }
                    }
                });
            }));

            describe('goToReview', function() {
                it('should navigate to device review page', function() {
                    spyOn(location, 'path').and.returnValue('/');
                    var device = {id: '12345'};
                    scope.goToReview(device);
                    expect(location.path).toHaveBeenCalledWith('/device_management/12345/review');
                });
            });
        });

        describe('DeviceInformationController', function() {
            var scope, ctrl, location, blankCheck, mockedFactory, $httpBackend, MockDeviceServiceRequest;

            beforeEach(inject(function($rootScope, $controller, $location, BlankCheck, HATEAOSFactory, $httpBackend,
                Devices, DeviceServiceRequest) {
                scope = $rootScope.$new();
                location = $location;
                blankCheck = BlankCheck;


                MockDeviceServiceRequest = DeviceServiceRequest;
                mockFactory = Devices;
                mockFactory.get = function(device) {
                    return deferred.promise;
                };

                mockFactory.save = function(device) {
                    device.id = 'assigned';
                    return deferred.promise;
                };

                mockFactory.update = function(device) {
                    return deferred.promise;
                };

                mockFactory.route = 'http://127.0.0.1/test';
                mockFactory.item = {
                    "serialNumber": "406336990F9Y5",
                    "assetTag": null,
                    "hostName": null,
                    "ipAddress": null,
                    "contractType": null,
                    "assetPhase": null,
                    "costCenter": null,
                    "productModel": null,
                    "partNumber": "Lexmark MS811dn",
                    "machineType": "MS811dn",
                    "installDate": "2014-08-21 00:00:00.0",
                    "id": "1-T7X0-266",
                    "_embeddedItems": {
                        "address": {
                          "name": "Walmart Chile Comercial Limitada",
                          "storeFrontName": null,
                          "addressLine1": "Avda.NeptunoN°720",
                          "addressLine2": null,
                          "city": "PUDAHUEL",
                          "stateCode": null,
                          "province": "Santiago",
                          "county": null,
                          "district": null,
                          "country": "Chile",
                          "countryIsoCode": null,
                          "postalCode": "8991560",
                          "siteId": null,
                          "siteName": null,
                          "buildingId": null,
                          "buildingName": null,
                          "floorId": null,
                          "floorName": null,
                          "zoneId": null,
                          "zoneName": null,
                          "lbsIdentifierFlag": null,
                          "region": null,
                          "latitude": null,
                          "longitude": null,
                          "lbsGridX": null,
                          "lbsGridY": null,
                          "assets": null,
                          "id": "1-CMP8BEW",
                          "state": null
                        },
                        "primaryContact": {
                          "firstName": "TAMARA",
                          "middleName": null,
                          "lastName": "GALLARDO",
                          "email": null,
                          "workPhone": "+000000000",
                          "alternatePhone": "",
                          "department": "",
                          "type": null,
                          "userFavorite": null,
                          "physicalAddress": null,
                          "id": "1-CMN655B"
                        }
                    },
                    "_links" : {
                        "self" : {
                            "href" : mockFactory.url + "/1-ACCT-ID"
                        },
                        "meterReads": {
                          "href": mockFactory.url + "/1-ACCT-ID/meter-reads"
                        }
                    }
                };

                httpBackend = $httpBackend;
                httpBackend.when('GET', 'etc/resources/i18n/en.json').respond({it: 'works'});
                httpBackend.when('GET', '/').respond({it: 'works'});
                MockDeviceServiceRequest.route = 'http://127.0.0.1/request';

                MockDeviceServiceRequest.get = function(device) {
                    return deferred.promise;
                };

                MockDeviceServiceRequest.save = function(device) {
                    device.id = 'assigned';
                    return deferred.promise;
                };

                MockDeviceServiceRequest.update = function(device) {
                    return deferred.promise;
                };

                ctrl = $controller('DeviceInformationController', {$scope: scope, Devices:mockFactory,
                    DeviceServiceRequest:MockDeviceServiceRequest });

            }));


            describe('btnRequestService', function() {
                it('should direct user to device service request review page', function() {
                    spyOn(scope, 'btnRequestService').and.callThrough();
                    spyOn(location, 'path').and.returnValue('/');

                    scope.btnRequestService(scope.device);
                    expect(location.path).toHaveBeenCalledWith(MockDeviceServiceRequest.route + '/' + scope.device.id +'/review');
                });
            });
        });

        describe('Routes', function(){
            it('should map routes to controllers', function() {
                inject(function($route) {
                    expect($route.routes['/device_management'].controller).toBe('DeviceListController');
                    expect($route.routes['/device_management'].templateUrl)
                                .toEqual('/app/device_management/templates/view.html');
                });
            });
        });
    });
});
