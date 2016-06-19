

angular.module('mps.serviceRequests')
.factory('ShipmentGridService', ['serviceUrl', '$translate', 'HATEOASFactory', 'FormatterService',
    function(serviceUrl, $translate, HATEOASFactory, formatter) {
        var Shipments = {
        		 serviceName: 'shipmentDetails',
        		 embeddedName: 'shipment', //get away from embedded name and move to a function to convert url name to javascript name
                columns: 'defaultSet',
                hideBookmark: true,
                columnDefs: {
                    defaultSet: [
                        {'name':'Quantity', 'field':'quantity'},
                        {'name': 'Part Number', 'field': 'partNumber'},
                        {'name': 'Part Type', 'field': 'type'},
                        {'name': 'Description', 'field': 'description'}                        
                        
                    ],             
                
              }
      };

    return  new HATEOASFactory(Shipments);
}]);

