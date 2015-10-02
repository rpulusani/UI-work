define(['angular', 'deviceManagement'], function(angular) {
    'use strict';
    angular.module('mps.deviceManagement')
    .factory('DevicePicker', ['serviceUrl', '$translate', '$http', '$rootScope', 'SpringDataRestAdapter',
        function(serviceUrl, $translate, $http, $rootScope, halAdapter) {
            var DevicePicker = function() {
                this.url = serviceUrl + '/assets';
                this.columns = {
                    defaultSet: []
                };
            };

            DevicePicker.prototype.getColumnDefinition = function(type) {
                this.columns = {
                    'defaultSet':[
                        {'name': $translate.instant('DEVICE_MGT.SERIAL_NO'), 'field': 'serialNumber'},
                        {'name': $translate.instant('DEVICE_MGT.PRODUCT_MODEL'), 'field':'serialNumber'},
                        {'name': $translate.instant('DEVICE_MGT.CUSTOMER_DEVICE_TAG'), 'field':''},
                        {'name': $translate.instant('DEVICE_MGT.IP_ADDRESS'), 'field':'ipAddress'},
                        {'name': $translate.instant('ADDRESS.NAME'), 'field':'getAddressName()'}
                    ],
                    bookmarkColumn: 'getBookMark()'
                };

                return this.columns;
            };

            DevicePicker.prototype.addFunctions = function(data) {
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

            DevicePicker.prototype.getList = function() {
                var device = this;
                return device.devices;
            };
            
            DevicePicker.prototype.resource = function(accountId, page) {
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

            return new DevicePicker();
        }
    ]);
});
