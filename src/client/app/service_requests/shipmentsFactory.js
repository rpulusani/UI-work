

angular.module('mps.serviceRequests')
.factory('ShipmentsService', ['serviceUrl', '$translate', 'HATEOASFactory', 'FormatterService',
    function(serviceUrl, $translate, HATEOASFactory, formatter) {
        var Shipments = {
        		serviceName: 'shipmentDetails',
       		 	embeddedName: 'shipment', //get away from embedded name and move to a function to convert url name to javascript name
               columns: 'defaultSet',
               hideBookmark: true,
               
               url: serviceUrl + 'service-requests/shipmentDetails',

   			
      };

    return  new HATEOASFactory(Shipments);
}]);

