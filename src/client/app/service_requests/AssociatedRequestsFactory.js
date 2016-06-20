

angular.module('mps.serviceRequests')
.factory('AssociateRequestService', ['serviceUrl', '$translate', 'HATEOASFactory', 'FormatterService',
    function(serviceUrl, $translate, HATEOASFactory, formatter) {
        var AssociateRequest = {
        		 serviceName: 'associatedRequestDetails',
        		 embeddedName: 'associatedServiceRequests', //get away from embedded name and move to a function to convert url name to javascript name
                columns: 'defaultSet',
                hideBookmark: true,
                url: serviceUrl + 'service-requests/associatedRequestDetails',
                columnDefs: {
                    defaultSet: [
                        {'name':'Date', 'field':'date'},
                        {'name':'Request Number', 'field':'requestNumber'},
                        {'name': 'Type', 'field': 'type'},
                        {'name': 'Status', 'field': 'status'},
                    ],             
                route: '/service_requests'
              }
      };

    return  new HATEOASFactory(AssociateRequest);
}]);

