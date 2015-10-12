define(['angular', 'deviceManagement'], function(angular) {
    'use strict';
    angular.module('mps.deviceManagement')
    .factory('Devices', ['serviceUrl', '$translate', '$http', '$rootScope', 'SpringDataRestAdapter','gridCustomizationService',
        function(serviceUrl, $translate, $http, $rootScope, SpringDataRestAdapter, gridCustomizationService) {
            var Devices = function() {
                this.bindingServiceName = "assets";
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
                this.functionArray = [
                        {
                            name: 'getAddressName',
                            functionDef:  function() {
                                if(this._embedded && this._embedded.address){
                                    return this._embedded.address.name;
                                }else{
                                    return '';
                                }
                            }
                        }
                ];
            };

            Devices.prototype = gridCustomizationService;


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
