'use strict';
angular.module('mps.serviceRequests')
.factory('ServiceRequestService', ['$resource',
    function($resource, mpsApiUri) {
        var url = mpsApiUri + '/service-requests/:id';
        var activity_url = url + '/activities';
        var order_url = url + '/orders';
        var payment_url = url + '/payments';

        return $resource(url, {id: '@id'}, {
            'activities': { method: 'GET', url: activity_url, isArray: true },
            'orders': { method: 'GET', url: order_url },
            'payments': { method: 'GET', url: payment_url, isArray: true }
        });
    }
]);
