'use strict';
angular.module('mps.serviceRequestAddresses')
.factory('Addresses', ['$resource', 'serviceUrl', 'halInterceptor', '$translate',
    function($resource, serviceUrl, halInterceptor, $translate) {
        var url = serviceUrl + '/accounts/:accountId/addresses/:id';

        var Addresses = function(){

        };

        Addresses.prototype.getColumnDefinition = function(type){
            var columns = { names: [], fields: [] };
            if(type === "data_address_all"){
                columns = {
                  'defaultSet':[
                            {'name': $translate.instant('ADDRESS.NAME'), 'field': 'created'},
                            {'name': $translate.instant('ADDRESS.STORE_NAME'), 'field':'id'},
                            {'name': $translate.instant('ADDRESS.LINE_1'), 'field':''},
                            {'name': $translate.instant('ADDRESS.LINE_2'), 'field':''},
                            {'name': $translate.instant('ADDRESS.CITY'), 'field': ''},
                            {'name': $translate.instant('ADDRESS.STATE_PROVINCE'), 'field': '' },
                            {'name': $translate.instant('ADDRESS.ZIP_POSTAL'), 'field': '' },
                            {'name': $translate.instant('ADDRESS.COUNTRY'), 'field': '' }
                    ],
                    bookmarkColumn: 'getBookMark()'
                };
            }
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


        Addresses.prototype.resouce = function(){
            return  $resource(url, {accountId: '@accountId', id: '@id'}, {
                'update': { method: 'PUT' },
                'query': { method: 'GET', interceptor: halInterceptor }
            });
        };

        return new Addresses();
    }
]);
