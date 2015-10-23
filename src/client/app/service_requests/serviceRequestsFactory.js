define(['angular', 'serviceRequest'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequests')
    .factory('ServiceRequestService', ['serviceUrl', '$translate', 'HATEAOSFactory',
        function(serviceUrl, $translate, HATEAOSFactory) {
            var ServiceRequests = {
                    serviceName: 'service-requests',
                    embeddedName: 'serviceRequests', //get away from embedded name and move to a function to convert url name to javascript name
                    columns: [
                            {'name': 'id', 'field': 'id', visible:false},
                            {'name': $translate.instant('LABEL.DATE'), 'field': 'createDate'},
                            {'name': $translate.instant('SERVICE_REQUEST.REQUEST_NUMBER'), 'field':'requestNumber'},
                            {'name': $translate.instant('LABEL.TYPE'), 'field':'type'},
                            {'name': $translate.instant('LABEL.STATUS'), 'field':'status'},
                            {'name': $translate.instant('LABEL.PRIMARY_CONTACT'), 'field': ''}
                        ],
                    route: '/service_requests'
            };

        return  new HATEAOSFactory(ServiceRequests);
    }]);
});
