define(['angular', 'deviceServiceRequest'], function(angular, contact) {
    'use strict';
    angular.module('mps.serviceRequestDevices')
    .factory('DeviceSearch', ['serviceUrl', '$translate', 'HATEAOSFactory',
        function(serviceUrl, $translate, HATEAOSFactory) {
            var DeviceSearch = {
                serviceName: 'assets',
                columns: [
                    {'name': $translate.instant('DEVICE_MGT.SERIAL_NO'), 'field': 'serialNumber' },
                    {'name': $translate.instant('DEVICE_MGT.PRODUCT_MODEL'), 'field':'productModel'},
                    {'name': $translate.instant('DEVICE_MGT.CUSTOMER_DEVICE_TAG'), 'field':''},
                    {'name': $translate.instant('DEVICE_MGT.IP_ADDRESS'), 'field':'ipAddress'},
                    {'name': $translate.instant('ADDRESS.NAME'), 'field':'getAddressName()'},
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
