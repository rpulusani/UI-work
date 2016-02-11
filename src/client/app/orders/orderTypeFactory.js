define(['angular', 'order', 'hateoasFactory.serviceFactory'], function(angular) {
    'use strict';
    angular.module('mps.orders')
    .factory('OrderTypes', ['serviceUrl', '$translate', 'HATEOASFactory',
        function(serviceUrl, $translate, HATEOASFactory) {
            var OrderTypes = {
                serviceName: 'orders/types',
                embeddedName: 'requestTypes',
                url: serviceUrl + 'orders/types',
                route: '',
                getTranslated: function (){
                    var list = [],
                    self = this,
                    array = self.item['_embedded'].requestTypes;
                    for(var i = 0; i < array.length; ++i){
                        var item = {
                            label: $translate.instant('ORDER_MAN.TYPES.' + array[i]),
                            value: array[i]
                        };
                        list.push(item);
                    }
                    return list;
                },
                getDisplay: function(currentType){
                    return $translate.instant('ORDER_MAN.TYPES.' + currentType);
                }
            };

        return new HATEOASFactory(OrderTypes);
    }]);
});
