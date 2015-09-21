define(['angular', 'serviceRequest'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequests')
    .factory('ServiceRequestService', ['$resource', 'serviceUrl',
        function($resource, serviceUrl) {
            var url = serviceUrl + '/service-requests/:serviceRequestId';
            var activity_url = url + '/activities';
            var order_url = url + '/orders';
            var payment_url = url + '/payments';

            return $resource(url, {serviceRequestId: '@serviceRequestId'}, {
                'activities': { method: 'GET', url: activity_url, isArray: true },
                'orders': { method: 'GET', url: order_url },
                'payments': { method: 'GET', url: payment_url, isArray: true }
            });
        }
    ]);
});
