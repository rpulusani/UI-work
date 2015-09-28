define(['angular', 'deviceManagement'], function(angular) {
    'use strict';
    angular.module('mps.deviceManagement')
    .factory('Devices', ['serviceUrl', '$translate', '$http', '$rootScope', 'SpringDataRestAdapter',
        function(serviceUrl, $translate, $http, $rootScope, halAdapter) {
            var Devices = function() {
                this.url = serviceUrl + '/assets';
                this.columns = {
                    defaultSet: []
                };
            };

            Devices.prototype.getColumnDefinition = function(type) {
                this.columns = {
                    'defaultSet':[
                        {'name': $translate.instant('DEVICE_MGT.SERIAL_NO'), 'field': 'serialNumber', 
                         'cellTemplate':'<div>' +
                                        '<a ng-href="/device_management/{{row.entity.id}}/review">{{row.entity.serialNumber}}</a>' +
                                        '</div>'
                        },
                        {'name': $translate.instant('DEVICE_MGT.PRODUCT_MODEL'), 'field':'serialNumber'},
                        {'name': $translate.instant('DEVICE_MGT.CUSTOMER_DEVICE_TAG'), 'field':''},
                        {'name': $translate.instant('DEVICE_MGT.IP_ADDRESS'), 'field':'ipAddress'},
                        {'name': $translate.instant('ADDRESS.NAME'), 'field':'getAddressName()'}
                    ],
                    bookmarkColumn: 'getBookMark()'
                };

                return this.columns;
            };

            Devices.prototype.addFunctions = function(data) {
                var i = 0,
                addressNameFormatter = function() {
                     return this._embedded.address.name;
                };

                for (i; i < data.length; i += 1) {
                    // TODO: consider moving formattter calls to delegate rather than attach per item
                    data[i].getAddressName = addressNameFormatter;
                }

                return data;
            };

            Devices.prototype.getList = function() {
                var device = this;
                return device.devices;
            };

            Devices.prototype.getPage = function(page) {
                alert('Page is: ' + page);
            };

            Devices.prototype.get = function(params) {
                var device  = this;
                
                if (params.id !== 'new') {

                }

               return device.device;
            };

            Devices.prototype.save = function(params, saveObject, fn) {
                var device = this;

                if (params.id === 'new') {
                    device.device = saveObject;
                } else {

                }

                return fn();
            };

            // TODO:  No longer needs accountId, should be defined in constructor
            Devices.prototype.resource = function(accountId, page, deviceId) {
                var device  = this,
                url = device.url + '?accountIds=' + "'1-21AYVOT'" + '&page=' + page,
                httpPromise = $http.get(url).success(function (response) {
                    device.response = angular.toJson(response, true);
                });

                return halAdapter.process(httpPromise).then(function (processedResponse) {
                    device.devices = processedResponse._embeddedItems;
                    device.page = processedResponse.page;
                    device.processedResponse = angular.toJson(processedResponse, true);
                });
            };

            return new Devices();
        }
    ]);
});
