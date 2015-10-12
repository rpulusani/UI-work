define(['angular', 'address', 'utility.gridCustomizationService'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestAddresses')
    .factory('Addresses', [ 'serviceUrl', '$translate','$http','SpringDataRestAdapter',
        'gridCustomizationService',
        function(serviceUrl, $translate, $http, SpringDataRestAdapter, gridCustomizationService) {
            var Addresses = function(){

                //customize Address
                this.bindingServiceName = 'addresses';
                this.columns = {
                    'defaultSet':[
                        {'name': 'id', 'field': 'id', visible:false},
                        {'name': $translate.instant('ADDRESS.NAME'), 'field': 'name'},
                        {'name': $translate.instant('ADDRESS.STORE_NAME'), 'field':'storeFrontName'},
                        {'name': $translate.instant('ADDRESS.LINE_1'), 'field':'addressLine1'},
                        {'name': $translate.instant('ADDRESS.LINE_2'), 'field':'addressLine2'},
                        {'name': $translate.instant('ADDRESS.CITY'), 'field': 'city'},
                        {'name': $translate.instant('ADDRESS.STATE_PROVINCE'), 'field': 'stateCode' },
                        {'name': $translate.instant('ADDRESS.ZIP_POSTAL'), 'field': 'postalCode' },
                        {'name': $translate.instant('ADDRESS.COUNTRY'), 'field': 'country', 'width': 120 }
                    ],
                    bookmarkColumn: 'getBookMark()'
                };

                this.templatedUrl = serviceUrl + 'accounts/1-21AYVOT/addresses/';
                //'addresses/?accountId=1-3F2FR9{?page,size,sort}';
                this.paramNames = ['page', 'sort', 'size', 'accountId'];
            };

            Addresses.prototype = gridCustomizationService;

            Addresses.prototype.get = function(params){
               var addy  = this;
                if(params.id !== 'new'){

                }
               return addy.address;
            };

            Addresses.prototype.save = function(params, saveObject, fn){
                var addy = this;
                if(params.id === 'new'){
                    addy.address = saveObject;
                }else{

                }

                return fn();
            };

            return new Addresses();
        }
    ]);
});
