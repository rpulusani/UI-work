define(['angular', 'deviceManagement'], function(angular) {
    'use strict';
    angular.module('mps.deviceManagement')
    .factory('Devices', ['serviceUrl', '$translate', '$http', '$rootScope', 'SpringDataRestAdapter','gridCustomizationService',
        function(serviceUrl, $translate, $http, $rootScope, SpringDataRestAdapter, gridCustomizationService) {
            var Devices = function() {
                this.bindingServiceName = "devices";
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
                this.templatedUrl = serviceUrl + 'assets';
                this.paramNames = ['page', 'sort', 'size', 'accountIds'];
            };

            Devices.prototype = gridCustomizationService;

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

            return new Devices();
        }
    ]);
});
