define(['angular', 'address'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestAddresses')
    .factory('Addresses', [ 'serviceUrl', '$translate','$http','SpringDataRestAdapter',
        function(serviceUrl, $translate, $http, SpringDataRestAdapter) {
            var Addresses = function(){

            };

            Addresses.prototype.getColumnDefinition = function(type){
                var columns = { names: [], fields: [] };
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
                return columns;
            };



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
                var Addy  = this;
                return Addy.addresses;
            };

            Addresses.prototype.getPage = function(page){
                alert('Page is: ' + page);
            };

            Addresses.prototype.resource = function(accountId, page){
               var Addy  = this;
                var url = serviceUrl + '/accounts/' + accountId + '/addresses?page='+page;


                var httpPromise = $http.get(url).success(function (response) {
                        Addy.response = angular.toJson(response, true);
                    });

                return SpringDataRestAdapter.process(httpPromise).then(function (processedResponse) {
                    Addy.addresses = processedResponse._embeddedItems;
                    Addy.page = processedResponse.page;
                    Addy.processedResponse = angular.toJson(processedResponse, true);
                });

            };

            return new Addresses();
        }
    ]);
});
