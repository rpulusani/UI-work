define(['angular', 'address', 'utility.gridCustomizationService'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestAddresses')
    .factory('Addresses', [ 'serviceUrl', '$translate','$http','SpringDataRestAdapter',
        'gridCustomizationService',
        function(serviceUrl, $translate, $http, SpringDataRestAdapter, gridCustomizationService) {
            var Addresses = function(){

                //customize Address
                this.bindingServiceName = "addresses";
                this.columns = {
                    'defaultSet':[
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

                this.resourceUrl = serviceUrl + 'addresses/';
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

            Addresses.prototype.resource = function(accountId, page){
               var addy  = this;
               var params =[
                        {
                            name: 'size',
                            value: '20'
                        },
                        {
                            name: 'accountId',
                            value: accountId
                        },
                        {
                            page: 'page',
                            value: page
                        }
                    ];
                var url = addy.buildURI(params);
                //serviceUrl + '/accounts/' + accountId + '/addresses?page='+page;


                var httpPromise = $http.get(url).success(function (response) {
                        addy.response = angular.toJson(response, true);
                    });

                return SpringDataRestAdapter.process(httpPromise).then(function (processedResponse) {
                    addy.setList(processedResponse._embeddedItems);
                    addy.setPage(processedResponse.page);
                    addy.processedResponse = angular.toJson(processedResponse, true);
                });

            };

            return new Addresses();
        }
    ]);
});
