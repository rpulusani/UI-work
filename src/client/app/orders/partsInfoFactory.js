

angular.module('mps.orders')
.factory('PartsInfo', ['serviceUrl', 'HATEOASFactory',
    function(serviceUrl, HATEOASFactory) {
        var PartsInfo = {
        		url: serviceUrl + 'orders/productModel',
        		columns: 'defaultSet',
                hideBookmark: true,
                columnDefs: {
                    defaultSet: [
                        {'name':'Product Model', 'field':'productModel'},
                        {'name': 'Product Number', 'field': 'productNumber'},
                        {'name': 'Product Name', 'field': 'productName'},
                        {'name': 'Yield', 'field' : 'yield'}                                                
                    ]             
                
              }
       
        		
        };        
       
    return  new HATEOASFactory(PartsInfo);
}]);

