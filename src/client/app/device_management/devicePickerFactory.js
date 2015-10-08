define(['angular', 'deviceManagement'], function(angular) {
    'use strict';
    angular.module('mps.deviceManagement')
    .factory('DevicePicker', ['serviceUrl', '$translate', '$http', 'SpringDataRestAdapter',
        'gridCustomizationService',
        function(serviceUrl, $translate, $http, SpringDataRestAdapter, gridCustomizationService) {
            var DevicePicker = function() {
                this.bindingServiceName = "devicePicker";
                this.columns = this.columns = {
                    'defaultSet':[
                        {'name': $translate.instant('DEVICE_MGT.SERIAL_NO'), 'field': 'serialNumber'},
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
            
            DevicePicker.prototype = gridCustomizationService;

            return new DevicePicker();
        }
    ]);
});
