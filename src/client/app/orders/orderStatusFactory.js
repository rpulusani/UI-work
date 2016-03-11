

angular.module('mps.orders')
.factory('OrderStatus', ['serviceUrl', '$translate', 'HATEOASFactory',
    function(serviceUrl, $translate, HATEOASFactory) {
        var OrderStatus = {
            serviceName: 'orders',
            embeddedName: 'requestStatuses',
            url: serviceUrl + 'orders/statuses',
            route: ''
        };

    return new HATEOASFactory(OrderStatus);
}]);

