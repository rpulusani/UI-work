define(['angular', 'address', 'hateoasFactory.serviceFactory'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestAddresses')
    .factory('Addresses', ['serviceUrl', '$translate', '$rootScope', 'HATEOASFactory',
        function(serviceUrl, $translate, rootScope, HATEOASFactory) {
            var Addresses = {
                //params: {page: 0, size: 20, sort: ''},
                //customize Address
                serviceName: 'addresses',
                singular: 'address',
                embeddedName: 'addresses',
                columns: 'default',
                columnDefs: {
                    defaultSet: [
                        {'name': 'id', 'field': 'id', 'notSearchable': true, visible:false},
                        {'name': $translate.instant('ADDRESS.NAME'), 'field': 'name'},
                        {'name': $translate.instant('ADDRESS.STORE_NAME'), 'field':'storeFrontName', visible:false},
                        {'name': $translate.instant('ADDRESS.LINE_1'), 'field':'addressLine1', visible:false},
                        {'name': $translate.instant('ADDRESS.LINE_2'), 'field':'addressLine2', visible:false},
                        {'name': $translate.instant('ADDRESS.CITY'), 'field': 'city', visible:false},
                        {'name': $translate.instant('ADDRESS.STATE_PROVINCE'), 'field': 'stateCode', visible:false},
                        {'name': $translate.instant('ADDRESS.ZIP_POSTAL'), 'field': 'postalCode', visible:false},
                        {'name': $translate.instant('ADDRESS.COUNTRY'), 'field': 'country', visible:false},
                        {'name': $translate.instant('ADDRESS.ADDRESS'), 'field': 'getConcatAddress()'}
                    ]
                },
                route: '/service_requests/addresses',
                functionArray: [
                        {
                            name: 'getConcatAddress',
                            functionDef: function(){
                                var concatString = "";
                                var addressArray = [this.addressLine1, this.addressLine2, this.city, this.stateCode, this.postalCode, this.country];
                                for(var i = 0; i < addressArray.length; i++){
                                    if(addressArray[i] !== null){
                                        if(i === 0){
                                            concatString += addressArray[i];
                                        }else{
                                            concatString += ', ' + addressArray[i];
                                        }
                                    }
                                }
                                return concatString;
                            }
                        }
                ]
            };

            return new HATEOASFactory(Addresses);
        }
    ]);
});
