define(['angular', 'address', 'utility.gridCustomizationService'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestAddresses')
    .factory('Addresses', [ 'serviceUrl', '$translate','$http','SpringDataRestAdapter',
        'utility.gridCustomizationService',
        function(serviceUrl, $translate, $http, SpringDataRestAdapter, gridCustomizationService) {
            var Addresses = function(){
                this.bindingServiceName = "address";
                var columns = { defaultSet:[], names: [], fields: [] };
                columns = {
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
            };

            Addresses.prototype = gridCustomizationService;


            Addresses.prototype.addFunctions = function(data){
                /*var addressFormatter = function(){
                        return this['destinationAddress']['addressLine1'] +  ' ' +
                        this['destinationAddress']['city'] + ' ' +
                        this['destinationAddress']['stateCode'] + ' ' +
                        this['destinationAddress']['country'];
                    };
                var primaryContactFormatter = function(){
                    return this['_embedded']['primaryContact']['firstName'] + ' ' +
                        this['_embedded']['primaryContact']['lastName'];
                };
                var statusCleaner = function(){
                    //maybe do a translate here?
                    var result = '';
                    switch(this['status']){
                        case 'in_progress':
                            result = 'In Progress';
                            break;
                        case 'submitted':
                            result = 'Submitted';
                            break;
                        case 'completed':
                            result = 'Completed';
                            break;
                        default:
                            result = 'unknown';
                            break;
                    }

                    return result;
                };
                var typeCleaner = function(){
                    var result  = '';
                    switch(this['type']){
                        case 'data_address_add':
                            result = 'Add address';
                            break;
                        case 'data_address_change':
                            result = 'Address change';
                            break;
                        default:
                            result = 'unknown';
                            break;
                    }
                    return result;
                };
                var bookmark = function(){
                    return 'N';
                }; */
                for(var i = 0; i < data.length; ++i){
                    /*data[i].getAddress = addressFormatter;
                    data[i].getPrimaryContact = primaryContactFormatter;
                    data[i].getStatus = statusCleaner;
                    data[i].getType = typeCleaner;
                    data[i].getBookMark = bookmark;*/
                }
                return data;
            };

            Addresses.prototype.getList = function(){
                var addy  = this;
                return addy.addresses;
            };

            Addresses.prototype.getPage = function(page){
                alert('Page is: ' + page);
            };

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
                var url = serviceUrl + '/accounts/' + accountId + '/addresses?page='+page;


                var httpPromise = $http.get(url).success(function (response) {
                        addy.response = angular.toJson(response, true);
                    });

                return SpringDataRestAdapter.process(httpPromise).then(function (processedResponse) {
                    addy.addresses = processedResponse._embeddedItems;
                    addy.page = processedResponse.page;
                    addy.processedResponse = angular.toJson(processedResponse, true);
                });

            };

            return new Addresses();
        }
    ]);
});
