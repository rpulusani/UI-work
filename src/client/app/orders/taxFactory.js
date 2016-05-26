

angular.module('mps.orders')
.factory('TaxService', ['serviceUrl', 'HATEOASFactory', 'FormatterService',
    function(serviceUrl, HATEOASFactory, formatter) {

        var TaxItems = {
        		url: serviceUrl + 'orders/tax-info'
        };
    return  new HATEOASFactory(TaxItems);
}]);

