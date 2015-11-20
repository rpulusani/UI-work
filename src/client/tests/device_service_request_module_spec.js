define(['angular','angular-mocks', 'deviceServiceRequest'], function(angular, mocks, deviceServiceRequest) {
    describe('Device Service Request Module', function() {
        beforeEach(module('mps'));

        describe('DeviceAddController', function() {
            var scope, ctrl, location;

            beforeEach(inject(function($rootScope, $controller, $location) {
                scope = $rootScope.$new();
                rootScope = $rootScope;
                location = $location;
                ctrl = $controller('DeviceAddController', {$scope: scope});
            }));

            describe('goToBrowse', function() {
                it('should take to device picker page', function() {
                    spyOn(location, 'path').and.returnValue('/');
                    var device = [{id: 1}];
                    scope.goToBrowse(device);
                    expect(location.path).toHaveBeenCalledWith('/device_management/pick_device');
                });
            });

            describe('goToContactPicker', function() {
                it('should take to contact picker page', function() {
                    spyOn(location, 'path').and.returnValue('/');
                    var device = [{id: 1}];
                    scope.goToContactPicker(device);
                    expect(location.path).toHaveBeenCalledWith('/service_requests/devices/pick_contact');
                });
            });

            describe('isDeviceSelected', function() {
                beforeEach(inject(function($routeParams, $controller){
                    $routeParams.return = 'return';
                    ctrl = $controller('DeviceAddController', {$scope: scope});
                }));
                it('should decide whether device selected or not', function() {
                    rootScope.currentRowList = [{ entity: {
                            id: 1
                        }
                    }];
                    var checkOutput = scope.isDeviceSelected();
                    expect(checkOutput).toBe(true);
                });
            });

            describe('goToReview', function() {
                it('should decide review page should be displayed', function() {
                    scope.isReview = false;
                    scope.goToReview();
                    expect(scope.isReview).toBe(true);
                });
            });

            describe('goToAdd', function() {
                it('should decide add page should be displayed', function() {
                    scope.isReview = true;
                    scope.goToAdd();
                    expect(scope.isReview).toBe(false);
                });
            });

            describe('goToSubmit', function() {
                it('should decide submit page should be displayed', function() {
                    scope.isSubmitted = false;
                    scope.goToSubmit();
                    expect(scope.isSubmitted).toBe(true);
                });
            });

            describe('goToCreate', function() {
                it('should navigate to add a new device page', function() {
                    spyOn(location, 'path').and.returnValue('/');
                    scope.goToCreate();
                    expect(location.path).toHaveBeenCalledWith('/service_requests/devices/new');
                });
            });
        });


        describe('DeviceSearchController', function() {
            var scope, ctrl, location;

            beforeEach(inject(function($rootScope, $controller, $location) {
                scope = $rootScope.$new();
                rootScope = $rootScope;
                location = $location;
                ctrl = $controller('DeviceSearchController', {$scope: scope});
            }));


            describe('goToSubmit', function() {
                it('should handle the submit request', function() {

                });
            });

            describe('queryBySerial', function() {
                it('should perform a query based on serial', function() {
                    var serial = 'DEVICE_SERIAL';
                    spyOn(scope, 'queryBySerial');
                    scope.serial = serial;
                    scope.queryBySerial(scope.serial);
                    expect(scope.queryBySerial).toHaveBeenCalledWith(serial);
                });
            });
        });

        describe('DeviceDecommissionController', function() {
            var scope, ctrl, location;

            beforeEach(inject(function($rootScope, $controller, $location) {
                scope = $rootScope.$new();
                rootScope = $rootScope;
                location = $location;
                ctrl = $controller('DeviceDecommissionController', {$scope: scope});
            }));
            //Commenting until implementation
            /*describe('goToReview', function() {
                it('should handle the review request', function() {

                });
            });

            describe('goToSubmit', function() {
                it('should handle the submit request', function() {

                });
            });*/
        });
/*
        describe('DeviceUpdateController', function() {
            var scope, ctrl, location, form, deferred, blankCheck, mockedFactory, $httpBackend,
            MockDeviceServiceRequest, mockContacts, compile;

            beforeEach(inject(function($rootScope, $controller, $location, $compile, $q, BlankCheck, HATEAOSFactory, $httpBackend,
                Devices, DeviceServiceRequest, Contacts) {
                scope = $rootScope.$new();
                rootScope = $rootScope;
                location = $location;
                compile = $compile;
                deferred = $q.defer();
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

                MockDeviceServiceRequest.saveMADC = function(device) {
                    location.path(MockDeviceServiceRequest.route + '/update/' + device.id + '/receipt');
                    return deferred.promise;
                };

                MockDeviceServiceRequest.update = function(device) {
                    return deferred.promise;
                };

                mockContacts = Contacts;
                mockContacts.get = function(item){
                  return deferred.promise;
                };
                mockContacts.save = function(item) {
                    item.id = 'assigned';
                    return deferred.promise;
                };
                mockContacts.update = function(item) {
                    return deferred.promise;
                };

                mockContacts.serviceName = 'contact';

                $rootScope.currentUser = {
                    item: {
                        data: {} 
                    }
                };

                $rootScope.currentUser.item.data = {
                    "id": "122345",
                    "userId": "122345",
                    "idpId": "122345",
                    "contactId": "122345",
                    "type": "enduser",
                    "created": "2015-01-26 00:00:00",
                    "createdBy": "12342",
                    "updated": "2015-01-26 00:00:00",
                    "updatedBy": "12342",
                    "invitedStatus": "pending",
                    "activeStatus": "Y",
                    "resetPassword": "Y",
                    "firstName": "shankar",
                    "lastName": "matta",
                    "email": "test@test.com",
                    "password": "tbd",
                    "workPhone": "111-11-1111",
                    "address1": "111-11-1111",
                    "address2": "111-11-1111",
                    "city": "lexington",
                    "country": "usa",
                    "state": "ky",
                    "postalCode": "40509",
                    "preferredLanguage": "en_US",
                    "permissions": [
                    "viewInvoices"
                    ],
                    "_links": {
                    "self": {
                      "href": "/users/{userId}"
                    },
                    "accounts": [
                      {
                        "href": "/accounts/123"
                      }
                    ],
                    "roles": [
                      {
                        "href": "/roles/123"
                      }
                    ],
                    "contact": {
                      "href": "/contacts/{contactId}"
                    }
                  },
                  "_embedded": {
                    "accounts": [
                      {
                        "name": "string",
                        "id": 0,
                        "additionalProperties": "tbd"
                      }
                    ],
                    "roles": [
                      {
                        "roleId": "122345",
                        "description": "account manager",
                        "permissions": [
                          "viewInvoices"
                        ],
                        "_links": {
                          "self": {
                            "href": "/roles/{applicationName}/{roleId}"
                          }
                        }
                      }
                    ],
                    "preferences": [
                      "SEND EMAIL ETC"
                    ]
                  }
                };

                element = angular.element(
                    '<form name="updateDevice">' +
                    '   <input name="myFirst" ng-model="myFirst"></input>' +
                    '   <input name="mySecond" ng-model="mySecond"></input>' +
                    '</form>'
                );
                element = compile(element)(scope);

                ctrl = $controller('DeviceUpdateController', {$scope: scope, Devices:mockFactory,
                    DeviceServiceRequest:MockDeviceServiceRequest, Contacts:mockContacts});
            }));


            describe('goToContactPicker', function() {
                it('should take to contact picker page', function() {
                    spyOn(location, 'path').and.returnValue('/');
                    var currentSelected = 'updateDeviceContact';

                    scope.goToContactPicker();
                    expect(location.path).toHaveBeenCalledWith('http://127.0.0.1/request/pick_contact');
                });
            });

            describe('goToReview', function() {
                it('should take the user to the review page based on device id', function() {
                    spyOn(location, 'path').and.returnValue('/');
                    scope.device.id='1234';
                    scope.goToReview();
                    expect(location.path).toHaveBeenCalledWith('http://127.0.0.1/request/update/1234/review');
                });
            });

            describe('goToSubmit', function() {
                it('should take the user to the receipt page', function() {
                    spyOn(location, 'path').and.returnValue('/');
                    scope.device.id="1234";
                    scope.madcDevice = {
                        "id": "1234",
                        "type":"DATA_ASSET_CHANGE",
                        "assetInfo":{
                            "ipAddress":"10.19.136.24",
                            "hostName":null,
                            "assetTag":"DHSPRN05111",
                            "costCenter":"211"
                        },
                        "notes":"",
                        "customerReferenceNumber":"1221",
                        "_links":{
                            "self":{
                                "href":"https://api.venus-dev.lexmark.com/mps/contacts/1-RGUUJBD"
                            },
                            "account":{
                                "href":"https://api.venus-dev.lexmark.com/mps/accounts/1-13PHWSV"
                            },
                            "primaryContact":{
                                "href":"https://api.venus-dev.lexmark.com/mps/contacts/1-H2DNJ8"
                            },
                            "requester":{
                                "href":"https://api.venus-dev.lexmark.com/mps/contacts/1-RGUUJBD"
                            },
                            "sourceAddress":{
                                "href":"https://api.venus-dev.lexmark.com/mps/accounts/62117/addresses/1-RGUUJBD"
                            },
                            "asset":{
                                "href":"https://api.venus-dev.lexmark.com/mps/assets/1-NC6G-247"
                            }
                        }
                    };

                    spyOn(scope, 'goToSubmit').and.callThrough();
                    spyOn(MockDeviceServiceRequest, 'saveMADC').and.callThrough();
                    scope.goToSubmit();
                    expect(MockDeviceServiceRequest.saveMADC).toHaveBeenCalledWith(scope.madcDevice);
                    expect(location.path).toHaveBeenCalledWith('http://127.0.0.1/request/update/1234/receipt');
                });
            });

            describe('getChangedValues', function() {
                it('should return all the values changed in a form', function() {
                    spyOn(location, 'path').and.returnValue('/');
                    var currentSelected = 'updateDeviceContact',
                    expectedArr = ['myFirst'];
                    scope.updateDevice.myFirst.$pristine = false;
                    var updateArr = scope.getChangedValues();
                    expect(updateArr).toEqual(expectedArr);
                });
            });

        });

        describe('Routes', function(){
            it('should map routes to controllers', function() {
                inject(function($route) {
                    expect($route.routes['/service_requests/devices/new'].controller).toBe('DeviceAddController');
                    expect($route.routes['/service_requests/devices/new'].templateUrl).toEqual('/app/device_service_requests/templates/new.html');
                    expect($route.routes['/service_requests/devices/pick_contact'].controller).toBe('ContactPickerController');
                    expect($route.routes['/service_requests/devices/pick_contact'].templateUrl).toEqual('/app/device_service_requests/templates/contact-picker.html');
                    expect($route.routes['/service_requests/devices/search'].controller).toBe('DeviceSearchController');
                    expect($route.routes['/service_requests/devices/search'].templateUrl).toEqual('/app/device_service_requests/templates/search.html');
                });
            });
        });*/
    });
});
