define(['angular', 'deviceManagement'], function(angular) {
    'use strict';
    angular.module('mps.deviceManagement')
    .factory('Devices', ['serviceUrl', '$translate', '$rootScope', 'HATEAOSFactory',
        function(serviceUrl, $translate,$rootScope, HATEAOSFactory) {
            var Devices = {
                serviceName: "assets",
                embeddedName: "assets",
                columns: [
                        {'name': $translate.instant('DEVICE_MGT.SERIAL_NO'), 'field': 'serialNumber',
                         'cellTemplate':'<div>' +
                                            '<a href="#" ng-click="grid.appScope.view(row.entity);">{{row.entity.serialNumber}}</a>' +
                                        '</div>'
                        },
                        {'name': $translate.instant('DEVICE_MGT.PRODUCT_MODEL'), 'field':'serialNumber'},
                        {'name': $translate.instant('DEVICE_MGT.CUSTOMER_DEVICE_TAG'), 'field':''},
                        {'name': $translate.instant('DEVICE_MGT.IP_ADDRESS'), 'field':'ipAddress'},
                        {'name': $translate.instant('ADDRESS.NAME'), 'field':'getAddressName()'}
                ],
                route: '/device_management',
                functionArray: [
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
                ]
            };

            return new HATEAOSFactory(Devices);
        }
    ]);
});
