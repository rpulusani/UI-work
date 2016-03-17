

angular.module('mps.serviceRequests')
.factory('ServiceRequestStatus', ['serviceUrl', '$translate', 'HATEOASFactory',
    function(serviceUrl, $translate, HATEOASFactory) {
        var ServiceRequestStatus = {
            serviceName: 'service-requests',
            embeddedName: 'requestStatuses',
            url: serviceUrl + '/service-requests/statuses',
            route: ''
        };

    return new HATEOASFactory(ServiceRequestStatus);
}]);

