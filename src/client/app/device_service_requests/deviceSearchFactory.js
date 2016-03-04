define(['angular', 'deviceServiceRequest'], function(angular, contact) {
    'use strict';
    angular.module('mps.serviceRequestDevices')
    .factory('DeviceSearch', ['serviceUrl', '$translate', 'HATEAOSFactory',
        function(serviceUrl, $translate, HATEAOSFactory) {
            var DeviceSearch = {
                serviceName: 'assets',
                columns: [
                    {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_SERIAL_NUMBER'), 'field': 'serialNumber' },
                    {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_PRODUCT_MODEL'), 'field':'productModel'},
                    {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_DEVICE_TAG'), 'field':''},
                    {'name': $translate.instant('REQUEST_MAN.COMMON.TXT_IP_ADDR'), 'field':'ipAddress'},
                    {'name': $translate.instant('REQUEST_MAN.REQUEST_DEVICE_CHANGE_INST_ADDR.TXT_GRID_ADDR_NAME'), 'field':'getAddressName()'},
                    {'name': $translate.instant('LABEL.ACTION'), 'cellTemplate': '<div>' +
                                    '<a ng-href="/device_management/{{row.entity.id}}/review">'+$translate.instant('DEVICE_SERVICE_REQUEST.SELECT_DEVICE')+'</a>' +
                                    '</div>' }

                ],
                route: '/service_requests/devices'
            };
            
            return new HATEAOSFactory(DeviceSearch);
        }
    ]);
});
