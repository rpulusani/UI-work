define(['angular', 'serviceRequest', 'utility.gridCustomizationService'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequests')
    .factory('ServiceRequestService', ['$resource', 'serviceUrl', 'gridCustomizationService', '$translate',
        function($resource, serviceUrl, gridCustomizationService, $translate) {


            var ServiceRequests = function(){
                this.bindingServiceName = 'service-requests';
                this.columns = {
                    'defaultSet':[
                        {'name': 'id', 'field': 'id', visible:false},
                        {'name': $translate.instant('LABEL.DATE'), 'field': 'createDate'},
                        {'name': $translate.instant('SERVICE_REQUEST.REQUEST_NUMBER'), 'field':'requestNumber'},
                        {'name': $translate.instant('LABEL.TYPE'), 'field':'type'},
                        {'name': $translate.instant('LABEL.STATUS'), 'field':'status'},
                        {'name': $translate.instant('LABEL.PRIMARY_CONTACT'), 'field': ''}
                    ],
                    bookmarkColumn: 'getBookMark()'
                };
                this.templatedUrl = serviceUrl + 'service-requests/';
                //'addresses/?accountId=1-3F2FR9{?page,size,sort}';
                this.paramNames = ['page', 'sort', 'size', 'accountId'];
            };

            ServiceRequests.prototype = gridCustomizationService;

            /*var url = serviceUrl + '/service-requests/:serviceRequestId';
            var activity_url = url + '/activities';
            var order_url = url + '/orders';
            var payment_url = url + '/payments';

            return $resource(url, {serviceRequestId: '@serviceRequestId'}, {
                'activities': { method: 'GET', url: activity_url, isArray: true },
                'orders': { method: 'GET', url: order_url },
                'payments': { method: 'GET', url: payment_url, isArray: true }
            });*/

        return new ServiceRequests();
    }]);
});
